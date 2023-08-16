# Omnivore List Popup Firefox Extension

Show a popup with a list of your [Omnivore](https://omnivore.app/) articles to quickly open or archive.

![Screenshot of the extension running in Firefox](docs/screenshot.jpg)

## Installation & Usage

1. Get an [Omnivore API Key](https://omnivore.app/settings/api) through your Omnivore Account.
2. Install the extension from the [Firefox Extensions page](https://addons.mozilla.org/firefox/addon/omnivore-list-popup/).
3. Go into the extension’s settings and paste your Omnivore API key.
4. Launch the extension by clicking the new "Omnivore List Popup" button in your Firefox extension toolbar/dropdown.
5. Optional: Add the extension to your always-visible toolbar.

## Development Setup

1. Install the Node version defined in `.nvmrc` (e.g. with `nvm use`).
2. Install dependencies with `npm install`.
3. Run the build with `npm run build` to generate the output files.
4. Load the extension folder in [Firefox](about:debugging#/runtime/this-firefox).

- `npm run dev` is available to watch files for changes and auto-build.

## Releasing

Create an archive for a release in the Firefox extension store:

1. Run `npm run create-release` to generate the output files and create the extension archives.
2. Upload the archives on https://addons.mozilla.org/developers/

## Contributing

If you have ideas or issues, please get in touch! You can either use [GitHub issues](https://github.com/herrherrmann/omnivore-list-popup/issues) or contact [herrherrmann](https://github.com/herrherrmann/) directly.

## Todos & Ideas

- [ ] Chrome compatibility (check e.g. [Hoverzoom](https://github.com/extesy/hoverzoom/) for inspiration)
- [ ] Improve onboarding, e.g. make it possible to enter API key in popup
- [ ] Improve error handling
- [ ] Internationalization
- [ ] Cache list items locally for offline usage
- [ ] Highlight the popup button if the current page is added to Omnivore

## Acknowledgements

- Thanks to the amazing [In My Pocket](https://inmypocketaddon.com/) extension for inspiring this project. 👏
- Thanks to the [Omnivore team](https://omnivore.app/) for the nice Pocket alternative and open API.
- Thanks to the [Lucide project](https://lucide.dev/) for the icon set.
