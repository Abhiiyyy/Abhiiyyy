import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const assets = new URL('../assets/', import.meta.url);
await mkdir(assets, { recursive: true });
const glyphs = {
  A:['01110','10001','10001','11111','10001','10001','10001'],
  B:['11110','10001','10001','11110','10001','10001','11110'],
  C:['01111','10000','10000','10000','10000','10000','01111'],
  D:['11110','10001','10001','10001','10001','10001','11110'],
  E:['11111','10000','10000','11110','10000','10000','11111'],
  F:['11111','10000','10000','11110','10000','10000','10000'],
  G:['01111','10000','10000','10111','10001','10001','01111'],
  H:['10001','10001','10001','11111','10001','10001','10001'],
  I:['11111','00100','00100','00100','00100','00100','11111'],
  J:['00111','00010','00010','00010','10010','10010','01100'],
  K:['10001','10010','10100','11000','10100','10010','10001'],
  L:['10000','10000','10000','10000','10000','10000','11111'],
  M:['10001','11011','10101','10101','10001','10001','10001'],
  N:['10001','11001','10101','10011','10001','10001','10001'],
  O:['01110','10001','10001','10001','10001','10001','01110'],
  P:['11110','10001','10001','11110','10000','10000','10000'],
  Q:['01110','10001','10001','10001','10101','10010','01101'],
  R:['11110','10001','10001','11110','10100','10010','10001'],
  S:['01111','10000','10000','01110','00001','00001','11110'],
  T:['11111','00100','00100','00100','00100','00100','00100'],
  U:['10001','10001','10001','10001','10001','10001','01110'],
  V:['10001','10001','10001','10001','10001','01010','00100'],
  W:['10001','10001','10001','10101','10101','10101','01010'],
  X:['10001','10001','01010','00100','01010','10001','10001'],
  Y:['10001','10001','01010','00100','00100','00100','00100'],
  Z:['11111','00001','00010','00100','01000','10000','11111'],
  '2':['01110','10001','00001','00010','00100','01000','11111'],
  '1':['00100','01100','00100','00100','00100','00100','01110'],
  '.':['00000','00000','00000','00000','00000','00110','00110'],
  '>':['10000','01000','00100','00010','00100','01000','10000'],
  ' ':['00000','00000','00000','00000','00000','00000','00000'],
};
const palette = { bg:'#10271e', panel:'#153528', border:'#2d6a50', accent:'#7ef0b5', white:'#e9fff3', muted:'#afd0bd' };
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function pixelText(value,x,y,scale,color=palette.white) {
  let d='';
  [...value.toUpperCase()].forEach((letter,index) => {
    const glyph = glyphs[letter];
    if (!glyph) throw new Error(`Missing pixel glyph: ${letter}`);
    glyph.forEach((row,r) => [...row].forEach((bit,c) => {
      if (bit==='1') d += `M${x+(index*6+c)*scale} ${y+r*scale}h${scale}v${scale}h-${scale}z`;
    }));
  });
  return `<path d="${d}" fill="${color}" shape-rendering="crispEdges"/>`;
}
function text(value,x,y,size=20,color=palette.muted,extra='') {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="Courier New, monospace" font-size="${size}" ${extra}>${escape(value)}</text>`;
}
function svg(width,height,title,description,body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${escape(description)}</desc>${body}</svg>\n`;
}
function rack(x,label,mark) {
  return `<g><rect x="${x+5}" y="168" width="96" height="116" fill="#0a1c15"/><rect x="${x}" y="160" width="96" height="116" fill="${palette.panel}" stroke="${palette.accent}" stroke-width="3"/>${[0,1,2].map(i=>`<rect x="${x+12}" y="${174+i*25}" width="72" height="17" fill="${palette.border}"/><rect x="${x+66}" y="${179+i*25}" width="8" height="7" fill="${palette.accent}"/>`).join('')}${pixelText(mark,x+15,249,2,palette.accent)}${text(label,x+48,305,17,palette.white,'text-anchor="middle"')}</g>`;
}
const packet = (positions,begin='0s') => `<rect class="motion" x="0" y="0" width="9" height="9" fill="${palette.accent}"><animateTransform attributeName="transform" type="translate" values="${positions}" dur="8s" begin="${begin}" repeatCount="indefinite" calcMode="discrete"/></rect>`;
let banner = `<style>@media (prefers-reduced-motion:reduce){.motion{display:none}}</style><rect width="1200" height="372" fill="${palette.bg}"/><path d="M0 8H1192V364H8V8" fill="none" stroke="${palette.border}" stroke-width="3"/><path d="M0 8V0H8M1192 0H1200V8M1200 364V372H1192M8 372H0V364" fill="none" stroke="${palette.accent}" stroke-width="3"/>`;
banner += text('ABHISHEK KUMAR / BACKEND ENGINEERING',54,53,19,palette.accent);
banner += pixelText('BUILD. RETRY.',54,93,6);
banner += pixelText('KEEP GOING.',54,154,6,palette.accent);
banner += text('Java & Spring Boot',54,242,24,palette.white);
banner += text('APIs. Background jobs. Failure paths.',54,278,18);
banner += text('SYSTEMS ARCHITECT AT PEGA',54,334,16);
banner += `<path d="M668 86H1124M668 328H1124" stroke="${palette.border}" stroke-width="2"/>`;
banner += text('THE BACKEND WORKSHOP',684,119,17,palette.accent);
banner += rack(680,'API','IN')+rack(858,'WORKER','RUN')+rack(1036,'DATA','DB');
banner += `<path d="M782 212H850M960 212H1028" stroke="${palette.border}" stroke-width="4" stroke-dasharray="5 9"/><rect x="790" y="208" width="8" height="8" fill="${palette.accent}"/><rect x="968" y="208" width="8" height="8" fill="${palette.accent}"/>`;
banner += packet('784 207;797 207;810 207;823 207;836 207;836 207;836 207;784 207');
banner += packet('962 207;962 207;962 207;975 207;988 207;1001 207;1014 207;962 207','0s');
banner += [ [651,58],[1138,58],[1148,142],[638,288] ].map(([x,y])=>`<path d="M${x-5} ${y}h15M${x} ${y-5}v15" stroke="${palette.border}" stroke-width="3"/>`).join('');
await writeFile(new URL('pixel-workshop.svg',assets),svg(1200,372,'Abhishek Kumar — Build. Retry. Keep going.','Java and Spring Boot backend engineering. Pixel server racks illustrate APIs, workers, and persisted data. Slow moving packets are decorative.',banner));

