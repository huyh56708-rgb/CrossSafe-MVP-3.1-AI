(function(){
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const widget=document.createElement('div');
  widget.innerHTML=`
    <button class="ai-launcher" id="aiLauncher" aria-label="Open CrossSafe AI">✦<i class="ai-pulse"></i></button>
    <section class="ai-chat" id="aiChat" aria-label="CrossSafe AI assistant">
      <header class="ai-head"><div class="ai-brand"><span class="ai-logo">✦</span><span><b>CrossSafe AI</b><small>AI SAFETY ASSISTANT · GEMINI 2.5 FLASH</small></span></div><button class="ai-close" id="aiClose" aria-label="Close">×</button></header>
      <div class="ai-messages" id="aiMessages"><div class="ai-msg bot">Hi! I'm CrossSafe AI. I can explain a job's risk, red flags, and what you should do next. Try a question below.</div></div>
      <div class="ai-quick"><button data-q="Why is this job risky?">Why risky?</button><button data-q="Which red flag matters most?">Top red flag?</button><button data-q="What should I do next?">What next?</button></div>
      <form class="ai-form" id="aiForm"><textarea id="aiInput" maxlength="2000" placeholder="Ask CrossSafe AI…"></textarea><button class="ai-send" type="submit">➤</button></form>
      <div class="ai-note">AI answers are educational and may be wrong. Never share passwords, OTPs, card numbers, or unnecessary personal data.</div>
    </section>`;
  document.body.appendChild(widget);
  const launcher=document.getElementById('aiLauncher'), chat=document.getElementById('aiChat'), close=document.getElementById('aiClose'), messages=document.getElementById('aiMessages'), form=document.getElementById('aiForm'), input=document.getElementById('aiInput');
  function context(){
    const job=document.querySelector('#job')?.value||'';
    const country=document.querySelector('#countrySelect')?.value||'';
    const status=document.querySelector('#statusSelect')?.value||'';
    const result=document.querySelector('#result');
    return {job:job.slice(0,6000),country,status,analysis:result&&!result.classList.contains('hidden')?result.innerText.slice(0,5000):''};
  }
  function add(text,who){const d=document.createElement('div');d.className='ai-msg '+who;d.textContent=text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight;return d}
  launcher.onclick=()=>{chat.classList.toggle('open');if(chat.classList.contains('open'))input.focus()}; close.onclick=()=>chat.classList.remove('open');
  document.querySelectorAll('.ai-quick button').forEach(b=>b.onclick=()=>{input.value=b.dataset.q;form.requestSubmit()});
  form.onsubmit=async e=>{e.preventDefault();const q=input.value.trim();if(!q)return;add(q,'user');input.value='';const typing=add('Thinking…','bot typing');try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q,context:context()})});const data=await r.json();typing.remove();if(!r.ok)throw new Error(data.error||'Request failed');add(data.reply||'I could not generate a response.','bot')}catch(err){typing.remove();add('AI is not connected yet. Deploy this project with the included /api/chat serverless function and set GEMINI_API_KEY in your hosting environment.','bot')}};
})();
