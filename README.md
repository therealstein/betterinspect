# betterinspect

> AI-powered browser inspection toolkit for developers and AI enthusiasts

**betterinspect** is a comprehensive Chrome DevTools extension that enhances your workflow when working with APIs and debugging web applications. The first feature, **Network Copier**, allows you to intelligently copy network requests in formats optimized for AI assistants.

## Features

### 🌐 Network Copier (v1.0)

- 🔍 **Smart Network Inspection**: Automatically captures and displays all network requests
- 🤖 **AI-Optimized Output**: Generates clean, structured markdown formatted for AI understanding
- 📋 **One-Click Copy**: Copy single or multiple requests with a single button click
- 🎯 **Smart Header Filtering**: Automatically strips browser headers and configurable auth tokens
- 🔢 **Sequential Ordering**: Number requests to show call sequences for AI context
- 🔍 **Advanced Filtering**: Filter by URL, status code, request type, and more
- ⚙️ **Customizable Settings**: Fine-tune what gets copied and how
- 🎨 **DevTools Integration**: Seamlessly integrates into Chrome DevTools

## Installation

### Prerequisites

- Google Chrome (version 88 or higher)
- Basic familiarity with Chrome DevTools

### Step-by-Step Installation

1. **Download or Clone the Extension**
   ```bash
   git clone https://github.com/therealstein/betterinspect.git
   cd betterinspect
   ```

2. **Generate Icon Files** (if needed)
   - Open `icons/generate_icons.html` in Chrome
   - Click each button to download icon16.png, icon48.png, icon128.png
   - Save them in the `icons` folder
   - Alternatively, use any PNG icons of the appropriate sizes

3. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right corner)
   - Click "Load unpacked"
   - Select the `betterinspect` directory

4. **Pin the Extension** (Optional)
   - Click the puzzle icon in Chrome toolbar
   - Find "betterinspect" and click the pin icon

## Usage

### Basic Workflow

1. **Open DevTools**
   - Right-click on any webpage and select "Inspect"
   - Or press `F12` / `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)

2. **Navigate to betterinspect Panel**
   - Click the "Network AI Copier" tab in DevTools
   - If not visible, click the `>>` icon to find it

3. **Select Network Requests**
   - Navigate the website to generate network activity
   - Click the refresh button (🔄) to load recent requests
   - Use checkboxes or click rows to select requests
   - Selected requests are numbered in sequence

4. **Copy for AI**
   - Click the "Copy for AI" button
   - Formatted markdown is copied to clipboard
   - Paste into your AI tool (ChatGPT, Claude, etc.)

### Advanced Features

#### Filtering Requests

- **Search**: Type in the search box to filter by URL, method, or type
- **Type Filter**: Dropdown to show only XHR, Scripts, CSS, Images, etc.
- **Status Filter**: Filter by status codes (2xx, 3xx, 4xx, 5xx)

#### Multi-Selection

- Click individual rows to select/deselect
- Use "Select All" checkbox for bulk selection
- Drag to reorder selected requests (if needed)
- Clear selection with "Clear" button

#### Keyboard Shortcuts

- `Ctrl+A` / `Cmd+A`: Select all visible requests
- `Ctrl+C` / `Cmd+C`: Copy selected requests (when focused)
- `Escape`: Close settings modal

### Settings

Access settings by clicking the ⚙️ icon in the toolbar.

#### Header Filtering

- **Browser Headers**: Remove User-Agent, Accept, Accept-Language, Accept-Encoding (default: ON)
- **Authentication Headers**: Remove Authorization, API keys, Bearer tokens (default: OFF)
- **Cookie Headers**: Remove Cookie and Set-Cookie headers (default: OFF)
- **Cache Headers**: Remove Cache-Control, ETag, etc. (default: OFF)
- **Custom Headers**: Add specific headers to always filter out

#### Response Handling

- **Truncate Large Responses**: Limit response body size (default: ON)
- **Max Body Size**: Maximum bytes to include (default: 100KB)

### Output Format

The copied markdown follows this structure:

```markdown
# Request #1
**Method**: POST  
**URL**: https://api.example.com/users  
**Timestamp**: 2026-02-18T14:32:15.123Z  
**Duration**: 45ms  
**Type**: xhr

