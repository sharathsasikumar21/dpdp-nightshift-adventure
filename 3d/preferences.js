const KEY='ghostshift-accessibility-v2';
export function readPreferences(storage=globalThis.localStorage){try{const raw=storage.getItem(KEY),p=JSON.parse(raw||storage.getItem('ghostshift-accessibility-v1')||'{}');return {subtitles:raw?p.subtitles!==false:true,outline:p.outline===true};}catch{return {subtitles:true,outline:false};}}
export function savePreferences(value,storage=globalThis.localStorage){try{storage.setItem(KEY,JSON.stringify({subtitles:!!value.subtitles,outline:!!value.outline}));}catch{}}
