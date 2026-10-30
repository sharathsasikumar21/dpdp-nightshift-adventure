import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {releaseImportMap,versionBrowserRelease} from '../../tools/version-browser-release.mjs';

test('a nested camera change invalidates the entire browser module graph',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ghost-release-'));
 try{
  fs.mkdirSync(path.join(root,'view'));
  fs.writeFileSync(path.join(root,'app.js'),"import './view/camera.js?v=old'; import './view/camera.js';");
  fs.writeFileSync(path.join(root,'view/camera.js'),"import '../physics.js'; export const view='third-person';");
  fs.writeFileSync(path.join(root,'physics.js'),"export const engine='rapier';");
  const before=releaseImportMap(root);
  assert.equal(before.imports['./view/camera.js?v=old'],before.imports['./view/camera.js']);
  fs.writeFileSync(path.join(root,'view/camera.js'),"import '../physics.js'; export const view='first-person';");
  const after=releaseImportMap(root);
  assert.notEqual(after.revision,before.revision);
  assert.notEqual(after.imports['./physics.js'],before.imports['./physics.js']);
  fs.writeFileSync(path.join(root,'view/camera.js'),"import '../physics.js';\r\nexport const view='first-person';");
  const windows=releaseImportMap(root);
  fs.writeFileSync(path.join(root,'view/camera.js'),"import '../physics.js';\nexport const view='first-person';");
  assert.equal(releaseImportMap(root).revision,windows.revision);
  fs.writeFileSync(path.join(root,'view/camera.js'),"import '../physics.js'; export const view='first-person';");
  fs.writeFileSync(path.join(root,'index.html'),'<script type="module" src="app.js?v=old"></script>');
  versionBrowserRelease(root);const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  versionBrowserRelease(root);assert.equal(fs.readFileSync(path.join(root,'index.html'),'utf8'),html);
  assert.ok(html.includes('app.js?v='+after.revision));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('published import map matches every current runtime dependency',()=>{
 const root=path.resolve(import.meta.dirname,'..'),release=releaseImportMap(root);
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const published=JSON.parse(html.match(/<script type="importmap">(.*?)<\/script>/s)[1]);
 assert.deepEqual(published.imports,release.imports);
 assert.ok(Object.keys(published.imports).some(alias=>alias.startsWith('./world.js?')));
 assert.ok(published.imports['./physics.js'].endsWith('?v='+release.revision));
});
