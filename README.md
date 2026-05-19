# ORBIS — 3D Planetary Observatory

A web-based 3D application built for the 3D Web Applications Assignment 2026.

## Running locally

This site uses ES modules and must be served via HTTP, not opened from disk.

```bash
# from the project root:
python3 -m http.server 8000
# then open http://localhost:8000 in a browser
```

Any static server works — VS Code's "Live Server" extension is the easiest
option if you have it installed.

## Project structure

```
3d-app/
├── index.html              main 3D viewer
├── about.html
├── originality.html
├── references.html
├── sitemap.html
├── submission.html
├── css/style.css
├── js/main.js              all the Three.js code
├── models/                 put your .glb exports here
├── textures/               put your texture maps here
├── blender/                put your .blend source files here
└── README.md
```

## What's working right now

- Three.js scene with orbit camera, ambient + directional + rim lights
- Procedural planet placeholders (so the site runs before models are done)
- Catalogue panel — click to switch model
- Wireframe toggle
- Auto-rotate toggle
- Sun and ambient light sliders + day/night presets
- Click-on-model "ping" animation
- All required pages (About, Originality, References, Sitemap, Submission)
- Responsive layout (collapses to single column on narrow screens)

## What you still need to do

### 1. Make your own 3D models in Blender

You currently have procedural placeholders. The assignment requires real
modelling work. For each planet:

1. Create a UV-sphere (Add → Mesh → UV Sphere). Use ~64 segments.
2. Apply a subdivision surface modifier for smoothness.
3. UV-unwrap (in Edit Mode: U → Sphere Projection).
4. Add a material with the planet's texture as the Base Color.
5. **Save** the `.blend` file into `blender/`.
6. **Export** as `File → Export → glTF 2.0 (.glb)` into `models/`.

**For your "complex" model (Earth)** — gain higher modelling marks by going
further:
- Two material slots: ocean + land, with a noise mask separating them
- A second slightly-larger transparent sphere for clouds
- A subtle atmosphere shell (transparent, blue-tinted)

Save the `.blend` file in the `blender/` folder.

### 2. Wire the models in

Open `js/main.js`. In the `CATALOGUE` array near the top, each entry has a
commented-out `glb:` line. Uncomment it once you have the file:

```js
{
  id: 'earth',
  name: 'Earth',
  // ...
  glb: 'models/earth.glb',   // ← uncomment this
},
```

The loader handles centring and scaling automatically.

### 3. Get textures

Free, royalty-free planet textures:
- https://www.solarsystemscope.com/textures/ (CC-BY 4.0)
- https://visibleearth.nasa.gov/ (NASA, public domain)

Apply them in Blender as the Base Color image texture on each material.

### 4. Fill in your details

Search the project for placeholder text in square brackets and replace:
- `[Your name here]` / `[Your full name]`
- `[Your candidate number]`
- `[YOUR-GITHUB-URL]`
- `[YOUR-ONEDRIVE-URL]`
- `[Date]`

These appear in `originality.html` and `submission.html`.

### 5. Put it on GitHub (5 bonus marks!)

```bash
git init
git add .
git commit -m "Initial commit — ORBIS 3D app"
# create a repo on github.com, then:
git remote add origin https://github.com/YOUR-USERNAME/orbis-3d-app.git
git branch -M main
git push -u origin main
```

Then paste the URL into `submission.html`.

### 6. Test in week 11

The brief asks for in-class testing. Bring a working build on a laptop.

## Tech notes

- **No build tools** — vanilla HTML/CSS/JS. Open and go.
- **Three.js r160** loaded from jsDelivr CDN via an ES module import map. No
  npm install required.
- **WebGL 2** is required (every modern browser has it).
- **Memory** — old models are properly disposed when switching, so you can
  flip through the catalogue indefinitely without leaking GPU memory.

## License

Three.js and the Google Fonts used are under
their respective open-source licenses (MIT and SIL OFL).
