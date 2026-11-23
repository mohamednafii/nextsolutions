"""
Device mockups for « Nos réalisations » — same laptop and phone as the
La Maison des Amis renders, with any site's captures mapped onto the screens
(4-point perspective, supersampled), so every slide of the carousel shares one
geometry and one light.

Usage (from web/):
  python scripts/device-mockup.py <id> --desktop path/to/desktop.png [--mobile path/to/mobile.png]

Captures: desktop 16:10 (e.g. 1600x1000 or 2880x1800), mobile ~9:19.5 (e.g.
1170x2532). Output: public/images/realisations/<id>-laptop.webp (1440x905) and
<id>-phone.webp (675x1483), trimmed exactly like the originals.
Requires Pillow + numpy. Templates: the two supplied La Maison des Amis PNGs.
"""
import argparse
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.dirname(HERE)
TEMPLATES = os.path.join(WEB, '..', 'nextsolutions_trustbar_logos_white_transparent (1)', 'nextsolutions_trustbar_assets')
OUT = os.path.join(WEB, 'public', 'images', 'realisations')

# Screen corners in the template PNGs (TL, TR, BR, BL), measured on the bezel/content edge.
LAPTOP = {'file': 'la-maison-des-amis-laptop.png', 'quad': [(508, 186), (1430, 116), (1318, 789), (360, 741)], 'radius': 0.012, 'trim': (16, 82, 1440, 905)}
PHONE = {'file': 'la-maison-des-amis-phone.png', 'quad': [(242, 39), (809, 124), (832, 1461), (242, 1476)], 'radius': 0.13, 'trim': (175, 27, 675, 1483),
         # Dynamic Island area: the template's own black pill is kept on top of the new screen.
         'island': (420, 70, 680, 190), 'status_bar': 0.06}
SS = 3  # supersampling


def homography(src, dst):
    """3x3 matrix H with dst ~ H @ src for four point pairs."""
    a = []
    for (x, y), (u, v) in zip(src, dst):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y, -u])
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y, -v])
    _, _, vt = np.linalg.svd(np.array(a, dtype=float))
    h = vt[-1].reshape(3, 3)
    return h / h[2, 2]


def rounded_mask(w, h, r):
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), radius=r, fill=255)
    return m


def with_status_bar(cap, band):
    """Shift a mobile capture down by a status-bar band (as on a real phone, the
    Dynamic Island never covers the site), filled with the capture's top colour."""
    w, h = cap.size
    b = int(round(h * band))
    top = cap.crop((0, 0, w, 2)).resize((1, 1), Image.BOX).getpixel((0, 0))
    out = Image.new('RGB', (w, h), top)
    out.paste(cap.crop((0, 0, w, h - b)), (0, b))
    return out


def place(template, capture, spec):
    tw, th = template.size
    cap = capture.convert('RGB')
    if spec.get('status_bar'):
        cap = with_status_bar(cap, spec['status_bar'])
    cw, ch = cap.size
    src = [(0, 0), (cw, 0), (cw, ch), (0, ch)]
    dst = [(x * SS, y * SS) for x, y in spec['quad']]
    # PIL wants the map output -> input
    h = homography(dst, src)
    coeffs = (h / h[2, 2]).flatten()[:8]
    big = (tw * SS, th * SS)
    warped = cap.transform(big, Image.PERSPECTIVE, tuple(coeffs), Image.BICUBIC)
    mask = rounded_mask(cw, ch, int(spec['radius'] * cw)).transform(big, Image.PERSPECTIVE, tuple(coeffs), Image.BICUBIC)
    warped = warped.resize((tw, th), Image.LANCZOS)
    mask = mask.resize((tw, th), Image.LANCZOS)
    out = template.copy()
    layer = warped.convert('RGBA')
    layer.putalpha(mask)
    out.alpha_composite(layer)
    if 'island' in spec:
        # Put the template's black island back (only its truly black pixels, softened edge).
        x0, y0, x1, y1 = spec['island']
        t = np.asarray(template.crop((x0, y0, x1, y1)).convert('RGB')).astype(int)
        lum = (t[..., 0] * 299 + t[..., 1] * 587 + t[..., 2] * 114) / 1000
        pill = Image.fromarray(((lum < 9) * 255).astype('uint8'), 'L').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
        # keep only the largest dark blob near the centre: the island itself
        out.paste(template.crop((x0, y0, x1, y1)), (x0, y0), pill)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('id')
    ap.add_argument('--desktop', required=True)
    ap.add_argument('--mobile')
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    jobs = [(LAPTOP, a.desktop, 'laptop')] + ([(PHONE, a.mobile, 'phone')] if a.mobile else [])
    for spec, cap_path, name in jobs:
        tpl = Image.open(os.path.join(TEMPLATES, spec['file'])).convert('RGBA')
        img = place(tpl, Image.open(cap_path), spec)
        x, y, w, h = spec['trim']
        img = img.crop((x, y, x + w, y + h))
        dest = os.path.join(OUT, f'{a.id}-{name}.webp')
        img.save(dest, 'WEBP', quality=90, method=6)
        print(dest, img.size, os.path.getsize(dest))


if __name__ == '__main__':
    main()
