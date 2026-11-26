"""Separa el logo (assets/logo.png) en capas transparentes para animarlas:
iglesia (oro, rellena detrás de la familia), familia (crema) y libro (crema + lomo rojo).
Uso: python3 logo_capas.py"""
import numpy as np
from PIL import Image, ImageFilter

img = Image.open("assets/logo.png").convert("RGB")
src = np.array(img).astype(float) / 255
smooth = np.array(img.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(0.8))).astype(float) / 255
H, W, _ = src.shape
cols = {"bg": (104, 27, 17), "oro": (183, 137, 52), "crema": (243, 230, 211), "lomo": (147, 49, 26)}
M = np.array([list(np.array(c) / 255) + [1] for c in cols.values()]).T
P = np.concatenate([smooth.reshape(-1, 3), np.ones((H * W, 1))], 1)
A = np.linalg.lstsq(M, P.T, rcond=None)[0].T.clip(0, 1)
A = (A / A.sum(1, keepdims=True)).reshape(H, W, 4)

def sstep(a, lo=0.2, hi=0.8):
    x = ((a - lo) / (hi - lo)).clip(0, 1)
    return x * x * (3 - 2 * x)

a_oro, a_crema, a_lomo = sstep(A[..., 1]), sstep(A[..., 2]), sstep(A[..., 3], 0.35, 0.85)
yy = np.arange(H)[:, None] * np.ones((1, W))

# Corte familia / libro: primera fila (bajo la familia) donde la crema ocupa > 300 px de ancho
rows = (a_crema > 0.5).sum(1)
gap = 740 + int(np.argmin(rows[740:840]))           # fila entre los pies y el libro
cut = gap
fam = np.where(yy < cut, a_crema, 0)
lib_c = np.where(yy >= cut, a_crema, 0)
# El lomo rojo sólo cuenta dentro del libro
a_lomo = np.where(yy >= cut, a_lomo, 0)

# Iglesia: rellena los huecos que tapa la familia (entre el oro más a la izquierda y más a la derecha de cada fila)
church = a_oro.copy()
g = a_oro > 0.5
grows = np.where(g.sum(1) > 20)[0]
# Puerta (arco): el hueco más ancho entre tramos de oro, medido donde la familia no tapa (fila media de la iglesia)
ymid = grows[int(len(grows) * 0.72)]
xs = np.where(g[ymid])[0]
gaps = np.diff(xs); k = int(np.argmax(gaps))
doorL, doorR = xs[k] + 1, xs[k + 1] - 1
doorTop = next(y for y in grows if (~g[y, doorL + 3:doorR - 3]).all())
for y in grows:
    xs = np.where(g[y])[0]
    x0, x1 = xs.min(), xs.max()
    seg = np.zeros(W, bool); seg[x0:x1 + 1] = True
    if y >= doorTop:
        seg[doorL - 1:doorR + 2] = False
    church[y, seg] = (a_oro[y, seg] + a_crema[y, seg]).clip(0, 1)
print("puerta", doorL, doorR, doorTop)
# cierre morfológico: borra las costuras finas que dejan los bordes de las figuras
ci = Image.fromarray((church * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
church = np.maximum(church, np.array(ci).astype(float) / 255)

def save(name, rgb, alpha):
    out = np.zeros((H, W, 4)); out[..., :3] = rgb; out[..., 3] = alpha.clip(0, 1)
    Image.fromarray((out * 255).round().astype(np.uint8), "RGBA").save(f"assets/{name}.png")

C = {k: np.array(v) / 255 for k, v in cols.items()}
save("iglesia", C["oro"], church)
save("familia", C["crema"], fam)
al = (lib_c + a_lomo).clip(0, 1)
rgb = (lib_c[..., None] * C["crema"] + a_lomo[..., None] * C["lomo"]) / np.maximum(lib_c + a_lomo, 1e-6)[..., None]
save("libro", rgb, al)

bg = np.ones((H, W, 3)) * C["bg"]
for n in ("iglesia", "familia", "libro"):
    L = np.array(Image.open(f"assets/{n}.png")).astype(float) / 255
    bg = bg * (1 - L[..., 3:]) + L[..., :3] * L[..., 3:]
print(f"corte en y={cut}; error medio de recomposición: {np.abs(bg - src).mean() * 255:.2f}/255")
Image.fromarray((bg * 255).round().astype(np.uint8)).save("build/recompuesto.png")
