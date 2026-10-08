import { readFile, writeFile } from 'node:fs/promises';

const assets = new URL('../assets/', import.meta.url);
const palette = { bg:'#111c32', panel:'#182b48', border:'#3d608e', accent:'#90b8ff', text:'#edf4ff' };
const groups = [
  { file:'toolkit-languages-pixel.svg', icon:'toolkit-languages-midnight.svg', title:'Languages', lines:['Java 21 · Python'] },
  { file:'toolkit-backend-pixel.svg', icon:'toolkit-backend-midnight.svg', title:'Backend', lines:['Spring Boot · Spring Security','REST APIs · Spring Data JPA'] },
  { file:'toolkit-data-pixel.svg', icon:'toolkit-data-midnight.svg', title:'Data & messaging', lines:['PostgreSQL · Flyway','Kafka · Redis'] },
  { file:'toolkit-delivery-pixel.svg', icon:'toolkit-testing-midnight.svg', title:'Testing & delivery', lines:['JUnit · Testcontainers','Docker · Docker Compose','GitHub Actions'] },
];
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

for (const group of groups) {
  const source = await readFile(new URL(group.icon, assets),'utf8');
  const license = source.match(/<!--[\s\S]*?-->/)?.[0];
  if (!license) throw new Error(`Icon license comment missing: ${group.icon}`);
  const icon = source.slice(source.indexOf('-->')+3,source.lastIndexOf('</svg>')).trim();
  const height = 104 + (group.lines.length-1)*30;
  const description = `${group.title}: ${group.lines.join(' · ')}`;
  const body = `
  <defs><pattern id="pixels" width="16" height="16" patternUnits="userSpaceOnUse"><rect x="12" y="12" width="2" height="2" fill="${palette.panel}"/></pattern></defs>
  <path d="M8 0H392V8H400V${height-8}H392V${height}H8V${height-8}H0V8H8Z" fill="${palette.bg}"/>
  <path d="M8 0H392V8H400V${height-8}H392V${height}H8V${height-8}H0V8H8Z" fill="url(#pixels)"/>
  <path d="M8 1H391V9H399V${height-9}H391V${height-1}H9V${height-9}H1V9H8Z" fill="none" stroke="${palette.border}" stroke-width="2"/>
  <rect x="16" y="16" width="4" height="4" fill="${palette.accent}"/>
  <g transform="translate(28 22)" fill="none" stroke="${palette.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
  <text x="66" y="43" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" fill="${palette.accent}">${escape(group.title)}</text>
  ${group.lines.map((line,index)=>`<text x="28" y="${77+index*30}" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="${palette.text}">${escape(line)}</text>`).join('\n  ')}
  <rect x="380" y="${height-20}" width="4" height="4" fill="${palette.border}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="${height}" viewBox="0 0 400 ${height}" role="img" aria-labelledby="title desc"><title id="title">${escape(group.title)}</title><desc id="desc">${escape(description)}</desc>${license}${body}</svg>\n`;
  await writeFile(new URL(group.file,assets),svg);
}
console.log('Built four readable Midnight Blue pixel toolkit tiles.');
