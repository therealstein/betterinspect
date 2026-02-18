# Chrome Web Store Publishing Guide

This guide walks you through publishing betterinspect to the Chrome Web Store.

## Prerequisites

### 1. Chrome Web Store Developer Account
- Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/dev/dashboard)
- Sign in with your Google account
- Pay the one-time $5 registration fee
- Accept the Developer Agreement

### 2. Prepare Extension Assets

Before publishing, you need these assets ready:

#### Required Assets
| Asset | Size | Description |
|-------|------|-------------|
| Extension icon | 128x128 | Main icon (PNG) |
| Store icon | 128x128 | Same as extension icon |
| Small tile | 440x280 | Store listing tile |
| Screenshots | 1280x800 or 640x400 | At least 1, max 5 |

#### Optional Assets
| Asset | Size | Description |
|-------|------|-------------|
| Large tile | 920x680 | Featured placement |
| Marquee | 1400x560 | Featured placement |
| Promo video | YouTube URL | Demo video |

---

## Step 1: Generate PNG Icons

The extension needs PNG icons, not SVGs.

### Option A: Use the Generator Tool
```bash
# Open in Chrome
open icons/generate_icons.html
# Click each button to download PNGs
# Save as icon16.png, icon48.png, icon128.png in icons/ folder
```

### Option B: Use ImageMagick
```bash
cd icons
convert icon16.svg icon16.png
convert icon48.svg icon48.png
convert icon128.svg icon128.png
```

### Option C: Use Online Converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload each SVG
3. Set exact dimensions (16, 48, 128)
4. Download and save

---

## Step 2: Create Screenshots

### What to Capture
1. **Main screenshot**: DevTools panel with network requests visible
2. **Selection demo**: Multiple requests selected with numbers
3. **Settings panel**: Show the configuration options
4. **Output example**: Show the copied markdown format

### How to Create
1. Load extension in Chrome
2. Open a website with API calls (e.g., github.com, twitter.com)
3. Open DevTools → betterinspect tab
4. Capture screenshots using:
   - `Cmd+Shift+4` (Mac)
   - `Win+Shift+S` (Windows)
   - Or browser DevTools screenshot: `Cmd+Shift+P` → "Capture screenshot"

### Screenshot Requirements
- 1280x800 or 640x400 pixels
- PNG or JPEG format
- No browser chrome (address bar, bookmarks)
- Show actual functionality

---

## Step 3: Create Store Tile (440x280)

Create a promotional tile for the store listing:

### Design Suggestions
- Use the betterinspect logo
- Add tagline: "AI-Powered Network Inspection"
- Show a brief feature highlight
- Use gradient background matching brand colors

### Tools
- Canva (free)
- Figma (free)
- Adobe Creative Suite

---

## Step 4: Package the Extension

### Create ZIP File

```bash
# From the betterinspect directory
cd /home/steffen/work/betterinspect/betterinspect

# Create ZIP excluding unnecessary files
zip -r betterinspect-v1.0.0.zip . \
  -x "*.git*" \
  -x "*.DS_Store" \
  -x "*TESTING.md" \
  -x "*PROJECT_SUMMARY.md" \
  -x "*QUICKSTART.md" \
  -x "*VISION.md" \
  -x "*PUBLISHING.md" \
  -x "icons/*.svg" \
  -x "icons/generate_icons.html" \
  -x "icons/README.md"
```

### Verify Package Contents
```bash
unzip -l betterinspect-v1.0.0.zip
```

