import os
from PIL import Image
import colorsys

img_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon.png.bak"
if not os.path.exists(img_path):
    print("Error: Backup logo-icon.png.bak does not exist")
    exit(1)

img = Image.open(img_path).convert("RGBA")
pixels = img.load()
width, height = img.size

# Print the coordinate grid of green pixels on the right side (X >= 500, Y >= 400)
# We will print a 40x40 character map of the region X in [500, 900], Y in [400, 800]
x_min, x_max = 500, 900
y_min, y_max = 400, 800

grid_w = 50
grid_h = 50

print(f"Detailed map of the right side region (X: {x_min}-{x_max}, Y: {y_min}-{y_max}):")

for gy in range(grid_h):
    row_chars = []
    y_val = int(y_min + gy * (y_max - y_min) / grid_h)
    
    for gx in range(grid_w):
        x_val = int(x_min + gx * (x_max - x_min) / grid_w)
        
        # Sample pixels around this coordinate
        green_found = False
        for dy in range(-4, 4):
            for dx in range(-4, 4):
                px = x_val + dx
                py = y_val + dy
                if 0 <= px < width and 0 <= py < height:
                    r, g, b, a = pixels[px, py]
                    if a > 50:
                        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
                        if 110.0 <= h * 360.0 <= 170.0 and s > 0.15:
                            green_found = True
                            break
            if green_found:
                break
                
        row_chars.append("█" if green_found else " ")
        
    # Print the Y coordinate on the right for reference
    print("".join(row_chars) + f" | Y = {y_val}")
