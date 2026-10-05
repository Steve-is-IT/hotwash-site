/* Shared behaviour for every hotwa.sh page: theme toggle, mobile nav, reveal.
   The initial theme is applied by a tiny inline script in each page's <head>
   (before paint) so there is no flash; this file wires the controls. */
(function(){
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  function current(){ return root.dataset.theme === 'light' ? 'light' : 'dark'; }
  function apply(t){
    root.dataset.theme = t;
    if(meta) meta.setAttribute('content', t === 'light' ? '#e6eef6' : '#0a1a2f');
    var btn = document.getElementById('themetoggle');
    if(btn){
      btn.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
      btn.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
  }
  apply(current());

  /* theme toggle */
  var themeBtn = document.getElementById('themetoggle');
  if(themeBtn){
    themeBtn.addEventListener('click', function(){
      var next = current() === 'light' ? 'dark' : 'light';
      apply(next);
      try{ localStorage.setItem('hotwash-theme', next); }catch(e){}
    });
  }

  /* supermenu dropdown (same panel on desktop and mobile) */
  var menuBtn = document.getElementById('menubtn'), menu = document.getElementById('supermenu');
  if(menuBtn && menu){
    function onKey(e){ if(e.key === 'Escape'){ closeMenu(true); } }
    function onDoc(e){ if(!menu.contains(e.target) && !menuBtn.contains(e.target)){ closeMenu(false); } }
    function openMenu(){
      menu.hidden = false;
      menuBtn.setAttribute('aria-expanded','true');
      menuBtn.setAttribute('aria-label','Close menu');
      document.addEventListener('keydown', onKey);
      document.addEventListener('click', onDoc, true);
    }
    function closeMenu(refocus){
      menu.hidden = true;
      menuBtn.setAttribute('aria-expanded','false');
      menuBtn.setAttribute('aria-label','Open menu');
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDoc, true);
      if(refocus) menuBtn.focus();
    }
    menuBtn.addEventListener('click', function(){ if(menu.hidden) openMenu(); else closeMenu(false); });
    menu.addEventListener('click', function(e){ if(e.target.closest('a')){ closeMenu(false); } });
  }

  /* scroll reveal */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.14});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
  }
})();
