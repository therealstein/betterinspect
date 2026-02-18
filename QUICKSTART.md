# betterinspect - Quick Start Guide

Get up and running with betterinspect in 5 minutes!

## Installation (2 minutes)

1. **Download or clone the extension**
   ```bash
   git clone https://github.com/therealstein/betterinspect.git
   ```

2. **Generate icons** (if needed)
   - Open `icons/generate_icons.html` in Chrome
   - Click each button to download the PNG icons
   - Save them in the `icons/` folder

3. **Load in Chrome**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `betterinspect` folder

## First Use (3 minutes)

### Step 1: Open DevTools
- Navigate to any website
- Press `F12` or right-click → "Inspect"
- Click the "betterinspect" tab

### Step 2: Capture Requests
- Browse around the website to trigger network activity
- Click the refresh button (🔄) in the panel
- You'll see all network requests listed

### Step 3: Select and Copy
1. Click on requests to select them (or use checkboxes)
2. Selected requests are numbered in order
3. Click "Copy for AI" button
4. Paste into your AI tool (ChatGPT, Claude, etc.)

## Quick Tips

### Filter Requests
- Use the search box to find specific URLs
- Use type dropdown to show only XHR, Scripts, etc.
- Use status dropdown to filter by 2xx, 4xx, 5xx

### Select Multiple
- Click "Select all" checkbox for bulk selection
- Or Ctrl+A to select all visible requests
- Clear selection with "Clear" button

### Customize Output
1. Click the settings button (⚙️)
2. Choose which headers to filter out
3. Set response body size limits
4. Click "Save Settings"

### Keyboard Shortcuts
- `Ctrl+A` - Select all requests
- `Ctrl+C` - Copy selected requests
- `Escape` - Close settings

## Example Use Cases

### Debug API Issues
```
1. Select failed requests (4xx, 5xx)
2. Copy with "Copy for AI"
3. Ask AI: "Why is this API call failing?"
```

### Document API Flow
```
1. Select requests in order
2. Copy with numbers preserved
3. Paste into documentation
```

### Share with Team
```
1. Reproduce a bug
2. Select relevant requests
3. Copy and share in Slack/Teams
```

## What Gets Copied?

Your copied output includes:
- Request method and URL
- Request headers (filtered)
- Request body
- Response status
- Response headers (filtered)
- Response body (truncated if large)

## Next Steps

- Read the full [README](README.md) for detailed features
- Check [TESTING.md](TESTING.md) for troubleshooting
- Customize settings for your workflow

## Need Help?

- Check the troubleshooting section in README.md
- Search existing issues on GitHub
- Open a new issue with details

---

**Happy inspecting! 🔍**