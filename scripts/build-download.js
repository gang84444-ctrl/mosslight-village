import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

// Inline the production output so file:// needs no server, npm or CDN.
export async function buildDownload(distPath, outputPath){
  const root=resolve(distPath);let html=await readFile(resolve(root,'index.html'),'utf8');
  const scripts=[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/gi)];
  const styles=[...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/gi)];
  if(scripts.length!==1||styles.length!==1||!scripts[0][1].startsWith('./assets/'))throw new Error('Run npm run build before packaging the download.');
  async function asset(path){const full=resolve(root,path);if(!full.startsWith(root+sep))throw new Error('Asset outside build directory');return readFile(full,'utf8');}
  const js=await asset(scripts[0][1]);
  // Do not silently package a split bundle that still depends on separate files.
  if(/\b(?:from\s*|import\s*\()\s*["']\.\//.test(js))throw new Error('The build contains split modules; bundle them before packaging.');
  const css=(await asset(styles[0][1])).replace(/@import\s*(?:url\([^)]*\)|"[^"]*"|'[^']*')[^;]*;/gi,'');
  html=html.replace(scripts[0][0],()=>`<script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`);
  html=html.replace(styles[0][0],()=>`<style>${css.replace(/<\/style/gi,'<\\/style')}</style>`);
  html=html.replace('href="./" aria-label="모스라이트 홈"','href="#" aria-label="모스라이트 홈"');
  const threeLicense=await readFile(new URL('../node_modules/three/LICENSE',import.meta.url),'utf8');
  html=html.replace('<head>',()=>`<!-- Bundled Three.js license:\n${threeLicense}\n-->\n<head>`);
  await mkdir(dirname(resolve(outputPath)),{recursive:true});await writeFile(outputPath,html,'utf8');
  return outputPath;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const output=await buildDownload('dist','artifacts/mosslight-village-play.html');console.log(`Playable download: ${output}`);
}
