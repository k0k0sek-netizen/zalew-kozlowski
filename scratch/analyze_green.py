import os
from PIL import Image
import colorsys

img_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon.png"
img = Image.open(img_path).convert("RGBA")
pixels = img.load()
width, height = img.size

print(f"Image dimensions: {width}x{height}")

green_pixels_by_y = [0] * height

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a == 0:
            continue
        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        h_deg = h * 360.0
        
        if 110.0 <= h_deg <= 170.0 and s > 0.15:
            green_pixels_by_y[y] += 1

print("\nGreen pixel distribution by row (Y-coordinate):")
# Print every 10th row summary to keep output clean
for y in range(0, height, min(10, height // 20)):
    count = sum(green_pixels_by_y[y:y+10])
    bar = "#" * (count // 100)
    print(f"Rows {y:3d} to {y+9:3d}: {count:5d} pixels | {bar}")
