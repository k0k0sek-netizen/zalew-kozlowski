import os
from PIL import Image
import colorsys

img_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon.png"
img = Image.open(img_path).convert("RGBA")
pixels = img.load()
width, height = img.size

# We will print a 60x60 grid
grid_w = 60
grid_h = 60

print(f"ASCII Map of Green Pixels in the Logo ({width}x{height}):")

for gy in range(grid_h):
    row_chars = []
    for gx in range(grid_w):
        # Sample pixels in this grid block
        x_start = int(gx * (width / grid_w))
        x_end = int((gx + 1) * (width / grid_w))
        y_start = int(gy * (height / grid_h))
        y_end = int((gy + 1) * (height / grid_h))
        
        green_found = False
        for y in range(y_start, min(y_end, height)):
            for x in range(x_start, min(x_end, width)):
                r, g, b, a = pixels[x, y]
                if a > 50:
                    h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
                    if 110.0 <= h * 360.0 <= 170.0 and s > 0.15:
                        green_found = True
                        break
            if green_found:
                break
        
        row_chars.append("█" if green_found else " ")
    print("".join(row_chars))
