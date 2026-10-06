/** Narrow untrusted frames before room logic sees them. */
const MAX_FRAME_BYTES=16384, MAX_ACTION_BYTES=4096, ROOM_ID=/^[A-Za-z0-9_-]{1,64}$/;
export type ClientMessage={type:"join";playerId:string;sessionId?:string}|{type:"action";action:unknown}|{type:"reset"};
export type ParseResult={ok:true;msg:ClientMessage}|{ok:false;error:string};
function record(v:unknown):v is Record<string,unknown>{return typeof v==="object"&&v!==null&&!Array.isArray(v);}
export function parseClientMessage(raw:string|ArrayBuffer):ParseResult{
 if(typeof raw!=="string")return{ok:false,error:"expected a text frame"};
 if(new TextEncoder().encode(raw).byteLength>MAX_FRAME_BYTES)return{ok:false,error:"message too large"};
 let value:unknown;try{value=JSON.parse(raw);}catch{return{ok:false,error:"invalid json"};}
 if(!record(value))return{ok:false,error:"expected a json object"};
 if(value.type==="join"){
  if(typeof value.playerId!=="string"||!/^[A-Za-z0-9_-]{8,64}$/.test(value.playerId))return{ok:false,error:"invalid investigator id"};
  if(value.sessionId!==undefined&&(typeof value.sessionId!=="string"||!ROOM_ID.test(value.sessionId)))return{ok:false,error:"invalid case session"};
  return{ok:true,msg:value.sessionId?{type:"join",playerId:value.playerId,sessionId:value.sessionId}:{type:"join",playerId:value.playerId}};
 }
 if(value.type==="action"){
  if(!("action"in value))return{ok:false,error:"action required"};
  let size:number;try{size=new TextEncoder().encode(JSON.stringify(value.action)??"").byteLength;}catch{return{ok:false,error:"action is not serializable"};}
  if(size>MAX_ACTION_BYTES)return{ok:false,error:"action too large"};
  return{ok:true,msg:{type:"action",action:value.action}};
 }
 if(value.type==="reset")return{ok:true,msg:{type:"reset"}};
 return{ok:false,error:"unknown message type"};
}
