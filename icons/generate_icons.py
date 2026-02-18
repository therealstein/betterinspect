#!/usr/bin/env python3
"""
Generate PNG icons for betterinspect extension.
Run this script to create icon16.png, icon48.png, icon128.png from SVG sources.
"""

import os
import sys

def check_dependencies():
    """Check which image conversion tools are available."""
    tools = []
    
    # Check for cairosvg
    try:
        import cairosvg
        tools.append('cairosvg')
    except ImportError:
        pass
    
    # Check for PIL/Pillow
    try:
        from PIL import Image
        tools.append('pillow')
    except ImportError:
        pass
    
    # Check for wand (ImageMagick Python binding)
    try:
        from wand.image import Image
        tools.append('wand')
    except ImportError:
        pass
    
    return tools

def generate_with_cairosvg():
    """Generate icons using cairosvg."""
    import cairosvg
    
    icons_dir = os.path.dirname(os.path.abspath(__file__))
    sizes = [16, 48, 128]
    
    for size in sizes:
        svg_path = os.path.join(icons_dir, f'icon{size}.svg')
        png_path = os.path.join(icons_dir, f'icon{size}.png')
        
        if os.path.exists(svg_path):
            cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=size, output_height=size)
            print(f'✅ Generated {png_path}')
        else:
            print(f'❌ SVG not found: {svg_path}')

def generate_with_pil():
    """Generate icons using PIL/Pillow (requires rsvg or similar)."""
    print("PIL alone cannot convert SVG to PNG directly.")
    print("Please use the browser-based generator instead.")
    return False

def generate_with_wand():
    """Generate icons using wand (ImageMagick)."""
    from wand.image import Image
    
    icons_dir = os.path.dirname(os.path.abspath(__file__))
    sizes = [16, 48, 128]
    
    for size in sizes:
        svg_path = os.path.join(icons_dir, f'icon{size}.svg')
        png_path = os.path.join(icons_dir, f'icon{size}.png')
        
        if os.path.exists(svg_path):
            with Image(filename=svg_path) as img:
                img.resize(size, size)
                img.save(filename=png_path)
            print(f'✅ Generated {png_path}')
        else:
            print(f'❌ SVG not found: {svg_path}')

def main():
    print("🔍 Checking available tools...")
    tools = check_dependencies()
    
    if not tools:
        print("\n❌ No image conversion tools found!")
        print("\nPlease use one of these options:")
        print("\n1. BROWSER METHOD (Easiest):")
        print("   - Open icons/generate_icons.html in Chrome")
        print("   - Click each button to download PNGs")
        print("   - Move downloaded files to icons/ folder")
        print("\n2. INSTALL DEPENDENCIES:")
        print("   pip install cairosvg")
        print("   Then run this script again")
        print("\n3. ONLINE CONVERTER:")
        print("   - Go to https://cloudconvert.com/svg-to-png")
        print("   - Upload icon16.svg, icon48.svg, icon128.svg")
        print("   - Download and save as PNGs")
        return 1
    
    print(f"✅ Found tools: {', '.join(tools)}")
    
    if 'cairosvg' in tools:
        print("\n📦 Using cairosvg...")
        generate_with_cairosvg()
    elif 'wand' in tools:
        print("\n📦 Using wand...")
        generate_with_wand()
    elif 'pillow' in tools:
        generate_with_pil()
    
    return 0

if __name__ == '__main__':
    sys.exit(main())