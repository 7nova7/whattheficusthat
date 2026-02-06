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
        onlyMainContent: true,
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
        const imageResponse = await fetch(productData.image_url);
        
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

  // Try to get title from metadata first
  if (metadata.title && typeof metadata.title === 'string') {
    // Clean up the title - remove site name suffix
    name = metadata.title.replace(/\s*[-|]\s*PalmStreet.*$/i, '').trim();
  }

  // Try to extract name from markdown if not found
  if (!name) {
    // Look for the first heading
    const headingMatch = markdown.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      name = headingMatch[1].trim();
    }
  }

  // Extract price - look for dollar amounts
  const pricePatterns = [
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/,  // $25.00 or $1,000.00
    /Price[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i, // Price: 25.00
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|dollars?)/i, // 25.00 USD
  ];

  for (const pattern of pricePatterns) {
    const match = markdown.match(pattern) || html.match(pattern);
    if (match) {
      price = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }

  // Extract description from metadata first
  if (metadata.description && typeof metadata.description === 'string') {
    description = metadata.description.trim();
  }

  // Try to extract description from markdown if not in metadata
  if (!description) {
    // Look for description patterns in markdown
    const descPatterns = [
      /(?:description|about|details)[:\s]*\n?(.+?)(?:\n\n|$)/is,
      /^(?!#)(?!.*\$)(.{50,500}?)(?:\n\n|$)/m, // A paragraph of decent length without $ or heading
    ];

    for (const pattern of descPatterns) {
      const match = markdown.match(pattern);
      if (match && match[1]) {
        const cleaned = match[1].trim()
          .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
          .replace(/[*_#`]/g, '') // Remove markdown formatting
          .trim();
        if (cleaned.length > 20) {
          description = cleaned;
          break;
        }
      }
    }
  }

  // Extract image URL from HTML - look for og:image first (most reliable)
  const imgPatterns = [
    /property="og:image"[^>]+content="([^"]+)"/i,
    /content="([^"]+)"[^>]+property="og:image"/i,
    /<img[^>]+src="([^"]+(?:palmstreet|plant|product)[^"]*\.(?:jpg|jpeg|png|webp))"/i,
    /<img[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp))"/i,
  ];

  for (const pattern of imgPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      image_url = match[1];
      // Make sure it's an absolute URL
      if (image_url.startsWith('/')) {
        image_url = `https://palmstreet.app${image_url}`;
      }
      break;
    }
  }

  // Check metadata for image
  if (!image_url && metadata.ogImage && typeof metadata.ogImage === 'string') {
    image_url = metadata.ogImage;
  }

  return {
    name,
    price,
    description,
    image_url,
    palmstreet_url: url,
  };
}
