
# Replace Hero Background with Ficus Image

## What Will Change

The hero section will use your uploaded ficus plant image as the full-screen background instead of the current cactus image, while keeping the existing layout intact.

## Design Approach

Since your ficus image has a light pink/cream background, I'll need to adjust the overlay and text colors to ensure readability:

1. **Replace the background image** with your uploaded ficus photo
2. **Adjust the gradient overlay** - use a lighter, softer overlay that works with the image's light tones
3. **Update text colors** - switch to darker text colors (forest green/primary) so they're visible against the light background
4. **Use `background-size: cover`** and `background-position: center`** to ensure the ficus fills the screen and stays centered

The text and buttons will remain in the same position (centered at the top), positioned above the ficus which will fill the background.

---

## Technical Details

### File to Modify

| File | Change |
|------|--------|
| `src/components/home/HeroSection.tsx` | Replace background URL with ficus image; adjust overlay and text colors for light background |

### Specific Changes

1. **Background image URL**: Change from Unsplash cactus to `/lovable-uploads/6981c508-f88f-4bdf-baa6-6c416cf4c78d.png`

2. **Gradient overlay**: Lighten it significantly since the ficus image is already light - use a subtle white/cream overlay instead of dark green

3. **Text colors**: Change heading and tagline from `text-accent` (terracotta) to `text-primary` (dark forest green) for better contrast against the light background

4. **Badge styling**: Adjust the backdrop to work with the light background

5. **Scroll indicator**: Update to use a dark color instead of light

