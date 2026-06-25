#!/usr/bin/env python3
"""Compose the 1080x1080 feed poster from the generated key art + burned title."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = Path(__file__).parent
ART = HERE / "_raw" / "poster_art.png"
OUT_PUB = HERE / "public" / "poster.png"
OUT_REPO = Path("/Users/yin/code/games/games/posters/past-life.png")

S = 1080
GOLD = (231, 200, 126)
GOLD_DEEP = (180, 140, 70)
PARCH = (214, 196, 150)
INK = (10, 7, 6)

FONT_DIR = "/System/Library/Fonts/Supplemental/"
title_font = ImageFont.truetype(FONT_DIR + "Georgia Bold.ttf", 150)
sub_font = ImageFont.truetype(FONT_DIR + "Georgia Italic.ttf", 40)

# base canvas
canvas = Image.new("RGB", (S, S), INK)

# place art (scale to cover, centered, nudged up to leave room for title)
art = Image.open(ART).convert("RGB")
scale = S / min(art.size)
art = art.resize((int(art.width * scale), int(art.height * scale)), Image.LANCZOS)
ax = (S - art.width) // 2
ay = (S - art.height) // 2 - 70
canvas.paste(art, (ax, ay))

# bottom scrim for title legibility
scrim = Image.new("L", (S, S), 0)
sd = ImageDraw.Draw(scrim)
for y in range(S):
    if y > S * 0.6:
        a = int(min(255, (y - S * 0.6) / (S * 0.4) * 255))
        sd.line([(0, y), (S, y)], fill=a)
black = Image.new("RGB", (S, S), INK)
canvas = Image.composite(black, canvas, scrim)

# subtle top vignette too
top = Image.new("L", (S, S), 0)
td = ImageDraw.Draw(top)
for y in range(int(S * 0.22)):
    a = int((1 - y / (S * 0.22)) * 150)
    td.line([(0, y), (S, y)], fill=a)
canvas = Image.composite(black, canvas, top)

draw = ImageDraw.Draw(canvas)


def spaced(s, n=1):
    return (" " * n).join(list(s))


def center_text(y, text, font, fill, track=0, glow=False):
    t = spaced(text, track) if track else text
    bbox = draw.textbbox((0, 0), t, font=font)
    w = bbox[2] - bbox[0]
    x = (S - w) // 2 - bbox[0]
    if glow:
        glow_img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow_img)
        gd.text((x, y), t, font=font, fill=(231, 200, 126, 150))
        glow_img = glow_img.filter(ImageFilter.GaussianBlur(14))
        canvas.paste(Image.new("RGB", (S, S), GOLD), (0, 0), glow_img)
    # shadow
    draw.text((x + 3, y + 4), t, font=font, fill=(0, 0, 0))
    draw.text((x, y), t, font=font, fill=fill)


# title — PAST LIFE (two words, stacked) for impact
center_text(S - 360, "PAST", title_font, PARCH, track=1, glow=True)
center_text(S - 210, "LIFE", title_font, GOLD, track=1, glow=True)

# gilt rule + subtitle
ry = S - 78
draw.line([(S * 0.5 - 150, ry), (S * 0.5 - 30, ry)], fill=GOLD_DEEP, width=2)
draw.line([(S * 0.5 + 30, ry), (S * 0.5 + 150, ry)], fill=GOLD_DEEP, width=2)
center_text(S - 62, "the portrait of who you were before", sub_font, (170, 152, 116))

canvas.save(OUT_PUB)
canvas.save(OUT_REPO)
print("saved", OUT_PUB)
print("saved", OUT_REPO)
