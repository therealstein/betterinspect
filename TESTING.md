# betterinspect - Testing Checklist

## Pre-Installation Checklist

- [ ] All files present in the directory
- [ ] manifest.json is valid JSON
- [ ] Icon files generated (icon16.png, icon48.png, icon128.png)
- [ ] No syntax errors in JavaScript files
- [ ] HTML files are well-formed

## Installation Testing

### Load Extension
1. [ ] Open `chrome://extensions/` in Chrome
2. [ ] Enable "Developer mode"
3. [ ] Click "Load unpacked"
4. [ ] Select the betterinspect directory
5. [ ] Extension appears in the list without errors
6. [ ] Extension icon is visible in toolbar

### Check Manifest
1. [ ] Extension name shows as "betterinspect"
2. [ ] Description is correct
3. [ ] Version is "1.0.0"
4. [ ] Icons display correctly

## DevTools Panel Testing

### Panel Opening
1. [ ] Open any webpage
2. [ ] Open DevTools (F12)
3. [ ] "betterinspect" tab appears in DevTools
4. [ ] Clicking tab opens the panel
5. [ ] Panel displays "betterinspect - Network Copier" title

### Request Display
1. [ ] Navigate to a page with network activity
2. [ ] Click refresh button (🔄)
3. [ ] Network requests appear in the table
4. [ ] Request details are correct (URL, method, status, etc.)
5. [ ] Timestamps are formatted correctly

### Filtering
1. [ ] Search box filters requests by text
2. [ ] Type filter dropdown works (XHR, Script, etc.)
3. [ ] Status filter dropdown works (2xx, 4xx, etc.)
4. [ ] Filters can be combined
5. [ ] Clear search button works

### Sorting
1. [ ] Clicking column headers sorts the table
2. [ ] Sort direction indicators appear (↑/↓)
3. [ ] Sorting is stable

### Selection
1. [ ] Clicking a row selects it
2. [ ] Checkbox selection works
3. [ ] Select all checkbox works
4. [ ] Indeterminate state shows for partial selection
5. [ ] Selected requests are numbered
6. [ ] Clear button clears selection

### Copy Functionality
1. [ ] "Copy for AI" button is disabled when nothing selected
2. [ ] Button enables when requests are selected
3. [ ] Clicking button copies to clipboard
4. [ ] Success toast notification appears
5. [ ] Copied markdown format is correct
6. [ ] Headers are filtered according to settings
7. [ ] Multiple requests are copied with separators
8. [ ] Request order is preserved

### Settings Modal
1. [ ] Settings button (⚙️) opens modal
2. [ ] Close button (✕) closes modal
3. [ ] Current settings are displayed
4. [ ] Settings can be changed
5. [ ] Save button persists settings
6. [ ] Reset button restores defaults
7. [ ] Cancel button discards changes
8. [ ] Settings apply to new requests

### Keyboard Shortcuts
1. [ ] Ctrl+A selects all requests
2. [ ] Ctrl+C copies selected requests
3. [ ] Escape closes settings modal

## Options Page Testing

### Opening Options
1. [ ] Right-click extension icon → Options
2. [ ] Options page opens in new tab
3. [ ] Page displays "betterinspect" branding

### Settings Management
1. [ ] All checkboxes work correctly
2. [ ] Text inputs accept valid input
3. [ ] Number inputs validate ranges
4. [ ] Save button shows success message
5. [ ] Reset button restores defaults (with confirmation)
6. [ ] Cancel button discards changes (with confirmation)
7. [ ] Ctrl+S saves settings

### Header Filtering Settings
1. [ ] Browser headers toggle works
2. [ ] Auth headers toggle works
3. [ ] Cookie headers toggle works
4. [ ] Cache headers toggle works
5. [ ] Custom headers textarea works
6. [ ] Multiple header names are parsed correctly

### Response Handling Settings
1. [ ] Truncate large toggle works
2. [ ] Max body size input validates
3. [ ] Invalid values show error

## Output Format Testing

### Markdown Format
1. [ ] Correct markdown structure
2. [ ] Request number is shown
3. [ ] Method and URL are correct
4. [ ] Headers section is formatted
5. [ ] Request body is included (if present)
6. [ ] Response status is shown
7. [ ] Response headers are included
8. [ ] Response body is included (if present)
9. [ ] Binary responses are noted
10. [ ] Large responses are truncated

### Header Filtering
1. [ ] Browser headers removed (when enabled)
2. [ ] Auth headers removed (when enabled)
3. [ ] Cookie headers removed (when enabled)
4. [ ] Cache headers removed (when enabled)
5. [ ] Custom headers removed (when specified)

## Edge Cases Testing

### Empty State
1. [ ] Empty state shows when no requests
2. [ ] Refresh button works from empty state

### Error Handling
1. [ ] Invalid URLs are handled gracefully
2. [ ] Binary responses don't break the extension
3. [ ] Very large responses are handled
4. [ ] Network errors are handled
5. [ ] Missing data fields don't break display

### Performance
1. [ ] Panel loads quickly with 100+ requests
2. [ ] Scrolling is smooth
3. [ ] Search filtering is fast
4. [ ] Copying many requests doesn't freeze

### Compatibility
1. [ ] Works with different content types (JSON, XML, HTML)
2. [ ] Works with different request methods (GET, POST, PUT, etc.)
3. [ ] Works with different status codes
4. [ ] Works with CORS requests
5. [ ] Works with HTTPS and HTTP

## Cross-Browser Testing (Future)

- [ ] Chrome (latest)
- [ ] Chrome (previous version)
- [ ] Edge (Chromium-based)
- [ ] Firefox (planned)

## Security Testing

- [ ] No XSS vulnerabilities
- [ ] Sensitive headers can be filtered
- [ ] No data sent to external servers
- [ ] Clipboard permissions work correctly
- [ ] Storage permissions work correctly

## Documentation Testing

- [ ] README is accurate and complete
- [ ] Installation instructions work
- [ ] Usage examples are correct
- [ ] Screenshots are up to date (if any)
- [ ] Links work correctly

## Final Verification

- [ ] All features work as described
- [ ] No console errors in normal use
- [ ] No memory leaks
- [ ] UI is responsive and usable
- [ ] Dark mode works correctly
- [ ] Extension can be reloaded without issues
- [ ] Extension can be uninstalled cleanly

## Known Issues to Document

Document any known limitations or issues:
- [ ] List any browser-specific quirks
- [ ] List any performance limitations
- [ ] List any feature limitations

---

## Testing Results

**Test Date**: _______________  
**Tester**: _______________  
**Chrome Version**: _______________  
**OS**: _______________  

**Pass Count**: ___ / ___  
**Fail Count**: ___  

**Critical Issues**:
- 
- 

**Minor Issues**:
- 
- 

**Overall Status**: [ ] PASS  [ ] FAIL  [ ] NEEDS FIXES

**Notes**:
