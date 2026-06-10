import os
from PIL import Image
import colorsys
import shutil

img_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon.png.bak"
dest_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon.png"

if not os.path.exists(img_path):
    print("Backup does not exist")
    exit(1)

# Open image
img = Image.open(img_path).convert("RGBA")
width, height = img.size
pixels = img.load()

# Connected component labeling (8-connectivity)
visited = set()
components = []

for y in range(height):
    for x in range(width):
        if pixels[x, y][3] == 0 or (x, y) in visited:
            continue
        
        comp = []
        queue = [(x, y)]
        visited.add((x, y))
        
        while queue:
            cx, cy = queue.pop(0)
            comp.append((cx, cy))
            
            for dx in [-1, 0, 1]:
                for dy in [-1, 0, 1]:
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if pixels[nx, ny][3] > 0 and (nx, ny) not in visited:
                            visited.add((nx, ny))
                            queue.append((nx, ny))
        components.append(comp)

print(f"Found {len(components)} connected components.")
components.sort(key=len, reverse=True)

# Define component mappings based on sizes:
# Component 1 (largest green/water component): Water -> Azure Blue
# Component 2 (second largest green/fish body): Fish -> Forest Green
# Component 3 (orange arch): Arch -> Orange
# Component 4 (smallest green/fish fin): Fish -> Forest Green

recolored_fish = 0
recolored_water = 0
recolored_orange = 0

for i, comp in enumerate(components):
    # Determine type of component
    # We sort by size, so:
    # Index 0: Water wave (size ~55,395)
    # Index 1: Fish body (size ~35,008)
    # Index 2: Orange arch (size ~14,832)
    # Index 3: Fish fin (size ~1,589)
    
    if i == 0:
        # Water
        print(f"Coloring Component 1 (Water wave, size={len(comp)}) as Azure Blue")
        for x, y in comp:
            r, g, b, a = pixels[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
            
            new_h = 205.0 / 360.0
            new_s = min(s * 1.2, 0.90)
            new_v = 0.65
            
            new_r, new_g, new_b = colorsys.hsv_to_rgb(new_h, new_s, new_v)
            pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)
            recolored_water += 1
            
    elif i == 1 or i == 3:
        # Fish (body and fin)
        role = "Fish body" if i == 1 else "Fish fin"
        print(f"Coloring Component {i+1} ({role}, size={len(comp)}) as Forest Green")
        for x, y in comp:
            r, g, b, a = pixels[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
            
            new_h = 145.0 / 360.0
            new_s = min(s * 1.1, 0.85)
            new_v = 0.65
            
            new_r, new_g, new_b = colorsys.hsv_to_rgb(new_h, new_s, new_v)
            pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)
            recolored_fish += 1
            
    elif i == 2:
        # Arch
        print(f"Coloring Component 3 (Orange arch, size={len(comp)}) as Brand Orange")
        for x, y in comp:
            r, g, b, a = pixels[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
            
            brand_h = 24.0 / 360.0
            brand_s = 0.91
            brand_v = min(v * 1.05, 0.98)
            
            new_r, new_g, new_b = colorsys.hsv_to_rgb(brand_h, brand_s, brand_v)
            pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)
            recolored_orange += 1

# Save recolored image
img.save(dest_path)
print(f"Saved recolored image to {dest_path}")

# Also update logo-icon-v6.png for cache busting
v6_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon-v6.png"
shutil.copyfile(dest_path, v6_path)
print(f"Updated cache-busting copy: {v6_path}")

print(f"\nSummary:")
print(f"- Green fish pixels (body + fin): {recolored_fish}")
print(f"- Blue water pixels: {recolored_water}")
print(f"- Orange arch pixels: {recolored_orange}")
