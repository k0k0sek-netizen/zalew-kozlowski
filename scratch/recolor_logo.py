import os
from PIL import Image
import colorsys
import shutil

img_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon.png"
backup_path = img_path + ".bak"

if not os.path.exists(backup_path):
    print(f"Error: Backup {backup_path} does not exist. Cannot restore original.")
    exit(1)

# Restore from backup first to start fresh
shutil.copyfile(backup_path, img_path)
print("Restored original logo-icon.png from backup")

# Open image
img = Image.open(img_path).convert("RGBA")
pixels = img.load()
width, height = img.size

recolored_fish = 0
recolored_water = 0
recolored_orange = 0

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a == 0:
            continue
        
        # Convert to HSV
        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        h_deg = h * 360.0
        
        # 1. Green pixels: Hue 110 to 170
        if 110.0 <= h_deg <= 170.0 and s > 0.15:
            # Precise spatial segmentation of the fish boundary:
            if x < 450:
                is_fish = y < 450
            elif 450 <= x < 580:
                is_fish = y < 600
            else: # x >= 580
                if x > 700:
                    is_fish = False  # Right wave splash
                else:
                    is_fish = y < 680  # Fish tail
            
            if is_fish:
                # Fish -> Bright forest green (Hue ~145, Saturation boosted, Value to 0.65)
                new_h = 145.0 / 360.0
                new_s = min(s * 1.1, 0.85)
                new_v = 0.65
                
                new_r, new_g, new_b = colorsys.hsv_to_rgb(new_h, new_s, new_v)
                pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)
                recolored_fish += 1
            else:
                # Water -> Bright azure blue (Hue ~205, Saturation boosted, Value to 0.65)
                new_h = 205.0 / 360.0
                new_s = min(s * 1.2, 0.90)
                new_v = 0.65
                
                new_r, new_g, new_b = colorsys.hsv_to_rgb(new_h, new_s, new_v)
                pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)
                recolored_water += 1
            
        # 2. Orange arch: Hue 10 to 35
        elif 10.0 <= h_deg <= 35.0 and s > 0.4:
            # Set to exact brand color (#f97316 -> H=24/360, S=0.91, V=0.98)
            brand_h = 24.0 / 360.0
            brand_s = 0.91
            brand_v = min(v * 1.05, 0.98)
            
            new_r, new_g, new_b = colorsys.hsv_to_rgb(brand_h, brand_s, brand_v)
            pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)
            recolored_orange += 1

# Save recolored image
img.save(img_path)

# Also update logo-icon-v5.png for cache busting!
shutil.copyfile(img_path, "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon-v5.png")

print(f"Successfully processed logo image and updated logo-icon-v5.png:")
print(f"- Recolored green fish pixels: {recolored_fish}")
print(f"- Recolored blue water pixels: {recolored_water}")
print(f"- Recolored orange arch pixels: {recolored_orange}")
