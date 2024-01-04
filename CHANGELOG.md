# 1.5.1

## Improvements:

- Smaller UI improvements for labels page

# 1.5.0

## Improvements:

- Articles with long titles will not exceed two lines anymore
- The pagination UI is always properly centered now (was aligned to the left on the last page)
- There are fewer fields being fetched for each article (which in theory leads to better performance)
- Already-archived articles can now be unarchived/restored
- The options page looks a bit better and the advanced options are grouped and labeled a bit better
- The options page now has a “Restore defaults” button that restores the advanced options’ default values

# 1.4.0

## Improvements:

- Added pagination to browse beyond the first 10 articles
- 20 articles are being loaded per page (instead of 10)

# 1.3.0

## Improvements:

- Search query can be customized and defaults to "in:inbox"
- Add simple API error handling and empty list state
- API URL can now be customized (for self-hosting Omnivore)
- Improve layout of settings page

# 1.2.2

## Improvements:

- Styles are properly loaded again (this time for real!)

# 1.2.1

## Improvements:

- Styles are properly loaded again
- The label editor displays the labels’ colors as dots
- The label editor provides a link to manage all labels on Omnivore

# 1.2.0

## Improvements:

- Show articles’ labels in the list view (thanks to [allibragi](https://github.com/allibragi))
- Improved styles and added dark mode to the extension settings

# 1.1.2

## Improvements:

- Add a link to the settings page in the popup (if API key is missing)

## Fixes:

- Properly keep the popup open on Windows and Linux when pressing CTRL while opening an item

# 1.1.1

Maintenance release only.

# 1.1.0

## Features:

- Edit labels of items (thanks to [allibragi](https://github.com/allibragi))

## Improvements:

- Add support for Chromium-based browsers (Chrome, Vivaldi, etc.)
- Migrate to Manifest v3 (only for Chromium-based browsers for now)
- Improve styles on options page
- Use correct text color for loading text and on labels page (was previoulsy dark on dark)

# 1.0.2

## Improvements:

- Improve ellipsis logic of long URLs

# 1.0.1

## Improvements:

- Keep item URLs in one line and add ellipsis
- Add hint about missing API key in popup
- Reset the success message on the options page after one second

# 1.0.0

Initial release! 🎉

## Features:

- Simple list of Omnivore items
- New items can be added to the list
- Items can be archived
- The Omnivore page can be opened
- Simple settings page to configure the API key
