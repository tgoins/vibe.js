# Vibe.js [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A simple music bot for Discord

## Commands
- play: Adds songs to queue or plays it.
- skip: Skips current song.
- np: Displays the currently playing song.
- queue: Lists the songs in the queue.
- help: Lists available commands
- Plus a few disabled commands that may not work.

## Requirements
- Linux
- NodeJS 6.0+

## Installation
> Npm module support coming soon! Not yet implemented.

Clone this repository, and run:
```sh
$ npm install
```

Then rename the `config.example.js` to `config.js` and fill in the empty fields.

## Usage

```sh
$ npm start
```

## Versioning
Vibe.js is developed using [Semantic Versioning](semver.org). Releases will be numbered with the format `<major>.<minor>.<patch>` with the following guidelines:

- Breaking backward compatibility bumps the major (and resets the minor and patch)
- New features without breaking backward compatibility bumps the minor (and resets the patch)
- Bug fixes and misc. changes bumps the patch

## License

GPL-3.0 © [Tanner Goins]()


[npm-image]: https://badge.fury.io/js/vibe.js.svg
[npm-url]: https://npmjs.org/package/vibe.js
[travis-image]: https://travis-ci.org/tannerz28/vibe.js.svg?branch=master
[travis-url]: https://travis-ci.org/tannerz28/vibe.js
[daviddm-image]: https://david-dm.org/tannerz28/vibe.js.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/tannerz28/vibe.js
