"""LinkedIn banner for mittal.design: the portfolio city as a map cartouche.
Buildings sit at their real grid positions from src/data/projects.ts."""
import math, sys

W, H = 1584, 396
INK, SOFT, ACC, GOLD = '#1b1b1b', '#4a463f', '#5b4bde', '#e0a526'
PAPER, SAND = '#fbf7ee', '#f5efe4'
BIOME = {
    'q1': ('#8fb6d0', '#6f96b0', 'Enterprise · Complex'),
    'q2': ('#6fae6a', '#5a8e57', 'Enterprise · Simple'),
    'q3': ('#b9d68a', '#8eb46a', 'Consumer · Simple'),
    'q4': ('#e6c389', '#c69e64', 'Consumer · Complex'),
}
# id, label, gx, gy, height, scale, glyph, featured
P = [
    ('impressio', 'Impressio', 2, 4, None, 1.3, 'robot', False),
    ('izak', 'iZak', 6, 4, 34, 1.5, 'scanner', False),
    ('paas', 'Ved', 4, 2, 52, 1.5, 'servers', True),
    ('snaplogic', 'SnapLogic', 2, 2, 44, 1.35, 'connector', True),
    ('samsungeq', 'Samsung EQ', -2, 2, None, 1.05, 'heart', False),
    ('holacracy', 'Holacracy', -4, 4, None, 1.15, 'circles', False),
    ('kya', 'KYA', -2, 4, None, 1.05, 'docs', False),
    ('amplyfund', 'Amplyfund', 2, -2, None, 1.1, 'tv', False),
    ('voteiq', 'Vote IQ', 4, -4, None, 1.35, 'ballot', False),
    ('mo', 'Circlehealth', -2, -2, None, 1.0, 'heart', False),
    ('clink', 'Clink', -4, -2, None, 0.85, 'bubble', False),
    ('revee', 'Revee & Mo', 4, -2, 40, 1.4, 'tv', True),
    ('arch', 'Studio', 6, 6, 8, 1.1, 'cottage', False),
]
GLYPH = {
    'robot': '<rect x="5" y="9" width="14" height="9" rx="2"/><path d="M12 9V5m0 0h.01"/><path d="M9 13.5h.01M15 13.5h.01" stroke-width="2.6"/>',
    'scanner': '<circle cx="12" cy="12" r="8"/><path d="M12 12l4.2-4.2"/><path d="M12 12h.01" stroke-width="2.6"/>',
    'servers': '<ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6"/><path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6"/>',
    'connector': '<path d="M10.5 13.5a3.5 3.5 0 005 0l3-3a3.5 3.5 0 00-5-5l-1.1 1.1"/><path d="M13.5 10.5a3.5 3.5 0 00-5 0l-3 3a3.5 3.5 0 005 5l1.1-1.1"/>',
    'tv': '<rect x="3" y="6" width="18" height="11" rx="1.5"/><path d="M9 21h6"/>',
    'heart': '<path d="M12 20s-7-4.4-7-9.8A3.9 3.9 0 0112 7.6a3.9 3.9 0 017 2.6c0 5.4-7 9.8-7 9.8z"/>',
    'bubble': '<path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H9.5L4.5 20 4 6z"/>',
    'ballot': '<rect x="4" y="11" width="16" height="9" rx="1.5"/><path d="M8 11l1-5.5 6.5 1.2-.8 4.3"/>',
    'circles': '<circle cx="12" cy="8" r="3.1"/><circle cx="8" cy="15.5" r="3.1"/><circle cx="16" cy="15.5" r="3.1"/>',
    'docs': '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12.5h5M10 16h5"/>',
    'cottage': '<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
}


def quad(gx, gy):
    if gx > 0 and gy > 0: return 'q1'
    if gx < 0 and gy > 0: return 'q2'
    if gx < 0 and gy < 0: return 'q3'
    return 'q4'


