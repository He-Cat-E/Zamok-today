/** Build reading-order text lines from Vision fullTextAnnotation (word positions). */
export function linesFromFullTextAnnotation(annotation) {
  if (!annotation?.pages?.length) return [];

  const words = [];
  for (const page of annotation.pages) {
    for (const block of page.blocks || []) {
      for (const paragraph of block.paragraphs || []) {
        for (const word of paragraph.words || []) {
          const text = (word.symbols || []).map((s) => s.text).join("");
          if (!text.trim()) continue;
          const verts = word.boundingBox?.vertices || [];
          if (!verts.length) continue;
          const y = verts.reduce((s, p) => s + (p.y || 0), 0) / verts.length;
          const x = verts.reduce((s, p) => s + (p.x || 0), 0) / verts.length;
          words.push({ text, y, x });
        }
      }
    }
  }

  if (!words.length) return [];

  words.sort((a, b) => a.y - b.y || a.x - b.x);

  const lineGroups = [];
  let group = [];
  let refY = null;
  const yThreshold = 14;

  for (const w of words) {
    if (refY !== null && Math.abs(w.y - refY) > yThreshold) {
      if (group.length) lineGroups.push(group);
      group = [];
    }
    group.push(w);
    refY = w.y;
  }
  if (group.length) lineGroups.push(group);

  return lineGroups
    .map((g) =>
      g
        .sort((a, b) => a.x - b.x)
        .map((w) => w.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);
}
