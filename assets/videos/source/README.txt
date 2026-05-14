# Source video drops

If you add new `.mov` or `.mp4` files from a phone, place them here, then run (from repo root):

```
ffmpeg -y -i assets/videos/source/YOURFILE.mov \
  -vf "scale='min(1080,iw)':-2" -c:v libx264 -crf 26 -preset medium \
  -movflags +faststart -pix_fmt yuv420p -c:a aac -b:a 128k \
  assets/videos/NEXTNUMBER.mp4
```

Replace `NEXTNUMBER.mp4` with the next free slot (e.g. `13.mp4`), add a poster frame to `assets/videos/thumbnails/`, and wire the card in `index.html` and `push-up-challenge.html`.
