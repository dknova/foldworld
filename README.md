# Foldworld

Serve the folder over http (textures and props.json are fetched, so file:// will not work):

    python3 -m http.server 8000

then open http://localhost:8000

- index.html: page shell and styles
- assets/main.js: the three.js scene (three r128 from cdnjs)
- assets/props/: six sprite atlases + props.json (traced outlines)
- assets/tex/: cloth, rag paper, paper detail/normal maps, wood
