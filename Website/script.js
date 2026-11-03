// Theme remains usable when browser storage is unavailable.
const toggle=document.querySelector('#theme');
let savedTheme=null;try{savedTheme=localStorage.getItem('theme');}catch{}
if(savedTheme==='dark')document.body.classList.add('dark');
function describeTheme(){if(!toggle)return;const dark=document.body.classList.contains('dark');toggle.textContent=dark?'☀':'☾';toggle.setAttribute('aria-label',dark?'Use light color theme':'Use dark color theme');toggle.setAttribute('aria-pressed',String(dark));}
describeTheme();
if(toggle)toggle.addEventListener('click',()=>{document.body.classList.toggle('dark');try{localStorage.setItem('theme',document.body.classList.contains('dark')?'dark':'light');}catch{}describeTheme();});
// Filters announce results without moving keyboard focus away from the chosen control.
const filters=[...document.querySelectorAll('.filter')];
function filterProjects(button){const selected=button.dataset.filter;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('[data-tags]').forEach(card=>{card.hidden=selected!=='all'&&!card.dataset.tags.split(' ').includes(selected);if(!card.hidden)count++;});document.querySelectorAll('section.case').forEach(sec=>{const link=document.querySelector('[data-tags] a[href="#'+sec.id+'"]');sec.hidden=Boolean(link?.closest('[data-tags]')?.hidden);});document.querySelectorAll('.project-jump a').forEach(a=>{a.hidden=Boolean(document.getElementById(a.hash.slice(1))?.hidden);});const status=document.getElementById('filter-status');if(status)status.textContent='Showing '+count+' project'+(count===1?'':'s')+(selected==='all'?'':': '+button.textContent.trim());}
filters.forEach(b=>b.addEventListener('click',()=>filterProjects(b)));
// WAI-ARIA tabs: one tab stop per set, Arrow keys, Home, and End.
function activateLayer(button){const group=button.closest('[role="tablist"]');const panel=document.getElementById(button.dataset.layerTarget);if(!group||!panel)return;group.querySelectorAll('[role="tab"]').forEach(b=>{const active=b===button;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;const p=document.getElementById(b.dataset.layerTarget);if(p)p.hidden=!active;});}
document.querySelectorAll('[role="tablist"]').forEach(group=>{const tabs=[...group.querySelectorAll('[role="tab"]')];tabs.forEach((b,i)=>{b.addEventListener('click',()=>activateLayer(b));b.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;else if(event.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();activateLayer(tabs[next]);});});});
// Ensure a direct project link cannot land inside a previously filtered-out section.
function revealHash(){if(!location.hash)return;const target=document.getElementById(location.hash.slice(1));if(target?.closest('section.case')?.hidden){const all=filters.find(b=>b.dataset.filter==='all');if(all)filterProjects(all);}}
window.addEventListener('hashchange',revealHash);revealHash();