const technologies = [ ['J','Java 21'],['S','Spring Boot'],['P','PostgreSQL'],['K','Kafka'],['R','Redis'],['D','Docker'] ];
let strip=`<rect width="600" height="232" fill="${palette.bg}"/>`;
technologies.forEach(([mark,label],i)=>{
  const x=(i%2)*300;
  const y=Math.floor(i/2)*74;
  strip+=`<path d="M${x+22} ${y+20}h40v40h-40z" fill="${palette.panel}" stroke="${palette.border}" stroke-width="2"/>`;
  strip+=pixelText(mark,x+32,y+26,4,palette.accent);
  strip+=text(label,x+77,y+51,32,palette.white);
});
await writeFile(new URL('pixel-toolkit-compact.svg',assets),svg(600,232,'Java 21, Spring Boot, PostgreSQL, Kafka, Redis, Docker','Primary project technologies, with custom pixel letter marks.',strip));

for (const [file,label,width] of [['explore-build.svg','EXPLORE BUILD',224],['architecture.svg','ARCHITECTURE',212],['email.svg','EMAIL ME',152]]) {
  const body=`<rect x="3" y="3" width="${width-3}" height="39" fill="#0a1c15"/><rect x="1" y="1" width="${width-5}" height="36" fill="${palette.bg}" stroke="${palette.accent}" stroke-width="2"/>${pixelText(label,14,11,2,palette.accent)}${pixelText('>',width-27,11,2,palette.accent)}`;
  await writeFile(new URL(file,assets),svg(width,43,label,label,body));
}
console.log(`Built Pixel Workshop assets in ${fileURLToPath(assets)}`);
