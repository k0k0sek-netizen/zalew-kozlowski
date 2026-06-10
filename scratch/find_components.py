import os
from PIL import Image

img_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon.png.bak"
if not os.path.exists(img_path):
    print("Backup does not exist")
    exit(1)

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
        
        # Start BFS for this component
        comp = []
        queue = [(x, y)]
        visited.add((x, y))
        
        while queue:
            cx, cy = queue.pop(0)
            comp.append((cx, cy))
            
            # 8-neighbors
            for dx in [-1, 0, 1]:
                for dy in [-1, 0, 1]:
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if pixels[nx, ny][3] > 0 and (nx, ny) not in visited:
                            visited.add((nx, ny))
                            queue.append((nx, ny))
        
        components.append(comp)

print(f"Found {len(components)} connected components.")
# Sort components by size (number of pixels)
components.sort(key=len, reverse=True)
for i, comp in enumerate(components[:10]):
    # Get bounding box
    xs = [p[0] for p in comp]
    ys = [p[1] for p in comp]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    
    # Get average color of the component
    r_sum, g_sum, b_sum = 0, 0, 0
    for cx, cy in comp:
        r, g, b, a = pixels[cx, cy]
        r_sum += r
        g_sum += g
        b_sum += b
    n = len(comp)
    avg_color = (r_sum // n, g_sum // n, b_sum // n)
    
    print(f"Component {i+1}: size={n} pixels, bbox=({min_x}, {min_y}) to ({max_x}, {max_y}), avg_rgb={avg_color}")
