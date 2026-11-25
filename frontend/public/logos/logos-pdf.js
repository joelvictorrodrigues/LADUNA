/* Briefing de logo — gera o PDF no navegador, sem biblioteca externa.
   LOGOS.pdf({ marca, contato, data, rows: [[rótulo, valor]], nota, cores: ['#…'], img: { bytes, w, h } (JPEG, opcional) }) devolve um Uint8Array.
   Usa Helvetica padrão do PDF (codificação WinAnsi, cobre os acentos do português). */
(() => {
  const W = 595, H = 842, M = 44, COL = 150;
  const MAP = { '‘': 145, '’': 146, '“': 147, '”': 148, '–': 150, '—': 151, '…': 133, '•': 149 };
  const enc = s => { let o = ''; for (const ch of String(s)) { let c = ch.charCodeAt(0); if (MAP[ch]) c = MAP[ch]; else if (c > 255 || c < 32) c = 63; const x = String.fromCharCode(c); o += x === '(' || x === ')' || x === '\\' ? '\\' + x : x; } return o; };
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255].map(v => v.toFixed(3)).join(' '); };
  const light = h => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) > 150; };
  let cv;
  const width = (s, size, bold) => { cv = cv || document.createElement('canvas').getContext('2d'); cv.font = `${bold ? 'bold ' : ''}${size}px Helvetica, Arial, sans-serif`; return cv.measureText(s).width * 1.03; };
  function wrap(s, size, bold, max) {
    const out = [];
    for (const para of String(s).split(/\n/)) {
      let line = '';
      for (let w of para.split(/\s+/).filter(Boolean)) {
        while (width(w, size, bold) > max) { let n = w.length; while (n > 1 && width(w.slice(0, n), size, bold) > max) n--; if (line) { out.push(line); line = ''; } out.push(w.slice(0, n)); w = w.slice(n); }
        const t = line ? line + ' ' + w : w;
        if (width(t, size, bold) > max) { out.push(line); line = w; } else line = t;
      }
      out.push(line);
    }
    return out;
  }

  function pdf(d) {
    const pages = []; let ops = [], y = 0;
    const dark = (d.cores && d.cores[0] && !light(d.cores[0])) ? d.cores[0] : '#523C59';
    const text = (s, x, yy, size, bold, color) => ops.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${rgb(color)} rg ${x.toFixed(1)} ${yy.toFixed(1)} Td (${enc(s)}) Tj ET`);
    const rect = (x, yy, w, h, color) => ops.push(`${rgb(color)} rg ${x.toFixed(1)} ${yy.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)} re f`);
    const foot = () => { rect(M, 40, W - 2 * M, .6, '#CFCFCF'); text('LADUNA Studio · Posicionamento | Identidade | Estratégia', M, 26, 8, true, '#644370'); const r = 'ladunastudio.com.br/logos'; text(r, W - M - width(r, 8), 26, 8, false, '#777777'); };
    const page = first => {
      if (ops.length) { foot(); pages.push(ops.join('\n')); } ops = []; rect(0, 0, W, H, '#F4F4F4');
      if (!first) { y = H - M - 10; return; }
      const lines = wrap(d.marca, 34, true, W - 2 * M - 130).slice(0, 3), bandH = 128 + lines.length * 38;
      rect(0, H - bandH, W, bandH, dark);
      text('BRIEFING DE LOGO', M, H - 52, 9, true, '#FFFFFF');
      lines.forEach((l, i) => text(l, M, H - 100 - i * 38, 34, true, '#FFFFFF'));
      text(d.contato, M, H - bandH + 36, 11, false, '#FFFFFF'); text(d.data, M, H - bandH + 20, 9, false, '#DDDDDD');
      (d.cores || []).slice(0, 4).forEach((c, i) => { rect(W - M - 104 + i * 27 - 1, H - 71, 24, 24, '#FFFFFF'); rect(W - M - 104 + i * 27, H - 70, 22, 22, c); });
      y = H - bandH - 34;
    };
    page(true);
    if (d.img) { const iw = W - 2 * M, ih = iw * d.img.h / d.img.w; ops.push(`q ${iw} 0 0 ${ih.toFixed(1)} ${M} ${(y - ih + 16).toFixed(1)} cm /Im1 Do Q`); y -= ih + 14; }
    d.rows.forEach(([k, v]) => {
      const kl = wrap(k.toUpperCase(), 8, true, COL - 14), vl = wrap(v, 11, false, W - 2 * M - COL), h = Math.max(kl.length * 11, vl.length * 15);
      if (y - h < 70) page(false);
      kl.forEach((l, i) => text(l, M, y - i * 11, 8, true, '#644370'));
      vl.forEach((l, i) => text(l, M + COL, y - 1 - i * 15, 11, false, '#3F3F3F'));
      y -= h + 6; rect(M, y, W - 2 * M, .6, '#DCDCDC'); y -= 18;
    });
    if (d.nota) {
      const nl = wrap(d.nota, 11, true, W - 2 * M - 32), h = nl.length * 15 + 22;
      if (y - h < 70) page(false);
      rect(M, y - h + 12, W - 2 * M, h, '#EFE9F1'); rect(M, y - h + 12, 4, h, '#644370');
      nl.forEach((l, i) => text(l, M + 18, y - 6 - i * 15, 11, true, '#523C59'));
    }
    foot(); pages.push(ops.join('\n'));

    const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
    const kids = []; let xo = '';
    if (d.img) { let bin = ''; for (let i = 0; i < d.img.bytes.length; i += 8192) bin += String.fromCharCode.apply(null, d.img.bytes.subarray(i, i + 8192)); objs.push(`<< /Type /XObject /Subtype /Image /Width ${d.img.w} /Height ${d.img.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bin.length} >>\nstream\n${bin}\nendstream`); xo = ` /XObject << /Im1 ${objs.length} 0 R >>`; }
    pages.forEach(c => { const n = objs.length + 1; kids.push(`${n} 0 R`); objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>${xo} >> /Contents ${n + 1} 0 R >>`); objs.push(`<< /Length ${c.length} >>\nstream\n${c}\nendstream`); });
    objs[1] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`;
    let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'; const off = [];
    objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const xref = out.length;
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + off.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('') + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    const bytes = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
    return bytes;
  }
  window.LOGOS.pdf = pdf;
})();
