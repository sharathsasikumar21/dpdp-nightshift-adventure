export function createLoadingProgress(stages){
 const tasks=stages.map(s=>({...s,status:'pending'})),listeners=new Set();
 function snapshot(){const done=tasks.filter(s=>s.status!=='pending').length,total=tasks.length;return {done,total,percent:Math.round(done/total*100),active:tasks.filter(s=>s.status==='pending').map(s=>s.label),failed:tasks.filter(s=>s.status==='failed').map(s=>s.label)};}
 function emit(){const s=snapshot();for(const fn of listeners)fn(s);}
 return {snapshot,subscribe(fn){listeners.add(fn);fn(snapshot());return()=>listeners.delete(fn);},async track(id,promise){const stage=tasks.find(s=>s.id===id);if(!stage)throw Error('Unknown loading stage');try{const value=await promise;stage.status='ready';return value;}catch(error){stage.status='failed';throw error;}finally{emit();}}};
}
