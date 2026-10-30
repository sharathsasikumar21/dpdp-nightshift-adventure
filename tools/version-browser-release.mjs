import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

// One revision for the complete module graph prevents a fresh entry point
// from importing a cached camera or physics dependency from an older build.
export function releaseImportMap(root){
 const modules=new Map(),aliases=new Map();
 function visit(relative){
  if(modules.has(relative))return;
  const source=fs.readFileSync(path.join(root,relative),'utf8').replace(/\r\n/g,'\n');
  modules.set(relative,source);
  for(const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)['"]([^'"]+)['"]/g)){
   const specifier=match[1];if(!specifier.startsWith('.'))continue;
   const url=new URL(specifier,'https://release.invalid/'+relative);
   const target=url.pathname.slice(1);
   if(!/\.(?:js|mjs)$/.test(target))continue;
   if(target.startsWith('../')||!fs.existsSync(path.join(root,target)))throw Error('Missing release module: '+target);
   aliases.set('./'+target+url.search,target);visit(target);
  }
 }
 visit('app.js');
 const hash=crypto.createHash('sha256');
 for(const [name,source] of [...modules].sort(([a],[b])=>a.localeCompare(b)))hash.update(name+'\0'+source+'\0');
 const revision='fpv-'+hash.digest('hex').slice(0,12);
 const imports=Object.fromEntries([...aliases].sort(([a],[b])=>a.localeCompare(b)).map(([alias,target])=>[alias,'./'+target+'?v='+revision]));
 return {revision,imports,modules:modules.size};
}

export function versionBrowserRelease(root){
 const release=releaseImportMap(root),file=path.join(root,'index.html');
 let html=fs.readFileSync(file,'utf8').replace(/\s*<!-- RELEASE IMPORT MAP -->[\s\S]*?<!-- END RELEASE IMPORT MAP -->\s*/,'');
 html=html.replace(/<script type="module" src="app\.js[^"\n]*"><\/script>/,'<script type="module" src="app.js?v='+release.revision+'"></script>');
 const block='\n<!-- RELEASE IMPORT MAP -->\n<meta name="ghost-shift-build" content="'+release.revision+'">\n<script type="importmap">'+JSON.stringify({imports:release.imports})+'</script>\n<!-- END RELEASE IMPORT MAP -->\n';
 html=html.replace(/<script type="module"/,block+'<script type="module"');
 fs.writeFileSync(file,html);
 return release;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../3d');
 const {revision,modules}=versionBrowserRelease(root);console.log(JSON.stringify({revision,modules}));
}
