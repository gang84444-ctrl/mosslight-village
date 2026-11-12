export function connect({state,onStatus,onPlayers,onChat}){
  let token,stream,busy=false,reconnecting=false,retryTimer,disposed=false;
  function retry(){if(disposed)return;api.online=false;stream?.close();onStatus(null);onPlayers([]);clearTimeout(retryTimer);retryTimer=setTimeout(rejoin,4000);}
  const api={online:false,id:null,
    async update(position){if(!api.online||busy)return;busy=true;try{const r=await post('move',position);if(r.status===401||r.status>=500)retry();}catch{retry();}finally{busy=false;}},
    async chat(text){try{const r=await post('chat',{text});if(!r.ok)onChat({name:'마을 안내',text:r.status===429?'잠깐 쉬었다가 다시 보내주세요.':'메시지를 보내지 못했어요.'});}catch{onChat({name:'마을 안내',text:'연결을 확인해주세요.'});}}
  };
  async function post(path,body){return fetch(`/api/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,token}),signal:AbortSignal.timeout(5000)});}
  async function rejoin(){
    if(reconnecting||disposed)return;reconnecting=true;api.online=false;stream?.close();onPlayers([]);onStatus(null);
    try{
      const status=await fetch('/api/status',{signal:AbortSignal.timeout(3000)});
      // Static hosts have no API. Do not continuously probe GitHub Pages.
      if(status.status===404)return;
      if(!status.ok){retry();return;}
      if(!(await status.json()).online)return;
      const r=await post('join',{name:state.name,color:state.color});if(!r.ok){retry();return;}
      const data=await r.json();if(disposed)return;token=data.token;api.id=data.id;
      stream=new EventSource(`/api/events?token=${encodeURIComponent(token)}`);
      stream.onopen=()=>{api.online=true;};
      stream.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.kind==='players'){onPlayers(m.players);onStatus(m.players.length);}if(m.kind==='chat')onChat(m);}catch{}};
      stream.onerror=retry;
    }catch{retry();}finally{reconnecting=false;}
  }
  rejoin();window.addEventListener('pagehide',()=>{disposed=true;clearTimeout(retryTimer);stream?.close();});return api;
}
