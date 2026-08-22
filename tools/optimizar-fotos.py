#!/usr/bin/env python3
"""
Deja las fotos de img/ listas para la web.

Una foto sacada del celular pesa entre 3 y 5 MB y viene de 3000 px o más.
Puesta así en la página, la clienta que entra con datos móviles se come esa
descarga para ver una tarjeta de 300 px. Este script la achica antes de que
llegue al sitio.

Qué le hace a cada foto:

  1. Endereza la que venga rotada. El celular no gira los píxeles: guarda la
     rotación en un dato aparte (EXIF) que el navegador a veces ignora, y la
     foto sale acostada.
  2. La reduce si su lado mayor pasa de MAX_LADO.
  3. La vuelve a guardar comprimida y sin los datos del celular (modelo,
     fecha, y la ubicación GPS de dónde se tomó).

Solo reescribe la foto si el resultado queda más liviano, o si hubo que
girarla o achicarla. Las que ya están bien no se tocan.

Uso:
    python3 tools/optimizar-fotos.py            # optimiza
    python3 tools/optimizar-fotos.py --check    # solo avisa, no escribe
"""

import sys
from pathlib import Path

from PIL import Image, ImageOps

CARPETA = Path("img")

# Lado mayor en píxeles. La tarjeta más grande de la página no llega a 600 px,
# así que 1400 deja margen de sobra para pantallas de alta densidad.
MAX_LADO = 1400

CALIDAD = 82

# Recomprimir una foto que ya está bien solo le quita calidad para ahorrar
# unos pocos KB. Por eso solo se recomprime cuando la ganancia vale la pena:
# tiene que bajar al menos esta proporción y estos KB. Enderezar o achicar sí
# se hace siempre, porque ahí el archivo viejo está mal.
GANANCIA_MINIMA = 0.25
KB_MINIMOS = 60

# Imágenes que no son fotos de producto y no hay que tocar.
# La guía de tallas es una tabla de números: achicarla la vuelve ilegible, y
# además su tamaño está escrito a mano en el index.html.
EXCLUIDAS = {
    "guia-tallas.jpeg",
    "logo.jpeg",
    "favicon.png",
    "apple-touch-icon.png",
}

EXTENSIONES = {".jpg", ".jpeg", ".png", ".webp"}


def kb(n_bytes):
    return n_bytes / 1024


def optimizar(ruta, escribir=True):
    """Devuelve (cambio, motivo, kb_antes, kb_despues)."""
    antes = ruta.stat().st_size

    with Image.open(ruta) as im:
        formato = im.format
        ancho, alto = im.size

        # exif_transpose gira los píxeles según el dato del celular y quita ese
        # dato, para que la foto se vea igual en todos lados.
        enderezada = ImageOps.exif_transpose(im)
        giro = enderezada.size != im.size

        redujo = max(enderezada.size) > MAX_LADO
        if redujo:
            enderezada.thumbnail((MAX_LADO, MAX_LADO), Image.LANCZOS)

        destino = ruta.with_suffix(ruta.suffix)
        opciones = {"optimize": True}
        if formato == "JPEG":
            opciones.update(quality=CALIDAD, progressive=True)
            if enderezada.mode not in ("RGB", "L"):
                enderezada = enderezada.convert("RGB")

        import io

        buffer = io.BytesIO()
        enderezada.save(buffer, format=formato, **opciones)
        despues = buffer.tell()

        # Enderezar o achicar se hace siempre: ahí el archivo viejo está mal.
        # Recomprimir solo si la ganancia justifica la pérdida de calidad.
        ahorrado = antes - despues
        gano_bastante = (
            ahorrado > 0
            and ahorrado / antes >= GANANCIA_MINIMA
            and kb(ahorrado) >= KB_MINIMOS
        )
        if not (giro or redujo or gano_bastante):
            return (False, "ya estaba bien", kb(antes), kb(antes))

        motivos = []
        if giro:
            motivos.append("enderezada")
        if redujo:
            motivos.append(f"{ancho}x{alto} -> {enderezada.width}x{enderezada.height}")
        if gano_bastante:
            motivos.append("recomprimida")

        if escribir:
            destino.write_bytes(buffer.getvalue())

        return (True, ", ".join(motivos), kb(antes), kb(despues))


def main():
    solo_revisar = "--check" in sys.argv

    if not CARPETA.is_dir():
        print(f"No existe la carpeta {CARPETA}/")
        return 1

    fotos = sorted(
        p for p in CARPETA.iterdir()
        if p.is_file() and p.suffix.lower() in EXTENSIONES and p.name not in EXCLUIDAS
    )

    cambiadas, ahorro = [], 0.0
    for foto in fotos:
        try:
            cambio, motivo, antes, despues = optimizar(foto, escribir=not solo_revisar)
        except Exception as e:  # una foto corrupta no debe tumbar el proceso
            print(f"  !  {foto.name}: no se pudo procesar ({e})")
            continue
        if cambio:
            cambiadas.append(foto.name)
            ahorro += antes - despues
            print(f"  ~  {foto.name}: {antes:.0f} KB -> {despues:.0f} KB  ({motivo})")

    print()
    print(f"revisadas: {len(fotos)} | ajustadas: {len(cambiadas)} | ahorro: {ahorro/1024:.2f} MB")

    if solo_revisar and cambiadas:
        print("\nHay fotos sin optimizar. Corre: python3 tools/optimizar-fotos.py")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
