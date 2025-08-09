Procedural Planets in WebGL using three.js

[Live Demo](http://colordodge.com/ProceduralPlanet)

[Gallery](https://imgur.com/a/OwfIwj4)

## Development

### Troubleshooting: Warp Effect Not Visible
If the warp effect when switching planets is not visible, make sure that `src/css/warp-effect.css` is copied to `dist/src/css/`. The dev server only serves static files from `dist/`, not from `src/`. You can manually copy the file or update your build process to include it.

## How to install

* Run `npm install`
* Run `npm run dev`
* Open http://localhost:8080
