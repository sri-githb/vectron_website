"""Enhance Vectron photos: smart upscale + sharpen + color grade, then cut
products sitting on (near-)uniform light backgrounds into transparent PNGs.

Pipeline (no external AI — deterministic image processing):
  1. All JPGs in assets/img are enhanced in place (.jpg, ~1400px min edge).
  2. Products on clean light backgrounds also get a `<name>-cutout.png`
     (feather-edged, defringed, transparent) for clean placements.
Keeps original filenames so existing references keep working.
"""
import os, sys, math
from collections import deque
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

SRC = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')
TARGET_MIN_W = 1400
CUTOUT_CANDIDATES = {
    'motor-abb-std.jpg', 'motor-abb-brake.jpg', 'motor-abb-crane.jpg',
    'motor-hindustan.jpg', 'motors-bonfiglioli.jpg',
    'gearboxes-bonfiglioli.jpg', 'gearbox-shanthi-helical.jpg',
    'pumps-danfoss-app.jpg',
}

def dist2(a, b):
    return sum((a[i] - b[i]) ** 2 for i in range(3))

def enhance(im):
    w, h = im.size
    scale = max(TARGET_MIN_W / w, 1.55)
    im = im.convert('RGB')
    # light denoise before upscale (kills scan/jpeg grain)
    if max(w, h) < 1100:
        im = im.filter(ImageFilter.MedianFilter(3))
    nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=115, threshold=3))
    im = ImageEnhance.Color(im).enhance(1.06)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Sharpness(im).enhance(1.08)
    return im

def border_ref(cols, rows, px):
    """Reference background color from the outer ring (robust to a shading gradient)."""
    ring = []
    for y in range(rows):
        for x in range(cols):
            if x < 6 or x >= cols - 6 or y < 6 or y >= rows - 6:
                ring.append(px[x, y])
    m = len(ring)
    mean1 = [sum(c[i] for c in ring) / m for i in range(3)]
    near = [c for c in ring if dist2(c, mean1) < 55 ** 2]
    if len(near) < m * 0.5:
        near = ring
    mm = len(near)
    return [sum(c[i] for c in near) / mm for i in range(3)]

def smart_cutout(im, tag, sl=380):
    W, H = im.size
    sh = max(1, round(H * sl / W))
    small = im.resize((sl, sh), Image.LANCZOS)
    spx = small.load()
    ref = border_ref(sl, sh, spx)
    tol = 46

    bg = [[False] * sl for _ in range(sh)]
    dq = deque()
    for y in range(sh):
        for x in list(range(6)) + list(range(sl - 6, sl)):
            bg[y][x] = True; dq.append((x, y))
    for x in range(sl):
        for y in list(range(6)) + list(range(sh - 6, sh)):
            if not bg[y][x]:
                bg[y][x] = True; dq.append((x, y))
    cap = int(sl * sh * 0.90)
    count = len(dq)
    while dq and count < cap:
        x, y = dq.popleft()
        c = spx[x, y]
        for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if 0 <= nx < sl and 0 <= ny < sh and not bg[ny][nx] and dist2(spx[nx, ny], ref) < tol:
                bg[ny][nx] = True; dq.append((nx, ny)); count += 1

    # subject mask (inverse of background)
    subj = Image.new('L', (sl, sh), 0)
    sp = subj.load()
    for y in range(sh):
        for x in range(sl):
            if not bg[y][x]:
                sp[x, y] = 255
    # morphology: closing bridges thin gaps between touching units / shadow flecks
    for r in (3, 6, 10):
        subj = subj.filter(ImageFilter.MaxFilter(r * 2 + 1))
        subj = subj.filter(ImageFilter.MinFilter(r * 2 + 1))
        sp = subj.load()
        coverage = sum(1 for y in range(sh) for x in range(sl) if sp[x, y]) / (sl * sh)
        if 0.10 <= coverage <= 0.90:
            break

    # validation at small scale
    coverage = sum(1 for y in range(sh) for x in range(sl) if sp[x, y]) / (sl * sh)
    if not (0.12 <= coverage <= 0.86):
        return None, {'coverage': round(coverage, 3), 'ref': tuple(round(v) for v in ref)}

    # connected components of subject (8-connectivity)
    seen = [[False] * sl for _ in range(sh)]
    comps = []
    for y in range(sh):
        for x in range(sl):
            if sp[x, y] and not seen[y][x]:
                stack = [(x, y)]; seen[y][x] = True; size = 0
                while stack:
                    cx, cy = stack.pop(); size += 1
                    for dx in (-1, 0, 1):
                        for dy in (-1, 0, 1):
                            nx, ny = cx+dx, cy+dy
                            if 0 <= nx < sl and 0 <= ny < sh and not seen[ny][nx] and sp[nx, ny]:
                                seen[ny][nx] = True; stack.append((nx, ny))
                comps.append(size)
    comps.sort(reverse=True)
    ok_comps = comps and comps[0] >= coverage * sl * sh * 0.6 and len(comps) <= 8
    if not ok_comps:
        return None, {'coverage': round(coverage, 3), 'comps': len(comps), 'largest': round(comps[0] / (sl*sh), 3) if comps else 0}

    # defringe: tighten, then feather via smooth upscale
    fe = subj.resize((W, H), Image.LANCZOS)  # feathered alpha by interpolation
    alpha = fe.point(lambda v: min(255, v * 4 // 5 + 40))  # tighten soft edge
    out = im.convert('RGBA')
    out.putalpha(alpha)
    return out, {'coverage': round(coverage, 3), 'comps': len(comps), 'largest': round(comps[0] / (sl*sh), 3) if comps else 0}

def main():
    os.makedirs(SRC, exist_ok=True)
    for fn in sorted(os.listdir(SRC)):
        if not fn.lower().endswith('.jpg'):
            continue
        path = os.path.join(SRC, fn)
        im = Image.open(path)
        print(f"--- {fn} {im.size[0]}x{im.size[1]}")
        if im.size[0] < TARGET_MIN_W:  # already enhanced? then skip re-enhance
            enhanced = enhance(im)
            enhanced.save(path, 'JPEG', quality=90, optimize=True, progressive=True)
            print(f"    enhanced -> {enhanced.size[0]}x{enhanced.size[1]}")
        else:
            enhanced = im.convert('RGB')

        if fn in CUTOUT_CANDIDATES:
            out, meta = smart_cutout(enhanced, fn)
            if out:
                out_path = os.path.join(SRC, fn.replace('.jpg', '-cutout.png'))
                out.save(out_path, 'PNG', optimize=True)
                print(f"    CUTOUT ok -> {fn.replace('.jpg','-cutout.png')}  {out.size[0]}x{out.size[1]}  {meta}")
            else:
                print(f"    cutout SKIPPED (mask unreliable) {meta}")

    # og.jpg: straight enhancement only (dark social card)
    og = os.path.join(SRC, 'og.jpg')
    if os.path.exists(og):
        im = Image.open(og).convert('RGB')
        im = im.resize((1600, 840), Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=90, threshold=3))
        im.save(og, 'JPEG', quality=90, optimize=True, progressive=True)
        print('--- og.jpg enhanced -> 1600x840')

if __name__ == '__main__':
    main()