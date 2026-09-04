const demo = `PART-TIME ONLINE ASSISTANT — INTERNATIONAL STUDENTS
Salary: $1,500/month
No experience required. Work from home.
Your main task is to receive payments from our customers using your personal bank account and transfer the money to our company account.
You will receive a 10% commission for every transaction.
No interview required. Start immediately.
Send us your bank account details today to begin.`;

const data={
Russia:{flag:'🇷🇺',rule:'Student work is allowed under specific conditions.',detail:'Russian rules can permit certain students to work in their free time under defined conditions. The exact outcome depends on student status, program and circumstances; a job should not be treated as automatically permitted.',src:'Federal Law No. 115-FZ, Article 13 (reference text).',url:'https://www.consultant.ru/document/cons_doc_LAW_37868/'},
Japan:{flag:'🇯🇵',rule:'Up to 28 hours/week with permission.',detail:'Students generally need permission for activities outside their status. Part-time work is generally limited to 28 hours/week, or up to 8 hours/day during long school holidays, while retaining student status.',src:'Study in Japan — Part-Time Work.',url:'https://www.studyinjapan.go.jp/en/work-in-japan/part-time-jobs/'},
Korea:{flag:'🇰🇷',rule:'Permission and conditions apply; hours are limited.',detail:'International students in relevant D-2/D-4 categories need the applicable part-time employment permission. Hour limits and eligibility depend on status and conditions.',src:'Study in Korea — Employment / Residence information.',url:'https://studyinkorea.go.kr/ko/work/aboutForeignerEmploymentSystem.do'},
Australia:{flag:'🇦🇺',rule:'Visa conditions can limit work hours and job type.',detail:'Australian visa conditions can limit the type of work and number of hours. Many student visa holders can work up to 48 hours per fortnight while their course is in session, subject to the applicable visa condition.',src:'Department of Home Affairs — Work restrictions.',url:'https://immi.homeaffairs.gov.au/visas/working-in-australia/work-rights-and-exploitation/work-restrictions'},
UK:{flag:'🇬🇧',rule:'Common student conditions include 10 or 20 hours/week in term time.',detail:'Student visa work permission depends on course and sponsor. Eligible degree-level study commonly permits up to 20 hours/week in term time; some other courses have 10-hour limits or no work permission.',src:'GOV.UK — Immigration Rules: Appendix Student.',url:'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-student'}
};
const flags=[
['critical','CRITICAL','Personal bank account','Employer requires the student to receive money through their own personal account.'],
['high','HIGH','Receive + transfer','Student is asked to move third-party money to another account.'],
['high','HIGH','Commission for transfers','Student receives a percentage or fee for moving money.'],
['high','HIGH','Urgent action','Pressure to send bank details, pay or start immediately.'],
['medium','MEDIUM','Unusually high pay','Large earnings promised for easy work with little experience.'],
['medium','MEDIUM','No clear contract','Employer identity, duties or employment terms are unclear.'],
['medium','MEDIUM','Free email / informal channel','Recruiter avoids an official company identity or relies on informal contact.'],
['supporting','SUPPORTING','Identity mismatch','Company, sender, domain or recipient information does not align.'],
['supporting','SUPPORTING','No interview / verification','The role can be accepted without meaningful identity or employer checks.'],
['supporting','SUPPORTING','Cash / crypto / gift cards','The job asks for unusual payment conversion methods instead of normal payroll.']
];
function escapeHTML(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function renderCountries(){const el=document.getElementById('countryGrid');if(!el)return;el.innerHTML=Object.entries(data).map(([name,x])=>`<article class="country-card" id="${name.toLowerCase()}"><div class="country-icon">${x.flag}</div><h3>${name}</h3><div class="rule">${x.rule}</div><p>${x.detail}</p><div class="source">${x.src}<br><a href="${x.url}" target="_blank" rel="noopener">Open official/reference source →</a></div></article>`).join('');}
function renderFlags(filter='all'){const el=document.getElementById('flagGrid');if(!el)return;el.innerHTML=flags.filter(x=>filter==='all'||x[0]===filter).map(x=>`<article class="flag ${x[0]}"><div class="flag-level">${x[1]}</div><h3>${x[2]}</h3><p>${x[3]}</p></article>`).join('');}
function initTheme(){const dark=localStorage.getItem('crosssafe-dark')==='true';document.body.classList.toggle('dark',dark);document.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{const next=!document.body.classList.contains('dark');document.body.classList.toggle('dark',next);localStorage.setItem('crosssafe-dark',next);});}
function analyze(){const text=(document.getElementById('job')?.value||'').trim()||demo;const c=document.getElementById('countrySelect')?.value||'Russia';const r=document.getElementById('result');if(!r)return;const t=text.toLowerCase();const checks=[
['Personal bank account',/personal bank account|personal account|own bank account|use your bank account/.test(t),12],
['Receive + transfer',/receive payments|receive money|transfer the money|transfer funds|forward money|move money|send the money/.test(t),16],
['Commission for transfers',/commission|percentage|\b\d{1,2}%\b/.test(t),12],
['Urgent start request',/start immediately|today|urgent|asap|right away|immediately/.test(t),9],
['Unusually high pay',/(\$|€|£)\s?[1-9][\d,]*(?:\.\d+)?\s*(?:\/|per\s+)?(?:month|week)|high salary|easy money|no experience required/.test(t),8],
['No interview / verification',/no interview|without interview|no experience|no verification/.test(t),7],
['Unclear employer / contract',/no contract|no clear contract|anonymous employer|telegram|whatsapp only/.test(t),6],
['Unusual payment method',/crypto|cryptocurrency|gift card|cash out/.test(t),7]
];
const detected=checks.filter(x=>x[1]);const base=10+detected.reduce((a,x)=>a+x[2],0);const mule=checks[0][1]&&checks[1][1]&&checks[2][1];let score=base+(mule?12:0);score=Math.min(100,score);const level=score>=71?'CRITICAL':score>=41?'HIGH':score>=21?'MEDIUM':'LOW';
const action=mule?'STOP: Do not receive or transfer money through your personal account. Do not share banking credentials. Verify the employer independently and use an official support/reporting channel if needed.':level==='CRITICAL'?'Stop and seek official guidance before continuing.':level==='HIGH'?'Pause the offer. Verify the employer, contract, payment process and recipient independently.':level==='MEDIUM'?'Proceed only after independent verification of employer identity, duties and payment details.':'No strong red flags matched. Still verify the employer and never share sensitive credentials.';
r.classList.remove('hidden');r.innerHTML=`<div class="result-top"><div><div class="panel-kicker">ANALYSIS COMPLETE · ${escapeHTML(c.toUpperCase())}</div><div class="result-score">${score}<small>/100</small></div><p class="result-context">${escapeHTML(document.getElementById('statusSelect')?.value||'International Student')}</p></div><span class="result-risk ${level.toLowerCase()}">${level} RISK</span></div><div class="result-meter"><span style="width:${score}%"></span></div><div class="result-grid"><div><h4>Detected signals (${detected.length})</h4><ul class="signal-list">${(detected.length?detected.map(x=>x[0]):['No strong red flags matched in this demo']).map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div><div><h4>Money Mule Risk</h4><div class="big-risk ${mule?'':'safe'}">${mule?'HIGH':'LOW / UNCLEAR'}</div><p class="fineprint">${mule?'The combination of personal-account use + receiving/transferring money + commission is a strong recruitment pattern.':'No complete money-mule pattern was detected. This does not prove the offer is safe.'}</p><div class="action-box"><b>Recommended action</b><p>${escapeHTML(action)}</p></div></div></div><div class="result-disclaimer">This is an educational prototype, not legal advice or a validated fraud-detection model.</div>`;r.scrollIntoView({behavior:'smooth',block:'center'});}
function initCheck(){const job=document.getElementById('job');if(!job)return;document.getElementById('demo').onclick=()=>job.value=demo;document.getElementById('analyze').onclick=analyze;if(new URLSearchParams(location.search).get('demo')==='1'){job.value=demo;setTimeout(analyze,100);}}
document.addEventListener('DOMContentLoaded',()=>{initTheme();renderCountries();renderFlags();initCheck();document.querySelectorAll('.filter-tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderFlags(b.dataset.filter);});});
