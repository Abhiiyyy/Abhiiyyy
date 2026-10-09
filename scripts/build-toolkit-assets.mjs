import { readFile, writeFile } from 'node:fs/promises';

const assets = new URL('../assets/', import.meta.url);
const palette = { bg:'#111c32', panel:'#182b48', border:'#3d608e', accent:'#90b8ff', text:'#edf4ff' };
const groups = [
  { icon:'toolkit-languages-midnight.svg', title:'Languages', desktop:['Java 21 · Python'], mobile:['Java 21 · Python'] },
  { icon:'toolkit-backend-midnight.svg', title:'Backend', desktop:['Spring Boot · Spring Security','REST APIs · Spring Data JPA'], mobile:['Spring Boot · Spring Security','REST APIs · Spring Data JPA'] },
  { icon:'toolkit-data-midnight.svg', title:'Data & messaging', desktop:['PostgreSQL · Flyway · Kafka · Redis'], mobile:['PostgreSQL · Flyway','Kafka · Redis'] },
  { icon:'toolkit-testing-midnight.svg', title:'Testing & delivery', desktop:['JUnit · Testcontainers · Docker','Docker Compose · GitHub Actions'], mobile:['JUnit · Testcontainers','Docker · Docker Compose','GitHub Actions'] },
  { icon:'toolkit-cloud-midnight.svg', title:'Cloud', desktop:['AWS'], mobile:['AWS'] },
];
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let license = '';
for (const group of groups) {
  const source = await readFile(new URL(group.icon, assets),'utf8');
  const comment = source.match(/<!--[\s\S]*?-->/)?.[0];
  if (!comment) throw new Error(`Icon license comment missing: ${group.icon}`);
  license ||= comment;
  group.paths = source.slice(source.indexOf('-->')+3,source.lastIndexOf('</svg>')).trim();
}
for (const mode of ['desktop','mobile']) {
  const width = mode === 'desktop' ? 800 : 400;
  const rows = groups.map(group => ({ ...group, lines:group[mode], height:78+group[mode].length*28 }));
  const height = 40 + rows.reduce((sum,row)=>sum+row.height,0);
  const outline = `M8 0H${width-8}V8H${width}V${height-8}H${width-8}V${height}H8V${height-8}H0V8H8Z`;
  let body = `<defs><pattern id="pixels" width="18" height="18" patternUnits="userSpaceOnUse"><rect x="13" y="13" width="2" height="2" fill="${palette.panel}"/></pattern></defs>
<path d="${outline}" fill="${palette.bg}"/>
<path d="${outline}" fill="url(#pixels)" stroke="${palette.border}" stroke-width="2"/>
<rect x="18" y="18" width="4" height="4" fill="${palette.accent}"/>
<rect x="${width-22}" y="${height-22}" width="4" height="4" fill="${palette.border}"/>`;
  let top = 24;
  rows.forEach((row,index)=>{
    if (index) body += `<path d="M28 ${top-12}H${width-28}" stroke="${palette.border}" stroke-width="1"/>`;
    body += `<g transform="translate(28 ${top+1})" fill="none" stroke="${palette.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${row.paths}</g>
<text x="66" y="${top+23}" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" fill="${palette.accent}">${escape(row.title)}</text>`;
    row.lines.forEach((line,index)=>{
      body += `<text x="66" y="${top+58+index*28}" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="${palette.text}">${escape(line)}</text>`;
    });
    top += row.height;
  });
  const description = groups.map(group=>`${group.title}: ${group.desktop.join(' · ')}`).join('; ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">My toolkit — Midnight Blue</title><desc id="desc">${escape(description)}</desc>${license}${body}</svg>\n`;
  await writeFile(new URL(`toolkit-shared-${mode}.svg`,assets),svg);
}
console.log('Built shared-background toolkit with Languages, Backend, Data, Testing, and AWS Cloud.');
