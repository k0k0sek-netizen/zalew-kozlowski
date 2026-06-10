import os
from PIL import Image
import colorsys

img_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon.png.bak"
if not os.path.exists(img_path):
    print("Backup does not exist")
    exit(1)

img = Image.open(img_path).convert("RGBA")
width, height = img.size

# Let's find green/blue pixels in the bottom right quadrant
# In the original:
# Fish was green? Or was fish blue? Wait, in the original logo, what were the colors?
# Let's inspect the distribution of hues (h_deg) and coordinates (x, y) for pixels with alpha > 0.

print(f"Dimensions: {width}x{height}")
hues = {}
for y in range(height):
    for x in range(width):
        r, g, b, a = img.getpixel((x, y))
        if a == 0:
            continue
        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        h_deg = round(h * 360.0, 1)
        # Group hues
        h_bucket = int(h_deg / 10) * 10
        hues[h_bucket] = hues.get(h_bucket, 0) + 1

print("Hue buckets of all visible pixels in original:")
for bucket in sorted(hues.keys()):
    print(f"  Hue {bucket}-{bucket+9}: {hues[bucket]} pixels")

# Let's also look at the bottom-right quadrant where the tail and water splash meet.
# Let's dump pixels in x >= 500, y >= 400 that are part of the original image
# and see if there is any hue difference, or what their coordinate ranges are.
# In the original, the fish tail was green or blue? Let's check their original colors.
print("\nPixels in x >= 500, y >= 400:")
for y in range(400, height, 10):
    row_chars = []
    for x in range(500, width, 10):
        r, g, b, a = img.getpixel((x, y))
        if a == 0:
            row_chars.append(" ")
        else:
            h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
            h_deg = h * 360.0
            # Let's print hue bucket: 'G' for green-ish, 'B' for blue-ish, 'O' for orange-ish
            if 110.0 <= h_deg <= 170.0:
                row_chars.append("G")
            elif 170.0 < h_deg <= 240.0:
                row_chars.append("B")
            elif 10.0 <= h_deg <= 80.0:
                row_chars.append("O")
            else:
                row_chars.append(".")
    if any(c != " " for c in row_chars):
        # print the row with Y coordinate
        print(f"y={y:03d}: " + "".join(row_chars))
