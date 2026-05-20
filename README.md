# ORBIS

A 3D planetary observatory — built as my submission for the
3D Apps assignment at the University of Sussex, 2026.

Rotate, zoom, and inspect four bodies in our solar system:
Earth, Mars, Jupiter, and the Moon. Switch between them in
the catalogue, toggle wireframe view, and adjust the lighting.

## Running it locally

The site needs to be served via a local web server because
it uses ES modules. In VS Code, right-click `index.html` and
choose "Open with Live Server".

## How it works

- HTML, CSS, and JavaScript — no build step, no framework
- Three.js (r160) loaded via CDN for the 3D rendering
- Models authored in Blender, exported as GLB

The `.blend` source files are in the `blender/` folder.
The four planets are in `models/` as GLB exports.

## Credits

- Three.js — https://threejs.org/
- Planet textures — Solar System Scope (CC-BY 4.0) and NASA Visible Earth (public domain)
- Fonts — Cormorant Garamond and JetBrains Mono via Google Fonts

Candidate no. 266696