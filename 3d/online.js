// Ephemeral Supabase Broadcast rooms. Usernames never enter a table or web storage.
export class Room{
 constructor(client,id,onState,onStatus,onClose){Object.assign(this,{client,id,onState,onStatus,onClose,channel:null,host:false,crew:[],state:null,lastHost:0,closed:false});}
 async connect(code,host,alias,seen){
  this.code=code;this.host=host;this.me={id:this.id,alias,seen};this.closed=false;this.lastHost=Date.now();this.crew=host?[this.me]:[];
  const ch=this.client.channel('nightshift-v3-'+code,{config:{broadcast:{ack:true},presence:{key:this.id}}});this.channel=ch;
  ch.on('broadcast',{event:'message'},({payload:m})=>this.receive(m));
  ch.on('presence',{event:'sync'},()=>{this.present=new Set(Object.keys(ch.presenceState()));});
  return new Promise((resolve,reject)=>{let settled=false;const timeout=setTimeout(()=>{if(!settled){settled=true;this.close();reject(Error('Connection timed out. Try again.'));}},12000);
   ch.subscribe(async status=>{if(status==='SUBSCRIBED'){await ch.track({online:true});if(!settled){settled=true;clearTimeout(timeout);this.send({type:'join',player:this.me});this.interval=setInterval(()=>this.tick(),1000);resolve();}}else if(['CHANNEL_ERROR','TIMED_OUT'].includes(status)){this.onStatus('Connection interrupted; reconnecting. The question deadline still applies.');if(!settled){settled=true;clearTimeout(timeout);reject(Error('Realtime connection unavailable.'));}}});
  });
 }
 send(m){if(!this.channel)return;return this.channel.send({type:'broadcast',event:'message',payload:{...m,from:this.id}}).catch(()=>this.onStatus('Network interrupted. Waiting for the room…'));}
 snapshot(){if(this.host){this.send({type:'snapshot',crew:this.crew,state:this.state});this.onState(this.state,this.crew);}}
 receive(m){if(!m||this.closed||m.from===this.id)return;
  if(this.host){
   if(m.type==='join'&&m.player?.id===m.from){if(this.crew.some(p=>p.id===m.from)){this.snapshot();return;}if(this.state||this.crew.length>=3){this.send({type:'reject',to:m.from,reason:this.state?'This shift has already started.':'Room full: maximum three players.'});return;}const alias=String(m.player.alias||'').trim().slice(0,18);if(!alias)return;this.crew.push({id:m.from,alias,seen:Array.isArray(m.player.seen)?m.player.seen.filter(s=>typeof s==='string').slice(0,10):[]});this.snapshot();}
   if(m.type==='leave'){if(this.state){this.send({type:'closed',reason:'A player left. The shift has ended; incomplete cases remain available.'});this.onClose('A player left. The online shift ended.');}else{this.crew=this.crew.filter(p=>p.id!==m.from);this.snapshot();}}
   if(m.type==='action'&&this.crew.some(p=>p.id===m.from))this.onAction?.(m);
  }else{
   if(m.type==='snapshot'&&(!this.hostId||m.from===this.hostId)){if(!Array.isArray(m.crew)||!m.crew.some(p=>p.id===this.id))return;this.hostId=m.from;this.lastHost=Date.now();this.crew=m.crew;this.state=m.state;this.onState(m.state,m.crew);}
   if(m.type==='reject'&&m.to===this.id)this.onClose(m.reason);
   if(m.type==='closed'&&m.from===this.hostId)this.onClose(m.reason||'The room has closed.');
  }
 }
 tick(){if(this.closed)return;if(this.host){if(!this.state&&this.present){this.missingSince ||= new Map(); this.crew=this.crew.filter(p=>{if(p.id===this.id||this.present.has(p.id)){this.missingSince.delete(p.id);return true;}if(!this.missingSince.has(p.id))this.missingSince.set(p.id,Date.now());return Date.now()-this.missingSince.get(p.id)<15000;});}this.snapshot();}else if(!this.hostId){this.send({type:'join',player:this.me});if(Date.now()-this.lastHost>15000)this.onClose('No host found. Check the room code.');}else if(Date.now()-this.lastHost>15000)this.onClose('Host connection lost. The shift ended safely; your completed cases are remembered.');}
 action(action,values={}){const m={type:'action',from:this.id,action,...values};if(this.host)this.onAction?.(m);else this.send(m);}
 async close(){if(this.closed)return;this.closed=true;clearInterval(this.interval);if(this.channel){await this.send(this.host?{type:'closed',reason:'The host closed the leaderboard. Session usernames have been cleared.'}:{type:'leave'});await this.client.removeChannel(this.channel);}this.channel=null;this.state=null;this.crew=[];this.me=null;this.hostId=null;}
}

