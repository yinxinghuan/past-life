#!/usr/bin/env python3
"""Generate Past Life's static assets via the transit txt2img endpoint.

Assets:
  public/hero.jpg          — candlelit archive background (threshold + seance)
  public/demo_portrait.jpg — a sample antique past-life portrait (demo mode)
  _raw/poster_art.png      — poster key art (title burned on after, see below)
"""
import json, os, ssl, subprocess, sys, time, urllib.request, urllib.error
from pathlib import Path

API_URL = "https://chat.aiwaves.tech/aigram/api/gen-image"
HEADERS = {
    "Content-Type": "application/json",
    "Origin": "https://aigram.app",
    "Referer": "https://aigram.app/",
    "User-Agent": "Mozilla/5.0",
}
HERE = Path(__file__).parent
PUB = HERE / "public"
RAW = HERE / "_raw"
_SSL = ssl.create_default_context(); _SSL.check_hostname = False; _SSL.verify_mode = ssl.CERT_NONE

ASSETS = [
    ("hero", PUB / "hero.jpg",
     "A dim candlelit Victorian séance parlor at night, a wall crowded with "
     "antique gilt-framed oil portraits of strangers fading into deep shadow, "
     "one warm beeswax candle burning on a small table casting soft golden "
     "light and long shadows, drifting dust motes, faded velvet and aged "
     "wallpaper, cinematic chiaroscuro, mostly very dark with a pool of warm "
     "amber light, moody, mysterious, painterly, vertical composition, no "
     "people in foreground, no text, no words."),
    ("demo_portrait", PUB / "demo_portrait.jpg",
     "A genuine antique old-master oil painting portrait of a humble "
     "18th-century Portuguese candlemaker, a tired kind man in a plain linen "
     "shirt with a little soot on one cheek, holding a half-dipped tallow "
     "candle, dark workshop behind him, warm chiaroscuro candlelight from one "
     "side, deep umber shadows, visible brushwork and fine craquelure, varnish "
     "sheen, dignified solemn gaze, museum portrait, vertical, no text."),
    ("poster_art", RAW / "poster_art.png",
     "A haunting antique portrait of a single person in a tarnished oval gilt "
     "frame, rendered as an aged old-master oil painting with craquelure, the "
     "lower half of the face dissolving softly into rising golden embers and "
     "dust, candlelit warm amber glow against near-black darkness, period "
     "clothing, solemn uncanny direct gaze, cinematic, mysterious, vertical "
     "poster composition, dramatic negative space at top and bottom, no text, "
     "no words, no watermark."),
]


def call(prompt, timeout=360, retries=3):
    data = json.dumps({"prompt": prompt}).encode()
    last = None
    for a in range(retries):
        try:
            req = urllib.request.Request(API_URL, data=data, method="POST", headers=HEADERS)
            with urllib.request.urlopen(req, timeout=timeout, context=_SSL) as r:
                body = json.loads(r.read())
            url = body.get("url")
            if not url:
                raise RuntimeError(f"no url: {body}")
            return url
        except Exception as e:
            last = e
            print(f"   retry {a+1}/{retries}: {e}", flush=True)
            time.sleep(8 * (a + 1))
    raise last


def download(url, out):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=90, context=_SSL) as r:
        raw = r.read()
    ext = os.path.splitext(url.split("?")[0])[1].lower() or ".png"
    tmp = out.with_suffix(".dl" + ext)
    tmp.write_bytes(raw)
    # normalize to the target extension via sips
    subprocess.run(["sips", "-s", "format", "jpeg" if out.suffix == ".jpg" else "png",
                    str(tmp), "--out", str(out)], check=True, capture_output=True)
    tmp.unlink()


def main():
    PUB.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)
    for i, (name, out, prompt) in enumerate(ASSETS):
        print(f"[{i+1}/{len(ASSETS)}] {name} ...", flush=True)
        t0 = time.time()
        url = call(prompt)
        print(f"   → {url}", flush=True)
        download(url, out)
        print(f"   saved {out} ({time.time()-t0:.0f}s)", flush=True)
        if i < len(ASSETS) - 1:
            time.sleep(8)
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
