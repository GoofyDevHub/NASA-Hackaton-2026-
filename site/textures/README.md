# Globe surface

The navigation globe is drawn from `earth.jpg` (2048 × 1024, equirectangular). It is only a backdrop: it is not one of the
nine scene images and drives no sound.

| File | What it is | SHA-256 |
|---|---|---|
| `blue-marble.png` | NASA Blue Marble without clouds, unchanged from <https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-2048.png> ([SVS 2915](https://svs.gsfc.nasa.gov/2915/)) | `ae6214b078ed0864c96f74bcb10ae3021f6eb116f8059797efe0fa9ea8b89d35` |
| `blue-marble-clouds.jpg` | NASA Blue Marble with clouds, unchanged 3840 px rendition of [Land_ocean_ice_cloud_hires.jpg](https://commons.wikimedia.org/wiki/File:Land_ocean_ice_cloud_hires.jpg) from Wikimedia Commons. NASA's own server ([Visible Earth 57735](https://visibleearth.nasa.gov/images/57735)) could not be reached on 14 November 2026. | `4dd4d32a751f4efb4f65e1a7d619fc872e65869c6bedf5d5b22479fe7a4b7944` |
| `earth.jpg` | Derived: the clear image with the thicker clouds of the second laid over it at reduced opacity. | `7c9efb750d29545be1525d9141977deb84bbe05ffe09966d6d6063ca23e5d866` |

Regenerate `earth.jpg` from this folder:

```sh
ffmpeg -i blue-marble.png -i blue-marble-clouds.jpg -filter_complex "[0:v]format=gbrp[a];[1:v]scale=2048:1024:flags=lanczos,format=gbrp[b];[a][b]blend=all_expr='A+(B-A)*clip((B-A-55)/130,0,1)*0.78',format=yuvj444p" -q:v 2 earth.jpg
```

Confirm the credit lines before submission.