def mix(h, t, k):
    a = [int(h[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(t[i:i + 2], 16) for i in (1, 3, 5)]
    return '#' + ''.join(f'{round(x + (y - x) * k):02x}' for x, y in zip(a, b))


# iso projection: back of the city (high gx+gy) sits at the top
CX, CY, A, B = 604, 222, 38, 16.5
PHI = math.radians(30)
def iso(gx, gy):
    # enterprise/complex (q1) runs to the right, toward the headline
    return (CX + A * (gx * math.cos(PHI) + gy * math.sin(PHI)),
            CY - B * (-gx * math.sin(PHI) + gy * math.cos(PHI)))
def pts(*p):
    return ' '.join(f'{x:.1f},{y:.1f}' for x, y in p)


out = []
o = out.append
o(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
o('''<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fcf9f2"/><stop offset="1" stop-color="#f2ebdd"/></linearGradient>
<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1.1" fill="#1b1b1b" opacity=".07"/></pattern>
<radialGradient id="pool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#5b4bde" stop-opacity=".10"/><stop offset="1" stop-color="#5b4bde" stop-opacity="0"/></radialGradient>
<linearGradient id="sea" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfe2ea"/><stop offset="1" stop-color="#cfe2ea" stop-opacity="0"/></linearGradient>
<filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2.4" flood-color="#1b1b1b" flood-opacity=".18"/></filter>
</defs>''')
o(f'<rect width="{W}" height="{H}" fill="url(#bg)"/>')
o(f'<rect width="{W}" height="{H}" fill="url(#dots)"/>')
o(f'<ellipse cx="{CX}" cy="{CY-10}" rx="430" ry="210" fill="url(#pool)"/>')

# ── the coast: the city's west side meets the sea ───────────────────────
o('<path d="M0 0H300C250 70 268 150 218 220S150 330 170 396H0Z" fill="url(#sea)" opacity=".9"/>')
for i, y in enumerate([150, 182, 214]):
    x = 150 + i * 16
    o(f'<path d="M{x} {y}q9 -6 18 0t18 0t18 0" fill="none" stroke="#6f96b0" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>')

# ── ground: four biome tiles, roads, ring road ──────────────────────────
R = 6.5
tiles = {'q1': (0, 0, R, R), 'q2': (-R, 0, 0, R), 'q3': (-R, -R, 0, 0), 'q4': (0, -R, R, 0)}
o('<g>')
for q, (x0, y0, x1, y1) in tiles.items():
    f, s, _ = BIOME[q]
    a, b, c, d = iso(x0, y0), iso(x1, y0), iso(x1, y1), iso(x0, y1)
    o(f'<polygon points="{pts(a,b,c,d)}" fill="{mix(f, "#ffffff", .38)}" stroke="{s}" stroke-opacity=".35" stroke-width="1"/>')
# slab edge (front faces) for a diorama feel
_cs = [iso(-R, -R), iso(R, -R), iso(R, R), iso(-R, R)]
_bi = max(range(4), key=lambda i: _cs[i][1])
fb = _cs[_bi]
fl, fr = sorted([_cs[(_bi + 1) % 4], _cs[(_bi - 1) % 4]])
o(f'<polygon points="{pts(fl, fb, (fb[0], fb[1]+9), (fl[0], fl[1]+9))}" fill="#d9cdb6"/>')
o(f'<polygon points="{pts(fb, fr, (fr[0], fr[1]+9), (fb[0], fb[1]+9))}" fill="#c9bb9f"/>')
# avenues along gx=0 and gy=0
for (p1, p2) in [((0, -R), (0, R)), ((-R, 0), (R, 0))]:
    a, b = iso(*p1), iso(*p2)
    o(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{SAND}" stroke-width="9"/>')
    o(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="#c9bb9f" stroke-width="1" stroke-dasharray="4 5"/>')
rr = 4.9
o(f'<ellipse cx="{CX}" cy="{CY}" rx="{A*rr:.1f}" ry="{B*rr:.1f}" fill="none" stroke="{SAND}" stroke-width="6"/>')
o(f'<ellipse cx="{CX}" cy="{CY}" rx="{A*rr:.1f}" ry="{B*rr:.1f}" fill="none" stroke="#c9bb9f" stroke-width=".8" stroke-dasharray="3 5"/>')
o('</g>')

route = [iso(0, -6.0), iso(0, 0), iso(4, 0), iso(4, 1.15)]
yx, yy = route[0]
d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in route)
o(f'<path d="{d}" fill="none" stroke="#ffffff" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>')
o(f'<path d="{d}" fill="none" stroke="{ACC}" stroke-width="2.2" stroke-dasharray="5 5" stroke-linejoin="round" stroke-linecap="round"/>')
ex, ey = route[-1]
o(f'<circle cx="{ex:.1f}" cy="{ey:.1f}" r="3.2" fill="{ACC}"/>')

# tiny trees scattered on the biomes, off the building cells
import random
random.seed(7)
taken = {(p[2], p[3]) for p in P}
trees = []
for _ in range(70):
    gx, gy = random.uniform(-6.6, 6.6), random.uniform(-6.6, 6.6)
    if abs(gx) < .8 or abs(gy) < .8: continue
    if any(abs(gx - x) < 1.3 and abs(gy - y) < 1.3 for x, y in taken): continue
    if abs(math.hypot(gx, gy) - rr) < .6: continue
    trees.append((gx, gy))

# ── buildings, back to front ────────────────────────────────────────────
items = []
for p in P:
    items.append(('b', p))
for t in trees:
    items.append(('t', t))
key = lambda it: (it[1][2] + it[1][3]) if it[0] == 'b' else (it[1][0] + it[1][1])
items.sort(key=key, reverse=True)

tops = {}
for kind, d in items:
    if kind == 't':
        x, y = iso(*d)
        q = quad(*d)
        o(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="4" ry="2" fill="#1b1b1b" opacity=".08"/>')
        o(f'<circle cx="{x:.1f}" cy="{y-5:.1f}" r="4.2" fill="{BIOME[q][1]}" opacity=".85"/>')
        continue
    pid, label, gx, gy, h, sc, glyph, feat = d
    q = quad(gx, gy)
    f, s, _ = BIOME[q]
    hgt = (h if h else 12 + sc * 8) * 1.62
    hs = 0.34 * sc
    x, y = iso(gx, gy)
    C = [iso(gx + a, gy + b) for a, b in [(-hs, -hs), (hs, -hs), (hs, hs), (-hs, hs)]]
    bi = max(range(4), key=lambda i: C[i][1])
    n1, n2 = C[(bi + 1) % 4], C[(bi - 1) % 4]
    Bc = C[bi]
    Lc, Rc = (n1, n2) if n1[0] < n2[0] else (n2, n1)
    up = lambda p, z=hgt: (p[0], p[1] - z)
    Lf = [Lc, Bc, up(Bc), up(Lc)]
    Rf = [Bc, Rc, up(Rc), up(Bc)]
    Top = [up(c) for c in C]
    o(f'<polygon points="{pts(*[(c[0]+5, c[1]+3) for c in C])}" fill="#1b1b1b" opacity=".10"/>')
    o(f'<polygon points="{pts(*Lf)}" fill="{mix(f, "#ffffff", .62)}"/>')
    o(f'<polygon points="{pts(*Rf)}" fill="{mix(s, "#ffffff", .30)}"/>')
    lerp = lambda p, q, t: (p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t)
    z = 8
    while z < hgt - 6:
        for (pa, pb, col, op) in [(Lc, Bc, s, .45), (Bc, Rc, '#ffffff', .55)]:
            a1, a2 = lerp(pa, pb, .14), lerp(pa, pb, .86)
            o(f'<path d="M{a1[0]:.1f} {a1[1]-z:.1f}L{a2[0]:.1f} {a2[1]-z:.1f}" stroke="{col}" stroke-width="1.4" opacity="{op}"/>')
        z += 11
    o(f'<polygon points="{pts(*Top)}" fill="{mix(f, "#ffffff", .80) if not feat else "#fff6dc"}"/>')
    for poly in (Lf, Rf, Top):
        o(f'<polygon points="{pts(*poly)}" fill="none" stroke="{INK}" stroke-opacity=".28" stroke-width=".8"/>')
    T = min(c[1] for c in Top)
    if pid == 'arch':  # Studio: a pitched roof, not a tower
        cx_, cy_ = up((x, y))
        o(f'<polygon points="{pts(up(Lc), (cx_, cy_ - 16), up(Rc), up(Bc))}" fill="#c69e64" stroke="{INK}" stroke-opacity=".28" stroke-width=".8"/>')
        T = cy_ - 16
    tops[pid] = (x, T, f, s, glyph, feat, label)

# ── pins (2D-map language): every building wears one ────────────────────
def glyph(g, x, y, size, color, sw=1.8):
    k = size / 24
    return (f'<g transform="translate({x - size/2:.1f} {y - size/2:.1f}) scale({k:.3f})" fill="none" '
            f'stroke="{color}" stroke-width="{sw / k * k * 1.0:.2f}" stroke-linecap="round" stroke-linejoin="round">{GLYPH[g]}</g>')

pins = sorted(tops.items(), key=lambda kv: -kv[1][1])
for pid, (x, ty, f, s, g, feat, label) in pins:
    if feat:
        continue
    r = 10.5
    cy = ty - 16
    o(f'<line x1="{x:.1f}" y1="{ty:.1f}" x2="{x:.1f}" y2="{cy+r:.1f}" stroke="{INK}" stroke-opacity=".45" stroke-width="1.2"/>')
    o(f'<circle cx="{x:.1f}" cy="{cy:.1f}" r="{r}" fill="#ffffff" stroke="{s}" stroke-width="1.8" filter="url(#sh)"/>')
    o(glyph(g, x, cy, 13.5, s, 2.0))

for pid in ['revee', 'snaplogic', 'paas']:
    x, ty, f, s, g, feat, label = tops[pid]
    big = pid == 'paas'
    r = 17 if big else 14
    cy = ty - (30 if big else 24)
    o(f'<line x1="{x:.1f}" y1="{ty:.1f}" x2="{x:.1f}" y2="{cy+r:.1f}" stroke="{INK}" stroke-opacity=".6" stroke-width="1.4"/>')
    o(f'<circle cx="{x:.1f}" cy="{cy:.1f}" r="{r+7}" fill="{GOLD}" opacity=".16"/>')
    o(f'<circle cx="{x:.1f}" cy="{cy:.1f}" r="{r}" fill="#ffffff" stroke="{INK}" stroke-width="2" filter="url(#sh)"/>')
    o(glyph(g, x, cy, r * 1.15, INK, 2.0))
    # gold star badge
    sx, sy = x + r * .78, cy - r * .78
    star = []
    for i in range(10):
        rad = 6.2 if i % 2 == 0 else 2.7
        a = -math.pi / 2 + i * math.pi / 5
        star.append((sx + rad * math.cos(a), sy + rad * math.sin(a)))
    o(f'<polygon points="{pts(*star)}" fill="{GOLD}" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round"/>')
    # name label chip to the right
    lw = 9 + len(label) * 7.4
    if big:
        lw += 40
    left = pid == 'snaplogic'
    lx, ly = (x - lw / 2, cy - r - 30) if left else (x + r + 8, cy - 10)
    o(f'<rect x="{lx:.1f}" y="{ly:.1f}" width="{lw:.1f}" height="20" rx="10" fill="{INK}" filter="url(#sh)"/>')
    o(f'<text x="{lx+9:.1f}" y="{ly+14:.1f}" font-family="Inter" font-weight="700" font-size="12" fill="#ffffff">{label.replace("&", "&amp;")}</text>')
    if big:
        bx = lx + 9 + len(label) * 7.4 + 6
        o(f'<rect x="{bx:.1f}" y="{ly+4:.1f}" width="32" height="12" rx="6" fill="{GOLD}"/>')
        o(f'<text x="{bx+16:.1f}" y="{ly+13:.1f}" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="8.5" fill="{INK}">NEW</text>')

# ── "you are here" + dashed route to the newest building ────────────────
yx, yy = route[0]
o(f'<circle cx="{yx:.1f}" cy="{yy:.1f}" r="11" fill="{ACC}" opacity=".18"/>')
o(f'<circle cx="{yx:.1f}" cy="{yy:.1f}" r="5.5" fill="{ACC}" stroke="#ffffff" stroke-width="2"/>')
o(f'<text x="{yx-14:.1f}" y="{yy+4:.1f}" text-anchor="end" font-family="JetBrains Mono" font-weight="600" font-size="10.5" letter-spacing=".08em" fill="{ACC}">YOU ARE HERE</text>')

# ── map cartouche, top-left (clear of the avatar, which sits bottom-left) ─
o(f'<g transform="translate(40 34)">')
o(f'<text font-family="JetBrains Mono" font-weight="600" font-size="11" letter-spacing=".14em" fill="{SOFT}">CITY MAP · SHEET 01</text>')
o(f'<text y="22" font-family="JetBrains Mono" font-weight="500" font-size="10.5" fill="{SOFT}" opacity=".8">13 PROJECTS · 1 BUILDING EACH</text>')
# compass
o(f'<g transform="translate(16 62)"><circle r="14" fill="none" stroke="{INK}" stroke-opacity=".35"/>'
  f'<path d="M0 -11L4 2H-4Z" fill="{INK}"/><path d="M0 11L4 -2H-4Z" fill="none" stroke="{INK}" stroke-opacity=".5"/>'
  f'<text y="-18" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="10" fill="{INK}">N</text></g>')
o('</g>')

# ── right: the words ─────────────────────────────────────────────────────
TX = 992
o(f'<g transform="translate({TX} 0)">')
o(f'<text y="92" font-family="JetBrains Mono" font-weight="600" font-size="13" letter-spacing=".16em" fill="{ACC}">PRODUCT DESIGNER · ARCHITECT</text>')
o(f'<text y="146" font-family="Inter" font-weight="800" font-size="44" letter-spacing="-.025em" fill="{INK}">Every building</text>')
o(f'<text y="196" font-family="Inter" font-weight="800" font-size="44" letter-spacing="-.025em" fill="{INK}">is a <tspan fill="{ACC}">project.</tspan></text>')
o(f'<text y="234" font-family="Inter" font-weight="500" font-size="17" fill="{SOFT}">Agentic AI · Enterprise SaaS · Smart TV &amp; Home</text>')
# CTA chip
o(f'<g transform="translate(0 262)" filter="url(#sh)"><rect width="262" height="42" rx="21" fill="{INK}"/></g>')
o(f'<g transform="translate(0 262)">'
  f'<circle cx="21" cy="21" r="5" fill="{ACC}"/><circle cx="21" cy="21" r="9" fill="none" stroke="{ACC}" stroke-opacity=".5"/>'
  f'<text x="38" y="26.5" font-family="Inter" font-weight="700" font-size="15" fill="#ffffff">mittal.design</text>'
  f'<text x="143" y="26.5" font-family="Inter" font-weight="500" font-size="15" fill="#ffffff" opacity=".72">Walk the city →</text></g>')
o('</g>')

# legend: the four quadrants, like the site's HUD legend
o(f'<g transform="translate({TX} 340)">')
lx = 0
for q in ['q1', 'q2', 'q4', 'q3']:
    f, s, lab = BIOME[q]
    o(f'<rect x="{lx}" y="0" width="11" height="11" rx="3" fill="{f}" stroke="{s}"/>')
    o(f'<text x="{lx+17}" y="9.5" font-family="Inter" font-weight="500" font-size="11" fill="{SOFT}">{lab}</text>')
    lx += 17 + len(lab) * 6.1 + 13
o('</g>')

o('</svg>')
open(sys.argv[1], 'w').write('\n'.join(out))