Should include:
- manifest.json
- background.js
- devtools.html, devtools.js
- panel.html, panel.js, panel.css
- options.html, options.js
- lib/*.js
- icons/icon16.png, icon48.png, icon128.png
- README.md
- LICENSE

---

## Step 5: Upload to Chrome Web Store

### Navigate to Dashboard
1. Go to [Developer Dashboard](https://chrome.google.com/webstore/dev/dashboard)
2. Click "Add new item"
3. Choose "Upload new extension"

### Upload ZIP
1. Drag and drop or select the ZIP file
2. Wait for upload to complete
3. Review any validation errors

---

## Step 6: Fill in Store Listing

### Basic Information

**Name**: 
```
betterinspect
```

**Short Description** (132 chars max):
```
AI-powered Chrome DevTools extension for network inspection. Copy requests in AI-optimized format with smart header filtering.
```

**Detailed Description**:
```
betterinspect is an AI-powered Chrome DevTools extension that transforms how you inspect, debug, and document network requests.

🔍 KEY FEATURES:

• AI-Optimized Output - Copy network requests in clean, structured markdown format perfect for AI assistants
• Smart Header Filtering - Automatically remove browser headers, auth tokens, cookies, and cache headers
• Request Sequencing - Select multiple requests and preserve their order for context
• One-Click Copy - Select requests and copy with a single button click
• Advanced Filtering - Filter by URL, request type, and status code
• Configurable Settings - Customize what gets included in the output
• Dark Mode Support - Automatic theme detection
• Privacy First - All processing happens locally, no external calls

📋 PERFECT FOR:

• Debugging API issues with AI assistants
• Documenting API flows
• Sharing request details with team members
• Learning third-party APIs
• QA testing and bug reporting

🚀 HOW TO USE:

1. Open Chrome DevTools (F12)
2. Click the "betterinspect" tab
3. Navigate a website to capture network requests
4. Click refresh to load requests
5. Select requests you want to copy
6. Click "Copy for AI" button
7. Paste into your AI tool

⚙️ CONFIGURATION:

Click the settings icon to customize:
• Which headers to filter out
• Response body size limits
• Custom header exclusions

🔒 PRIVACY:

• All processing is local - no data leaves your browser
• No external API calls
• No telemetry or tracking
• Open source for full transparency

Open source: https://github.com/therealstein/betterinspect
```

### Category
Select: **Developer Tools**

### Language
Select: **English**

### Privacy

**Single Purpose**:
```
This extension captures and formats network requests from Chrome DevTools for easy copying and sharing with AI assistants.
```

**Permission Justification**:

**devtools**:
```
Required to access the Chrome DevTools Network API and display network requests in a custom DevTools panel.
```

**storage**:
```
Required to save user preferences for header filtering and response handling settings.
```

**activeTab**:
```
Required to access network requests from the currently active browser tab when the user opens DevTools.
```

---

## Step 7: Add Screenshots & Images

1. Upload at least 1 screenshot (1280x800 recommended)
2. Upload store tile (440x280)
3. Add promotional images if available

**Screenshot Guidelines**:
- Show the extension in action
- Highlight key features
- Use realistic data
- Ensure text is readable

---

## Step 8: Set Pricing & Visibility

### Pricing
- Select: **Free**

### Visibility
- Select: **Public** (everyone can see)
- Or: **Unlisted** (only via direct link)

### Regions
- Select: **All regions**

---

## Step 9: Submit for Review

### Pre-Submission Checklist
- [ ] Extension icon uploaded (128x128 PNG)
- [ ] At least 1 screenshot uploaded
- [ ] Store tile uploaded (440x280)
- [ ] Detailed description filled in
- [ ] Category selected
- [ ] Privacy practices disclosed
- [ ] Permissions justified
- [ ] ZIP package validated

### Submit
1. Click "Submit for review"
2. Confirm submission
3. Wait for review (typically 24-48 hours)

---

## Step 10: Post-Submission

### Monitor Status
- Check [Developer Dashboard](https://chrome.google.com/webstore/dev/dashboard) regularly
- Look for any feedback or rejection reasons

### If Rejected
- Read rejection reason carefully
- Make necessary changes
- Re-submit

### If Approved
- Extension goes live automatically
- Share the store link!
- Update README.md with store link

---

## Store Link Template

After approval, your extension will be available at:
```
https://chrome.google.com/webstore/detail/betterinspect/[extension-id]
```

---

## Updating the Extension

1. Make changes to code
2. Update version in `manifest.json`
3. Create new ZIP package
4. Upload to Developer Dashboard
5. Submit for review

---

## Support Information

Add to store listing:

**Support URL**: 
```
https://github.com/therealstein/betterinspect/issues
```

**Homepage URL**:
```
https://github.com/therealstein/betterinspect
```

---

## Tips for Approval

1. **Be clear about permissions** - Explain why each permission is needed
2. **Show functionality** - Screenshots should demonstrate real use
3. **Keep description honest** - Don't over-promise
4. **Follow guidelines** - Read [Program Policies](https://developer.chrome.com/docs/webstore/program-policies/)
5. **Test thoroughly** - Ensure no crashes or errors

---

## Checklist Summary

```
Pre-Publishing:
□ Developer account created ($5 paid)
□ PNG icons generated (16, 48, 128)
□ Screenshots created (1280x800)
□ Store tile created (440x280)
□ ZIP package created
□ Store listing content prepared

During Publishing:
□ ZIP uploaded
□ Name and description filled
□ Screenshots uploaded
□ Category selected
□ Privacy practices disclosed
□ Permissions justified
□ Support URLs added
□ Submitted for review

Post-Publishing:
□ Monitor review status
□ Update README with store link
□ Announce on social media
□ Monitor user feedback
```

---

Good luck with your submission! 🚀