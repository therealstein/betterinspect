# Icon Generation Instructions

The SVG icons are located in this directory. To use them with the Chrome extension:

## Option 1: Use an online converter
1. Go to https://convertio.co/svg-png/ or similar service
2. Upload each SVG file
3. Set dimensions: icon16.svg → 16x16, icon48.svg → 48x48, icon128.svg → 128x128
4. Download PNG files and rename to match (icon16.png, icon48.png, icon128.png)

## Option 2: Use ImageMagick (if installed)
```bash
convert icon16.svg icon16.png
convert icon48.svg icon48.png
convert icon128.svg icon128.png
```

## Option 3: Use Inkscape (if installed)
```bash
inkscape icon16.svg -w 16 -h 16 -o icon16.png
inkscape icon48.svg -w 48 -h 48 -o icon48.png
inkscape icon128.svg -w 128 -h 128 -o icon128.png
```

## Option 4: Use a browser
1. Open each SVG file in Chrome
2. Right-click → Save as PNG
3. Resize using an image editor to the required dimensions

## Temporary Solution
For testing purposes, you can also use placeholder icons:
- Download any PNG icon from https://www.flaticon.com/search?word=magnifier
- Resize to 16x16, 48x48, and 128x128 using an image editor
- Save as icon16.png, icon48.png, icon128.png