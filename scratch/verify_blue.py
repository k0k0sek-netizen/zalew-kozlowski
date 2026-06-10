from PIL import Image
import colorsys

img_path = "/home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/public/logo-icon.png"
img = Image.open(img_path).convert("RGBA")
pixels = img.load()
width, height = img.size

blue_count = 0
green_count = 0
orange_count = 0

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a == 0:
            continue
        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        h_deg = h * 360.0
        
        # Blue is around 200-240
        if 190.0 <= h_deg <= 240.0:
            blue_count += 1
        # Green is around 110-170
        elif 110.0 <= h_deg <= 170.0:
            green_count += 1
        # Orange/Yellow is around 10-50
        elif 10.0 <= h_deg <= 50.0:
            orange_count += 1

print(f"Verified pixel colors in logo-icon.png:")
print(f"- Blue pixels (water): {blue_count}")
print(f"- Green pixels (fish): {green_count}")
print(f"- Orange pixels (arch): {orange_count}")
