'use strict';
const menuToggle=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.navlinks');
menuToggle?.addEventListener('click',()=>{
  const open=menuToggle.getAttribute('aria-expanded')!=='true';
  menuToggle.setAttribute('aria-expanded',String(open));
  navLinks.classList.toggle('open',open);
});
navLinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  menuToggle?.setAttribute('aria-expanded','false');navLinks.classList.remove('open');
}));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&navLinks?.classList.contains('open')){
    menuToggle.setAttribute('aria-expanded','false');navLinks.classList.remove('open');menuToggle.focus();
  }
});
const trailer=document.querySelector('#trailer-video');
document.querySelectorAll('[data-play-trailer]').forEach(link=>link.addEventListener('click',()=>{
  if(trailer) trailer.play().catch(()=>{ /* Native controls remain available. */ });
}));
const shots=[...document.querySelectorAll('.gallery-item')];
const filters=[...document.querySelectorAll('.filter')];
filters.forEach(filter=>filter.addEventListener('click',()=>{
  filters.forEach(f=>f.setAttribute('aria-pressed',String(f===filter)));
  const category=filter.dataset.filter;
  shots.forEach(s=>{s.hidden=category!=='all'&&s.dataset.category!==category;});
  const status=document.querySelector('#gallery-status');
  if(status) status.textContent=`${shots.filter(s=>!s.hidden).length} screenshots shown`;
}));
const lightbox=document.querySelector('#lightbox');
let activeShot=0,returnFocus=null;
function visibleShots(){return shots.filter(s=>!s.hidden);}
function showShot(index){
  const visible=visibleShots();
  if(!visible.length)return;
  activeShot=(index+visible.length)%visible.length;
  const shot=visible[activeShot];
  lightbox.querySelector('img').src=shot.dataset.full;
  lightbox.querySelector('img').alt=shot.querySelector('img').alt;
  lightbox.querySelector('#lightbox-caption').textContent=shot.dataset.caption;
  lightbox.querySelector('.lightbox-counter').textContent=`${activeShot+1} / ${visible.length}`;
}
shots.forEach(shot=>shot.addEventListener('click',()=>{
  if(!lightbox?.showModal){window.location.href=shot.dataset.full;return;}
  returnFocus=shot;showShot(visibleShots().indexOf(shot));
  lightbox.showModal();document.body.style.overflow='hidden';
}));
if(lightbox){
  lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
  lightbox.querySelector('[data-prev]').addEventListener('click',()=>showShot(activeShot-1));
  lightbox.querySelector('[data-next]').addEventListener('click',()=>showShot(activeShot+1));
  lightbox.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault();showShot(activeShot-1);}
    if(e.key==='ArrowRight'){e.preventDefault();showShot(activeShot+1);}
  });
  lightbox.addEventListener('click',e=>{
    const r=lightbox.getBoundingClientRect();
    if(e.target===lightbox&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))lightbox.close();
  });
  lightbox.addEventListener('close',()=>{document.body.style.overflow='';returnFocus?.focus();});
}
document.querySelector('[data-print-policy]')?.addEventListener('click',()=>window.print());
