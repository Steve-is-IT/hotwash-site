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

  /* mobile nav toggle */
  var toggle = document.getElementById('navtoggle'), navEl = document.getElementById('primary-nav');
  if(toggle && navEl){
    toggle.addEventListener('click', function(){
      var open = navEl.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    navEl.addEventListener('click', function(e){
      if(e.target.tagName === 'A'){ navEl.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open navigation menu'); }
    });
  }

  /* scroll reveal */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.14});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
  }
})();
