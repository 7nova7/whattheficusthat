import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ProductData {
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  palmstreet_url: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate it's a PalmStreet URL
    if (!url.includes('palmstreet.app')) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL must be a PalmStreet link' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client for storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Scraping PalmStreet URL:', url);

    // Scrape the page using Firecrawl
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown', 'html'],
        onlyMainContent: false, // Get full page to capture all content
        waitFor: 3000, // Wait for JS to render
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Request failed with status ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract product data from the scraped content
    const markdown = data.data?.markdown || data.markdown || '';
    const html = data.data?.html || data.html || '';
    const metadata = data.data?.metadata || data.metadata || {};

    // Parse product information
    const productData = extractProductData(markdown, html, metadata, url);

    if (!productData.name) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not extract product name from page' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download and upload image to permanent storage
    if (productData.image_url) {
      try {
        console.log('Downloading image:', productData.image_url);
        
        // Try downloading with proper headers
        const imageResponse = await fetch(productData.image_url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': 'https://palmstreet.app/',
          },
        });
        
        if (imageResponse.ok) {
          const imageBlob = await imageResponse.blob();
          const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
          const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
          const fileName = `palmstreet-${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, imageBlob, {
              contentType,
              upsert: false,
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
          } else {
            // Get public URL
            const { data: publicUrlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(fileName);
            
            productData.image_url = publicUrlData.publicUrl;
            console.log('Image uploaded successfully:', productData.image_url);
          }
        } else {
          console.error('Failed to download image:', imageResponse.status);
          // Keep original URL if download fails
        }
      } catch (imgError) {
        console.error('Error processing image:', imgError);
        // Keep the original URL if upload fails
      }
    }

    console.log('Extracted product data:', productData);

    return new Response(
      JSON.stringify({ success: true, data: productData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scraping PalmStreet:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape page';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractProductData(markdown: string, html: string, metadata: Record<string, unknown>, url: string): ProductData {
  let name = '';
  let price = 0;
  let description: string | null = null;
  let image_url: string | null = null;

  // Extract name from HTML h1 element (most reliable)
  const h1Match = html.match(/<h1[^>]*class="[^"]*mui-17ixdys[^"]*"[^>]*>([^<]+)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    name = h1Match[1].trim();
  }
  
  // Fallback: Try to get title from metadata
  if (!name && metadata.title && typeof metadata.title === 'string') {
    name = metadata.title.replace(/\s*[-|]\s*PalmStreet.*$/i, '').trim();
    // Also clean up the price suffix from the title
    name = name.replace(/\s*\(\$\d+(?:\.\d{2})?\)\s*from\s*@\w+$/i, '').trim();
  }

  // Extract price from the price span
  const priceMatch = html.match(/<span[^>]*class="[^"]*mui-izg579[^"]*"[^>]*>\$?([\d,.]+)<\/span>/i);
  if (priceMatch && priceMatch[1]) {
    price = parseFloat(priceMatch[1].replace(/,/g, ''));
  }
  
  // Fallback price extraction
  if (!price) {
    const pricePatterns = [
      /\$([\d,]+(?:\.\d{2})?)/,
      /Price[:\s]*\$?([\d,]+(?:\.\d{2})?)/i,
    ];
    for (const pattern of pricePatterns) {
      const match = markdown.match(pattern) || html.match(pattern);
      if (match) {
        price = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }
  }

  // Extract FULL description from the product description section
  // Look for the "Product description" section in HTML
  const descSectionMatch = html.match(/<h3[^>]*>Product description<\/h3>\s*<p[^>]*class="[^"]*mui-zytwzq[^"]*"[^>]*>([^<]+)<\/p>/i);
  if (descSectionMatch && descSectionMatch[1]) {
    description = descSectionMatch[1].trim();
  }
  
  // Also try to find description in a more generic way
  if (!description) {
    const descMatch = html.match(/class="[^"]*mui-zytwzq[^"]*"[^>]*>([^<]+)</i);
    if (descMatch && descMatch[1] && descMatch[1].length > 10) {
      description = descMatch[1].trim();
    }
  }

  // Fallback to metadata description
  if (!description && metadata.description && typeof metadata.description === 'string') {
    description = metadata.description.trim();
  }

  // Extract image URL - get the direct ogcdn URL from plantstory resize URL
  // Pattern: https://api.plantstory.app/imaginary/resize?url=https://ogcdn.palmstreet.app/...
  const resizeUrlMatch = html.match(/src="https:\/\/api\.plantstory\.app\/imaginary\/resize\?url=(https:\/\/ogcdn\.palmstreet\.app\/[^&"]+)/i);
  if (resizeUrlMatch && resizeUrlMatch[1]) {
    // Use the direct ogcdn URL which is more reliable
    image_url = decodeURIComponent(resizeUrlMatch[1]);
  }
  
  // Fallback: Try to get direct ogcdn URL
  if (!image_url) {
    const ogcdnMatch = html.match(/(https:\/\/ogcdn\.palmstreet\.app\/[^"'\s&]+\.(?:jpg|jpeg|png|webp))/i);
    if (ogcdnMatch && ogcdnMatch[1]) {
      image_url = ogcdnMatch[1];
    }
  }

  // Fallback: Check og:image metadata
  if (!image_url && metadata.ogImage && typeof metadata.ogImage === 'string') {
    // Extract direct URL from ogImage if it's a resize URL
    const ogImageMatch = (metadata.ogImage as string).match(/url=(https:\/\/ogcdn\.palmstreet\.app\/[^&]+)/);
    if (ogImageMatch) {
      image_url = decodeURIComponent(ogImageMatch[1]);
    } else {
      image_url = metadata.ogImage as string;
    }
  }

  return {
    name,
    price,
    description,
    image_url,
    palmstreet_url: url,
  };
}