## Request Headers
```
Content-Type: application/json
Authorization: Bearer abc123
```

## Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Response Status
**200 OK** (45ms) ✅

## Response Headers
```
Content-Type: application/json
Cache-Control: no-cache
```

## Response Body
```json
{
  "id": 123,
  "status": "created"
}
```

---

# Request #2
...
```

## Use Cases

### 1. Debugging API Issues
- Select failed requests (4xx, 5xx)
- Copy details and paste into AI for analysis
- Get suggestions for fixing issues

### 2. API Documentation
- Select a sequence of API calls
- Copy to generate documentation
- Share with team members

### 3. Testing and QA
- Capture request flows during testing
- Share exact request/response data with developers
- Reproduce bugs with full context

### 4. Learning APIs
- Inspect third-party API calls
- Understand authentication flows
- Learn request patterns

## Tips and Best Practices

1. **Filter Before Copying**: Use filters to select only relevant requests
2. **Remove Sensitive Data**: Enable auth header filtering when sharing
3. **Sequential Selection**: Select requests in order to show the API flow
4. **Size Management**: Truncate large responses to avoid overwhelming AI
5. **Regular Refresh**: Click refresh after navigating to new pages

## Troubleshooting

### Extension Not Loading
- Ensure Developer mode is enabled in `chrome://extensions/`
- Check for errors in the Extensions page
- Verify all files are present in the directory

### No Network Requests Showing
- Refresh the webpage or navigate to trigger network activity
- Click the refresh button (🔄) in the panel
- Check if the page has any network requests at all

### Copy Not Working
- Click somewhere in the panel first to give it focus
- Ensure at least one request is selected
- Check browser console for errors

### Icons Not Displaying
- Generate icons using `icons/generate_icons.html`
- Or place custom PNG icons (16x16, 48x48, 128x128) in `icons/` folder

## Privacy and Security

- **Local Processing**: All data processing happens locally in your browser
- **No External Calls**: The extension makes no external API calls
- **No Data Collection**: No user data is collected or transmitted
- **Open Source**: Full source code available for review

## Development

### Project Structure
```
betterinspect/
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── devtools.html/js       # DevTools integration
├── panel.html/js/css      # UI panel
├── options.html/js        # Settings page
├── lib/
│   ├── har-parser.js      # HAR data processor
│   ├── markdown-formatter.js  # Output formatter
│   ├── curl-builder.js    # cURL generator
│   └── utils.js           # Error handling & utilities
└── icons/                 # Extension icons
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

betterinspect is designed to be a comprehensive inspection toolkit. Future features include:

### 🎯 Coming in v1.1+
- [ ] **Console AI Analyzer**: Intelligent console log analysis and filtering
- [ ] **Performance Insights**: AI-powered performance recommendations  
- [ ] **DOM Inspector AI**: Smart DOM structure analysis and suggestions
- [ ] **API Response Validator**: Automated API response schema validation
- [ ] **Request Replayer**: One-click request replay with modifications
- [ ] **Export Formats**: JSON/CSV/HAR export capabilities

### 🌐 Network Copier Enhancements
- [ ] Custom output templates
- [ ] Request comparison tool
- [ ] Automatic sensitive data detection
- [ ] Integration with popular API tools (Postman, Insomnia)
- [ ] Request mocking and stubbing

### 🔮 Future Vision
- Multi-browser support (Firefox, Edge)
- Team collaboration features
- Shared request collections
- Custom AI model integration

## License

MIT License - see LICENSE file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/therealstein/betterinspect/issues)
- **Discussions**: [GitHub Discussions](https://github.com/therealstein/betterinspect/discussions)

## Acknowledgments

**betterinspect** is built with ❤️ for developers and AI enthusiasts who need better tools for browser inspection and debugging.

This extension is designed to evolve into a comprehensive inspection toolkit, with the **AI Network Copier** being our first feature. Stay tuned for more AI-powered inspection capabilities!

---

**Version**: 1.0.0 (Network Copier)  
**Author**: therealstein  
**Repository**: https://github.com/therealstein/betterinspect  
**License**: MIT