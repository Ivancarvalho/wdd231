"""Gera as imagens placeholder das empresas e o favicon da Câmara de Comércio.

Uso (a partir de qualquer pasta):
    python gerar_placeholders.py

Lê os nomes e os caminhos de imagem de dados/membros.json e salva os arquivos
em imagens/ (incluindo imagens/favicon.ico).
Requer: pip install pillow
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent
JSON_PATH = BASE / "dados" / "membros.json"
IMG_DIR = BASE / "imagens"

LARGURA, ALTURA = 300, 160
ESCALA = 3  # desenha em alta resolução e reduz, para bordas e texto suaves

# Mesmas cores do site; cada empresa usa uma dupla (topo, base) do degradê
PALETA = [
    ("#2d6a4f", "#1b4332"),
    ("#b45309", "#7c3a06"),
    ("#40916c", "#1b4332"),
    ("#52616b", "#2f3a42"),
    ("#2d6a4f", "#143328"),
    ("#9a3412", "#6b230b"),
    ("#264653", "#14272f"),
]

FONTES_NEGRITO = [
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def carregar_fonte(tamanho):
    for caminho in FONTES_NEGRITO:
        try:
            return ImageFont.truetype(caminho, tamanho)
        except OSError:
            continue
    return ImageFont.load_default(size=tamanho)


def hex_rgb(cor):
    cor = cor.lstrip("#")
    return tuple(int(cor[i:i + 2], 16) for i in (0, 2, 4))


def degrade_vertical(largura, altura, topo, base):
    img = Image.new("RGB", (largura, altura))
    draw = ImageDraw.Draw(img)
    c1, c2 = hex_rgb(topo), hex_rgb(base)
    for y in range(altura):
        t = y / (altura - 1)
        draw.line([(0, y), (largura, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(c1, c2)))
    return img


def quebrar_linhas(draw, texto, fonte, largura_max):
    linhas, atual = [], ""
    for palavra in texto.split():
        teste = f"{atual} {palavra}".strip()
        if draw.textlength(teste, font=fonte) <= largura_max or not atual:
            atual = teste
        else:
            linhas.append(atual)
            atual = palavra
    if atual:
        linhas.append(atual)
    return linhas


def iniciais(nome):
    palavras = [p for p in nome.replace("&", " ").split() if p[0].isalnum() and len(p) > 2]
    return "".join(p[0] for p in palavras[:2]).upper() or nome[0].upper()


def gerar_empresa(nome, indice, destino):
    w, h = LARGURA * ESCALA, ALTURA * ESCALA
    topo, base = PALETA[indice % len(PALETA)]
    img = degrade_vertical(w, h, topo, base)
    draw = ImageDraw.Draw(img, "RGBA")

    # círculos decorativos discretos ao fundo
    draw.ellipse([w * 0.70, -h * 0.45, w * 1.15, h * 0.55], fill=(255, 255, 255, 18))
    draw.ellipse([-w * 0.15, h * 0.60, w * 0.30, h * 1.35], fill=(255, 255, 255, 14))

    # emblema com as iniciais
    raio = 30 * ESCALA
    cx, cy = w // 2, 48 * ESCALA
    draw.ellipse([cx - raio, cy - raio, cx + raio, cy + raio], fill=(255, 255, 255, 235))
    fonte_ini = carregar_fonte(26 * ESCALA)
    draw.text((cx, cy), iniciais(nome), font=fonte_ini, fill=hex_rgb(base), anchor="mm")

    # nome da empresa (até 2 linhas, reduzindo a fonte se necessário)
    margem = 20 * ESCALA
    for tamanho in (17, 15, 13):
        fonte = carregar_fonte(tamanho * ESCALA)
        linhas = quebrar_linhas(draw, nome, fonte, w - 2 * margem)
        if len(linhas) <= 2:
            break
    altura_linha = int(tamanho * ESCALA * 1.25)
    y = 108 * ESCALA + (0 if len(linhas) == 2 else altura_linha // 2)
    for linha in linhas:
        draw.text((w // 2, y), linha, font=fonte, fill=(255, 255, 255), anchor="mm")
        y += altura_linha

    img = img.resize((LARGURA, ALTURA), Image.LANCZOS)
    img.save(destino, quality=88, method=6) if destino.suffix == ".webp" else img.save(destino)


def gerar_favicon(destino):
    tam = 256
    img = Image.new("RGBA", (tam, tam), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, tam - 1, tam - 1], radius=48, fill=hex_rgb("#1b4332"))
    draw.ellipse([40, 40, tam - 40, tam - 40], fill=hex_rgb("#b45309"))
    draw.text((tam // 2, tam // 2 + 4), "C", font=carregar_fonte(120), fill="white", anchor="mm")
    img.save(destino, sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])


def main():
    IMG_DIR.mkdir(exist_ok=True)
    membros = json.loads(JSON_PATH.read_text(encoding="utf-8"))

    for i, membro in enumerate(membros):
        destino = BASE / membro["imagem"]
        destino.parent.mkdir(parents=True, exist_ok=True)
        gerar_empresa(membro["nome"], i, destino)
        print(f"OK  {destino.relative_to(BASE)}  <- {membro['nome']}")

    gerar_favicon(IMG_DIR / "favicon.ico")
    print("OK  imagens/favicon.ico")


if __name__ == "__main__":
    main()
