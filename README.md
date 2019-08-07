# Chrome App Shortcuts Js
[![Build Status](https://travis-ci.org/edmundpf/chrome_app_shortcuts_js.svg?branch=master)](https://travis-ci.org/edmundpf/chrome_app_shortcuts_js)
> Package: chrome_app_shortcuts_js
## Install
``` bash
# Clone Repo
$ git clone git@github.com:edmundpf/chrome_app_shortcuts_js.git
# Install Dependencies
$ npm install
```
## Usage
``` bash
# Save shortcut with icon scraped from website
$ npm run start name "APP_NAME" url "APP_URL" desc "APP_DESCRIPTION"
# Save shortcut with no icon
$ npm run start name "APP_NAME" url "APP_URL" desc "APP_DESCRIPTION" icon "false"
```
## Contributing/Development
``` bash
# Check out dev branch
$ git checkout -b dev
```
* Coffeescript source is located in src/ folder
* Run `grunt watch` to watch files and compile to JS automatically, or `grunt sync` to compile to JS manually