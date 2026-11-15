"""Rebuild and verify all six approved WAV masters into a separate directory."""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image

import aerosols
import oceans
import storms
from common import IMAGES, ROOT, meter, pcm_bytes


def read_crop(scene, manifest):
    name = scene + ".png"
    theme = scene.split("-")[1]
    original = "ocean.jpg" if theme == "ocean" else theme + ".png"
    entry = manifest["images"][name]
    if theme == "ocean":
        entry = manifest["activeOceanAudioCrops"][name]
    with Image.open(IMAGES / "originals" / original) as image:
        crop = image.convert("RGB").crop(entry["pixelRectangle"])
    digest = hashlib.sha256(crop.tobytes()).hexdigest()
    if digest != entry["rawCropRgbSha256"]:
        raise ValueError(f"{scene} pixels differ from the approved image")
    return crop, digest


def master(audio):
    level, peak = meter(audio)
    return audio * 10 ** (min(-20 - level, -3 - peak) / 20)


def tracks(manifest):
    weather = storms.weather_material()
    for region in ("amazon", "congo", "antarctica"):
        crop, digest = read_crop(region + "-lightning", manifest)
        profile, _ = storms.activity_profile(crop)
        if region == "antarctica":
            assert profile is None
            yield "antarctica-wind", storms.render_wind(digest)[0]
        else:
            yield region + "-storm", storms.render(profile, weather)[0]

    crop, _ = read_crop("amazon-ocean", manifest)
    phrases = [oceans.recorded_phrase(take) for take in oceans.SOPRANO_TAKES]
    yield "amazon-ocean-soprano", master(oceans.render_soprano(crop, phrases)[0])

    crop, digest = read_crop("antarctica-ocean", manifest)
    phrases = [oceans.load_take(take) for take in oceans.MALE_TAKES]
    voice, _ = oceans.render_male(crop, {"cropRawRgbSha256": digest}, phrases)
    yield "antarctica-ocean-deep-male", master(voice)

    crop, _ = read_crop("congo-aerosols", manifest)
    sources = {name: aerosols.decode(name) for name in ("cough-1.ogg", "cough-2.ogg")}
    yield "congo-air-pollution-cough-dense", master(aerosols.render(crop, sources)[0])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path, help="New directory for verified WAV files")
    target = parser.parse_args().output
    target.mkdir(parents=True, exist_ok=False)
    manifest = json.loads((IMAGES / "sources.json").read_text(encoding="utf8"))
    hashes = json.loads((ROOT.parent / "assets/audio/sha256.json").read_text())
    for stem, audio in tracks(manifest):
        filename = stem + ".wav"
        data = pcm_bytes(audio)
        if hashlib.sha256(data).hexdigest() != hashes[filename]:
            raise ValueError(f"{filename} differs from the approved master")
        (target / filename).write_bytes(data)
        print("Verified", filename, flush=True)


if __name__ == "__main__":
    main()
