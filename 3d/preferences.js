const KEY='ghostshift-accessibility-v1';
export function readPreferences(storage=globalThis.localStorage){try{const p=JSON.parse(storage.getItem(KEY)||'{}');return {subtitles:p.subtitles!==false,outline:p.outline===true};}catch{return {subtitles:true,outline:false};}}
export function savePreferences(value,storage=globalThis.localStorage){try{storage.setItem(KEY,JSON.stringify({subtitles:!!value.subtitles,outline:!!value.outline}));}catch{}}
