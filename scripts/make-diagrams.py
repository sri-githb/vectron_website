#!/usr/bin/env python3
"""Generate Vectron technical line-art SVGs (illustrative schematics only)."""
import math, os

INK = "#17181f"; BLUE = "#2aa0dd"; BLUED = "#1773a8"
PURPLE = "#54406b"; ORANGE = "#e85020"; PAPER = "#f6f4ef"; GREY = "#8a9099"

def gear_path(cx, cy, r1, r0, n, rot=0.0):
    pts = []
    for i in range(2 * n):
        a = rot + (i * math.pi) / n
        r = r1 if i % 2 == 0 else r0
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + " Z"

def arrow_marker(mid=False):
    if mid:
        return ('<marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
                '<path d="M0 0L10 5L0 10z" fill="%s"/></marker>' % BLUED)
    return ('<marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            '<path d="M0 0L10 5L0 10z" fill="%s"/></marker>' % BLUED)

def wrap(body, w, h, desc, extra_defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{desc}">'
            f'<defs>{arrow_marker()}{extra_defs}</defs>{body}</svg>')

def line(x1,y1,x2,y2,color=INK,w=2,dash=None,marker=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = f' marker-end="url(#ah)"' if marker else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}"{d}{m}/>'

def rect(x,y,w,h,fill="none",stroke=INK,sw=2,rx=0,dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'

def circ(cx,cy,r,fill="none",stroke=INK,sw=2,dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'

def text(x,y,s,size=15,color=INK,w=600,anchor="start",ls=0.6,tf="none"):
    a = f' text-anchor="{anchor}"' if anchor != "start" else ""
    return f'<text x="{x}" y="{y}" font-family="Manrope, Arial, sans-serif" font-size="{size}" font-weight="{w}" letter-spacing="{ls}" fill="{color}"{a} transform="{tf}">{s}</text>'

def label(x, y, s, size=13, color=GREY, anchor="start"):
    return text(x, y, s, size, color, 600, anchor)

out = "assets/img"
os.makedirs(out, exist_ok=True)

def write(name, svg):
    with open(os.path.join(out, name), "w", encoding="utf-8") as f:
        f.write(svg)
    print("wrote", name, len(svg), "bytes")

# ---------------------------------------------------------------- drive-line
W, H = 1200, 460
b = []
b.append(rect(70, 150, 200, 200, PAPER, INK, 2, 16))          # VFD cabinet
b.append(rect(90, 178, 160, 60, "none", BLUED, 2, 6))
b.append(line(100, 208, 240, 208, BLUE, 2))
b.append(line(110, 194, 132, 194, BLUE, 2))
b.append(line(110, 222, 132, 222, BLUE, 2))
b.append(text(90, 322, "VFD", 17, INK, 700, "start", 1.2))
b.append(label(90, 342, "variable freqency drive", 12))
b.append(text(70, 148, "DRIVE LINE — MOTOR TO PLANT", 12, PURPLE, 700, "start", 2.4))
b.append(line(382, 250, 322, 250, BLUE, 2, marker=True))       # arrow1
b.append(label(326, 232, "power", 13))

# motor block
b.append(rect(350, 150, 220, 200, PAPER, INK, 2, 16))
for i in range(5):
    a = i * 2 * math.pi / 5
    b.append(line(392, 250, 392 + 30 * math.cos(a), 250 + 30 * math.sin(a), BLUED, 2))
b.append(circ(392, 250, 32, "#ffffff", BLUED, 2))
b.append(circ(452, 250, 58, "#ffffff", INK, 2))
b.append(circ(452, 250, 40, "none", INK, 1.5))
b.append(circ(452, 250, 34, "#d8dde2", INK, 1.5))
b.append(circ(452, 250, 8, INK, INK, 2))
b.append(rect(428, 108, 52, 42, "#ffffff", INK, 2, 6))          # terminal box
b.append(line(452, 150, 452, 192, INK, 2))
b.append(rect(380, 300, 70, 50, "#ffffff", INK, 2))             # feet
b.append(rect(484, 300, 70, 50, "#ffffff", INK, 2))
b.append(text(452, 322, "MOTOR", 16, INK, 700, "middle", 1.2))
b.append(line(578, 250, 512, 250, INK, 5))

# gearbox block
b.append(rect(650, 150, 230, 200, PAPER, INK, 2, 16))
b.append('<path d="%s" fill="#ffffff" stroke="%s" stroke-width="2"/>' % (gear_path(720, 250, 58, 46, 12), INK))
b.append('<path d="%s" fill="#ffffff" stroke="%s" stroke-width="2"/>' % (gear_path(802, 250, 34, 26, 8), INK))
b.append(circ(720, 250, 16, "#eef2f5", INK, 1.5))
b.append(circ(720, 250, 6, INK, INK, 1.5))
b.append(circ(802, 250, 8, "#eef2f5", INK, 1.5))
b.append(circ(802, 250, 4, INK, INK, 1))
b.append(text(765, 322, "GEARBOX", 16, INK, 700, "middle", 1.2))
b.append(line(922, 250, 870, 250, BLUE, 2, marker=True))        # arrow2
b.append(label(868, 232, "torque", 13))

# load block
b.append(rect(930, 150, 200, 200, PAPER, INK, 2, 16))
b.append(circ(1030, 250, 64, "#ffffff", INK, 2))
b.append(circ(1030, 250, 18, "#d8dde2", INK, 1.5))
b.append(line(1030, 250, 1030, 150, INK, 2))
b.append(rect(1000, 96, 60, 54, "#ffffff", INK, 2))             # drive head
b.append(line(1030, 96, 1030, 150, INK, 2))
b.append(text(1030, 322, "LOAD / PLANT", 15, INK, 700, "middle", 0.9))
b.append(line(1130, 250, 966, 250, INK, 3))                     # shaft rest

# loop back (energy/efficiency note)
b.append(line(1090, 372, 200, 372, BLUED, 1.6, dash="7 6"))
b.append(line(200, 372, 200, 336, BLUED, 1.6, dash="7 6", marker=True))
b.append(label(640, 404, "reduced energy loss  ·  maintained uptime", 13, BLUED, "middle"))
b.append(text(1178, 448, "illustrative schematic — not to scale", 11, GREY, 500, "end"))
svg = wrap("".join(b), W, H, "Drive line schematic: variable frequency drive, electric motor, gearbox and load")
write("drive-line.svg", svg)

# ---------------------------------------------------------------- motor cutaway
W, H = 900, 420
b = []
# dashed centerline
b.append(line(60, 210, 840, 210, GREY, 1.4, dash="12 8"))
b.append(circ(60, 210, 25, "none", GREY, 1.2, dash="3 3"))
# frame with cooling fins
b.append(rect(140, 150, 520, 120, "none", INK, 2.5, 10))
for i in range(14):
    x = 152 + i * 36
    b.append(rect(x, 132, 10, 18, "none", INK, 1.6))
# stator core
b.append(circ(400, 210, 74, "none", INK, 2.5))
b.append(circ(400, 210, 58, "none", INK, 1.6))
for i in range(12):
    a = i * 2 * math.pi / 12
    x = 400 + 66 * math.cos(a); y = 210 + 66 * math.sin(a)
    if -1.4 < math.cos(a) < 1.4:
        b.append(rect(x - 2.5, y - 9, 5, 18, "none", BLUED, 1.4))
# rotor + shaft
b.append(circ(400, 210, 44, "#eef2f5", INK, 2))
b.append(circ(400, 210, 42, "none", BLUED, 0.0))
for i in range(8):
    a = i * 2 * math.pi / 8
    x = 400 + 43 * math.cos(a); y = 210 + 43 * math.sin(a)
    b.append(rect(x - 2, y - 12, 4, 24, "none", BLUED, 1.2))
b.append(rect(400 - 4, 210 - 60, 8, 120, INK, INK, 1))          # shaft core
# fan + cowl (left end)
b.append(circ(300, 210, 34, "none", INK, 2))
for i in range(6):
    a = i * 2 * math.pi / 6
    b.append(line(300, 210, 300 + 24 * math.cos(a), 210 + 24 * math.sin(a), INK, 2))
b.append(circ(300, 210, 10, "#ffffff", INK, 1.5))
b.append(rect(120, 176, 22, 68, "none", INK, 2, 6))             # cowl open
# terminal box
b.append(rect(360, 84, 80, 60, "#ffffff", INK, 2, 6))
b.append(line(400, 144, 400, 150, INK, 2))
b.append(line(368, 108, 432, 108, BLUED, 2))
b.append(line(368, 120, 432, 120, BLUED, 2))
# feet
b.append(rect(360, 270, 80, 34, "#ffffff", INK, 2))
b.append(rect(500, 270, 80, 34, "#ffffff", INK, 2))
b.append(line(400, 210, 760, 210, INK, 7))                      # output shaft
b.append(rect(730, 198, 60, 24, "none", INK, 1.5))              # keyway
# labels
b.append(label(156, 172, "fan", 11))
b.append(label(346, 128, "terminal box", 11))
b.append(label(478, 130, "stator windings", 11))
b.append(label(488, 262, "rotor", 11))
b.append(label(760, 170, "shaft", 11))
b.append(text(450, 360, "INDICTION MOTOR — SECTION STUDY", 13, PURPLE, 700, "middle", 2.2))
b.append(text(450, 390, "illustrative cross-section · not to scale", 11, GREY, 500, "middle"))
svg = wrap("".join(b), W, H, "Cross-section study of an induction motor: frame, stator, rotor, fan and terminal box")
write("motor-cutaway.svg", svg)

# ---------------------------------------------------------------- geartrain
W, H = 900, 470
b = []
# pitch circles (dashed)
b.append(circ(300, 250, 60, "none", BLUED, 1.6, dash="7 5"))
b.append(circ(430, 250, 36, "none", BLUED, 1.6, dash="7 5"))
# gears
b.append('<path d="%s" fill="#ffffff" stroke="%s" stroke-width="2"/>' % (gear_path(300, 250, 64, 50, 10), INK))
b.append('<path d="%s" fill="#ffffff" stroke="%s" stroke-width="2"/>' % (gear_path(430, 250, 38, 29, 7), INK))
b.append(circ(300, 250, 20, "#eef2f5", INK, 1.5))
b.append(circ(300, 250, 8, INK, INK, 1.5))
b.append(circ(430, 250, 12, "#eef2f5", INK, 1.5))
b.append(circ(430, 250, 5, INK, INK, 1.2))
# centre distance
b.append(line(300, 250, 430, 250, GREY, 1.2, dash="2 4"))
b.append(text(365, 210, "a", 15, GREY, 600, "middle"))
b.append(line(300, 312, 300, 350, GREY, 1.2))
b.append(line(430, 312, 430, 350, GREY, 1.2))
b.append(line(250, 350, 480, 350, GREY, 1.2))
b.append(line(250, 350, 268, 342, GREY, 1.2)); b.append(line(250, 350, 268, 358, GREY, 1.2))
b.append(line(480, 350, 462, 342, GREY, 1.2)); b.append(line(480, 350, 462, 358, GREY, 1.2))
b.append(text(320, 374, "centre distance", 12, GREY, 600, "middle"))
# rotation arrows
b.append('<path d="M240 170 A 94 94 0 0 1 360 170" fill="none" stroke="%s" stroke-width="2" marker-end="url(#ah)"/>' % ORANGE)
b.append('<path d="M420 150 A 60 60 0 0 0 440 180" fill="none" stroke="%s" stroke-width="2" marker-end="url(#ah)"/>' % ORANGE)
b.append(text(150, 150, "wheel (helical)", 13, INK, 600))
b.append(text(500, 128, "pinion", 13, INK, 600))
b.append(text(205, 196, "r1", 13, BLUED, 600))
b.append(text(462, 226, "r2", 13, BLUED, 600))
b.append(text(450, 430, "HELICAL GEAR PAIR — MESH STUDY", 13, PURPLE, 700, "middle", 2.2))
b.append(text(450, 452, "illustrative schematic · not to scale", 11, GREY, 500, "middle"))
svg = wrap("".join(b), W, H, "Meshing helical gear pair study showing pitch circles, centre distance and rotation")
write("geartrain.svg", svg)

# ---------------------------------------------------------------- gearbox exploded
W, H = 900, 540
b = []
# housing halves (upper lifted, lower on rail)
b.append(rect(150, 90, 420, 90, "#ffffff", INK, 2, 8))
b.append(rect(150, 330, 420, 74, "#ffffff", INK, 2, 8))
b.append(text(360, 156, "housing — upper half", 12, GREY, 500, "middle"))
b.append(text(360, 376, "housing — lower half", 12, GREY, 500, "middle"))
# gear train between halves
b.append('<path d="%s" fill="#ffffff" stroke="%s" stroke-width="2"/>' % (gear_path(340, 260, 64, 50, 10), INK))
b.append('<path d="%s" fill="#ffffff" stroke="%s" stroke-width="2"/>' % (gear_path(340, 140, 28, 21, 6), INK))
b.append('<path d="%s" fill="#ffffff" stroke="%s" stroke-width="2"/>' % (gear_path(315, 248, 44, 35, 8, 0.5), BLUED))
# shafts
b.append(line(150, 260, 640, 260, INK, 8))                       # output shaft
b.append(line(150, 140, 640, 140, INK, 5))                       # input shaft
b.append(rect(560, 246, 70, 28, "none", INK, 1.5))               # keyway
# output flange
b.append(rect(640, 210, 60, 100, "#ffffff", INK, 2))
b.append(rect(648, 218, 44, 84, "none", INK, 1.2))
for i in range(4):
    b.append(circ(658 + (i % 2) * 28, 228 + (i // 2) * 64, 4, INK, INK, 1))
# separation arrows
b.append(line(360, 330, 360, 300, BLUED, 1.6, dash="5 4", marker=True))
b.append(line(360, 186, 360, 156, BLUED, 1.6, dash="5 4", marker=True))
# labels
b.append(text(120, 140, "input shaft", 12, GREY, 500))
b.append(text(120, 260, "output shaft", 12, GREY, 500))
b.append(text(712, 240, "output", 12, GREY, 500))
b.append(text(712, 258, "flange", 12, GREY, 500))
b.append(text(180, 320, "gear pair", 12, GREY, 500))
b.append(line(218, 314, 316, 256, GREY, 1.2))
b.append(text(450, 470, "GEARBOX — EXPLODED STUDY", 13, PURPLE, 700, "middle", 2.2))
b.append(text(450, 494, "illustrative schematic · not to scale", 11, GREY, 500, "middle"))
b.append(rect(140, 420, 440, 12, "none", INK, 2))
b.append(text(160, 452, "baseplate", 12, GREY, 500))
svg = wrap("".join(b), W, H, "Exploded study of a single-stage gearbox showing housing halves and gear pair")
write("gearbox-exploded.svg", svg)

# ---------------------------------------------------------------- ro train
W, H = 1180, 420
b = []
b.append(rect(60, 150, 190, 170, PAPER, INK, 2, 14))
b.append(text(155, 246, "SEAWATER", 15, INK, 700, "middle", 1.0))
b.append(text(155, 270, "feed", 12, GREY, 500, "middle"))
b.append(text(60, 148, "REVERSE OSMOSIS TRAIN", 12, PURPLE, 700, "start", 2.4))

b.append(line(282, 235, 250, 235, BLUE, 2, marker=True))
b.append(rect(310, 130, 210, 210, PAPER, INK, 2, 14))
b.append(circ(415, 235, 52, "#ffffff", BLUE, 2))
b.append(circ(415, 235, 18, "#d8dde2", INK, 1.5))
b.append(rect(415 - 3, 235 - 52, 6, 104, INK, INK, 1.2))
b.append(rect(343, 118, 60, 30, "#ffffff", INK, 2, 6))
b.append(text(416, 290, "APP PUMP", 14, INK, 700, "middle", 0.8))
b.append(text(416, 310, "high pressure", 12, GREY, 500, "middle"))

b.append(line(552, 235, 520, 235, BLUE, 2, marker=True))
b.append(rect(580, 150, 190, 170, PAPER, INK, 2, 14))
b.append(text(675, 240, "MEMBRANES", 15, INK, 700, "middle", 1.0))
b.append(text(675, 264, "RO train", 12, GREY, 500, "middle"))

b.append(line(802, 235, 770, 235, BLUE, 2, marker=True))
b.append(rect(830, 150, 190, 170, PAPER, INK, 2, 14))
b.append(text(925, 240, "PERMEATE", 15, INK, 700, "middle", 1.0))
b.append(text(925, 264, "fresh water", 12, GREY, 500, "middle"))

# iSave energy recovery loop (dashed)
b.append(line(925, 320, 925, 372, BLUED, 1.6, dash="7 6"))
b.append(line(925, 372, 415, 372, BLUED, 1.6, dash="7 6"))
b.append(line(415, 372, 415, 342, BLUED, 1.6, dash="7 6", marker=True))
b.append(rect(560, 350, 220, 44, "#f2f0ea", BLUED, 1.6, 10))
b.append(text(670, 378, "iSave energy recovery device", 13, BLUED, 700, "middle", 0.4))

# brine note
b.append(line(700, 320, 700, 300, GREY, 1.2))
b.append(text(700, 330, "brine / concentrate (ZLD · MLD)", 11, GREY, 500, "middle"))
b.append(text(1175, 410, "illustrative schematic — not to scale", 11, GREY, 500, "end"))
svg = wrap("".join(b), W, H, "Reverse osmosis train with a high-pressure APP pump, membranes and iSave energy recovery device")
write("ro-train.svg", svg)

print("done")