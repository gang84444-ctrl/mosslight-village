import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildDownload } from '../scripts/build-download.js';

test('download includes compiled graphics and styles without external app files',async t=>{
  const root=await mkdtemp(join(tmpdir(),'mosslight-download-'));t.after(()=>rm(root,{recursive:true,force:true}));
  const dist=join(root,'dist');await mkdir(join(dist,'assets'),{recursive:true});
  await writeFile(join(dist,'index.html'),'<html><head><script type="module" crossorigin src="./assets/app.js"></script><link rel="stylesheet" crossorigin href="./assets/app.css"></head><body><a href="./">Home</a></body></html>');
  await writeFile(join(dist,'assets/app.js'),'console.log("a </script> test");');
  await writeFile(join(dist,'assets/app.css'),'@import"https://fonts.example/font.css"; body { color: green; }');
  const output=join(root,'play.html');await buildDownload(dist,output);
  const html=await readFile(output,'utf8');
  assert.ok(html.includes('color: green'));assert.ok(html.includes('console.log('));
  assert.ok(!/<script[^>]+src=/i.test(html));assert.ok(!/<link[^>]+stylesheet/i.test(html));
  assert.ok(!html.includes('fonts.example'));assert.ok(!html.includes('a </script> test'));
  assert.ok(html.includes('a <\\/script> test'));
});
test('download refuses a development entry instead of shipping a broken page',async t=>{
  const root=await mkdtemp(join(tmpdir(),'mosslight-source-'));t.after(()=>rm(root,{recursive:true,force:true}));
  await writeFile(join(root,'index.html'),'<script type="module" src="/src/main.js"></script>');
  await assert.rejects(()=>buildDownload(root,join(root,'play.html')),/build/i);
});
