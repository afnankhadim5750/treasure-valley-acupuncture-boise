// Treasure Valley Acupuncture — menu, scroll-spy, counters, hscroll, lightbox, accordion, booking
(function(){
  document.documentElement.classList.add('js');
  var menuBtn=document.querySelector('[data-menu-toggle]');
  var nav=document.querySelector('[data-mobile-menu]');
  if(menuBtn&&nav){
    menuBtn.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',open?'true':'false');
      menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');});
    });
  }
  // scroll-spy
  var links=nav?Array.prototype.slice.call(nav.querySelectorAll('a')):[];
  var map={};
  links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        links.forEach(function(a){a.classList.remove('active');});
        var a=map[e.target.id]; if(a) a.classList.add('active');
      }
    });
  },{rootMargin:'-30% 0px -60% 0px'});
  document.querySelectorAll('section[id]').forEach(function(s){io.observe(s);});
  // reveal on scroll (reduced motion: CSS disables transitions)
  var revealIo=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('inview'); revealIo.unobserve(e.target); } });
  },{threshold:0.12});
  document.querySelectorAll('.section, .feature, .trust').forEach(function(el){ el.classList.add('reveal'); revealIo.observe(el); });
  // animated counters (real numbers only)
  var counters=document.querySelectorAll('.count');
  var cio=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el=e.target, target=parseFloat(el.getAttribute('data-count')), dec=parseInt(el.getAttribute('data-decimals')||'0',10);
      cio.unobserve(el);
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        el.textContent = dec ? target.toFixed(dec) : target.toLocaleString('en-US');
        return;
      }
      var t0=null;
      (function tick(t){
        if(!t0) t0=t;
        var p=Math.min((t-t0)/1200,1), v=target*p;
        el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
        if(p<1) requestAnimationFrame(tick);
      })(performance.now());
    });
  },{threshold:0.4});
  counters.forEach(function(c){cio.observe(c);});
  // horizontal scroll controls
  var rail=document.querySelector('[data-hscroll]');
  document.querySelectorAll('[data-scroll]').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(!rail) return;
      rail.scrollBy({left:(btn.getAttribute('data-scroll')==='next'?360:-360),behavior:'smooth'});
    });
  });
  // lightbox with prev/next + keyboard
  var lb=document.getElementById('lightbox'), lbImg=document.getElementById('lb-img');
  var lbBtns=Array.prototype.slice.call(document.querySelectorAll('.lightbox-btn'));
  var current=-1;
  function show(i){
    current=(i+lbBtns.length)%lbBtns.length;
    var btn=lbBtns[current];
    lbImg.src='images/'+btn.getAttribute('data-full')+'-1600.webp';
    lbImg.alt=btn.querySelector('img').alt;
    lb.hidden=false;
  }
  function closeLb(){lb.hidden=true;lbImg.src='';}
  lbBtns.forEach(function(btn,i){ btn.addEventListener('click',function(){ show(i); document.querySelector('.lb-close').focus(); }); });
  document.querySelector('.lb-close').addEventListener('click',closeLb);
  document.querySelector('.lb-prev').addEventListener('click',function(){ show(current-1); });
  document.querySelector('.lb-next').addEventListener('click',function(){ show(current+1); });
  lb.addEventListener('click',function(e){if(e.target===lb) closeLb();});
  document.addEventListener('keydown',function(e){
    if(lb.hidden) return;
    if(e.key==='Escape') closeLb();
    if(e.key==='ArrowLeft') show(current-1);
    if(e.key==='ArrowRight') show(current+1);
  });
  // accordion
  document.querySelectorAll('.acc-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.closest('.acc-item');
      var open=item.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
  });
  // booking -> email
  var form=document.getElementById('booking-form');
  if(form) form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=document.getElementById('bk-name').value.trim();
    var email=document.getElementById('bk-email').value.trim();
    var area=document.getElementById('bk-area').value;
    var msg=document.getElementById('bk-msg').value.trim();
    var subject='Booking request — '+area;
    var body='Hello Treasure Valley Acupuncture,\n\nMy name is '+name+' ('+email+').\nI would like help with: '+area+'.\n'+(msg?('Notes: '+msg+'\n'):'')+'\nPlease let me know a suitable consultation time.\n\nThank you.';
    window.location.href='mailto:info@treasurevalleyacupuncture.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
})();
