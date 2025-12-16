// src/pages/dashboard/certificados/canvasRenderers.js

/* =========================================================
   Canvas Certificate Renderer
   - Soporta premiación y participación.
   - Dibuja "Etiqueta: Valor" calculando el ancho real
     de la etiqueta y dejando un GAP fijo (sin solaparse).
   - Ajustado para alinear exactamente como el mockup.
   ========================================================= */

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function setFont(ctx, sizePx, weight = 600) {
  // Pila de fuentes usada en tu front
  ctx.font = `${weight} ${sizePx}px "Comfortaa", "Poppins", "Inter", Arial, sans-serif`;
  ctx.fillStyle = "#23263D";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
}

/** Dibuja un par "Etiqueta: Valor" sin superposición. */
function drawLabeledValue(
  ctx,
  x,
  y,
  label,
  value,
  {
    labelSize = 22,
    valueSize = 24,
    labelWeight = 800,
    valueWeight = 600,
    gap = 12,
    labelColor = "#23263D",
    valueColor = "#23263D",
  } = {}
) {
  // Etiqueta (negrita)
  setFont(ctx, labelSize, labelWeight);
  ctx.fillStyle = labelColor;
  const labelText = `${label}:`;
  ctx.fillText(labelText, x, y);

  // Ancho real de la etiqueta para colocar el valor a la derecha + gap
  const w = ctx.measureText(labelText).width;
  const xValue = x + w + gap;

  // Valor
  setFont(ctx, valueSize, valueWeight);
  ctx.fillStyle = valueColor;
  ctx.fillText(value ?? "-", xValue, y);
}

/** Dibuja un texto centrado con ajuste para que entre en maxWidth. */
function drawCenteredFitText(
  ctx,
  text,
  cx,
  y,
  { baseSize = 56, minSize = 34, weight = 700, maxWidth, color = "#23263D" } = {}
) {
  let size = baseSize;
  setFont(ctx, size, weight);
  ctx.textAlign = "center";
  ctx.fillStyle = color;

  while (size > minSize && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    setFont(ctx, size, weight);
  }
  ctx.fillText(text, cx, y);
  ctx.textAlign = "left"; // Restablecer
}

/** Posiciones proporcionales para la plantilla vertical de tu mockup. */
function computeLayout(imgW, imgH) {
  // Centro horizontal
  const cx = imgW * 0.5;

  // --- Ajustes finos para calcar el mockup ---
  // El nombre debe quedar justo encima de la línea dorada
  const NOMBRE_OFFSET_Y = -12; // si lo quieres aún más pegado: -10

  // Puntos base (proporcionales) bajo "CERTIFICADO"
  const yNameBase = imgH * 0.420;
  const yName = yNameBase + NOMBRE_OFFSET_Y;
  const maxNameW = imgW * 0.70;

  // Filas de datos
  const yRow1 = imgH * 0.440; // Premio / Area
  const yRow2 = imgH * 0.49;  // Nivel
  const yRow3 = imgH * 0.555; // Colegio/ UE

  // Columnas
  const xLeft  = imgW * 0.095; // margen izquierdo
  const xRight = imgW * 0.56;  // columna derecha (Area)

  return { cx, yName, maxNameW, yRow1, yRow2, yRow3, xLeft, xRight };
}

/** Render principal */
export async function buildCertificate(
  row,
  tipo = "premiacion", // "premiacion" | "participacion"
  tplPrem,
  tplPart
) {
  const tpl = tipo === "premiacion" ? tplPrem : tplPart;
  if (!tpl?.url) throw new Error("FALTA_PLANTILLA");

  const img = await loadImage(tpl.url);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Layout
  const { cx, yName, maxNameW, yRow1, yRow2, yRow3, xLeft, xRight } = computeLayout(
    canvas.width,
    canvas.height
  );

  // ------- NOMBRE (centrado) -------
  drawCenteredFitText(ctx, row?.nombre ?? "-", cx, yName, {
    baseSize: 56,
    minSize: 34,
    weight: 700,
    maxWidth: maxNameW,
    color: "#23263D",
  });

  // ------- FILAS -------
  if (tipo === "premiacion") {
    // Fila 1: Premio (izq) — Area (der)
    drawLabeledValue(ctx, xLeft,  yRow1, "Premio", row?.premio ?? "-", { labelSize: 40, valueSize: 40 });
    drawLabeledValue(ctx, xRight, yRow1, "Area",   row?.area   ?? "-", { labelSize: 40, valueSize: 40 });

    // Fila 2: Nivel
    drawLabeledValue(ctx, xLeft, yRow2, "Nivel", row?.nivel ?? "-", { labelSize: 40, valueSize: 40 });

    // Fila 3: Colegio/UE
    drawLabeledValue(ctx, xLeft, yRow3, "Colegio/ UE", row?.colegio ?? "-", { labelSize: 40, valueSize: 40 });
  } else {
    // PARTICIPACIÓN
    drawLabeledValue(ctx, xLeft, yRow1, "Area", row?.area ?? "-", { labelSize: 40, valueSize: 40 });
    drawLabeledValue(ctx, xLeft, yRow2, "Nivel", row?.nivel ?? "-", { labelSize: 40, valueSize: 40 });
    drawLabeledValue(ctx, xLeft, yRow3, "Colegio/ UE", row?.colegio ?? "-", { labelSize: 40, valueSize: 40 });
  }

  // Salida (PNG)
  const blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png", 0.95)
  );
  const safeName = (row?.nombre || "certificado").replace(/\s+/g, "_");
  const area = (row?.area || "").replace(/\s+/g, "_");
  const nivel = (row?.nivel || "").replace(/\s+/g, "_");
  const fileName = `${tipo}-${area}-${nivel}-${safeName}.png`;

  return { blob, fileName };
}

/** Descarga helper */
export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
