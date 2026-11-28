/* سابقون — طبقة الواجهة الجديدة (تجربة تصميم)
   لا تلمس منطق التطبيق: تعيد استخدام أزرار الأسر الحالية وتضيف بطاقة بارزة. */
(function () {
  var SHORT = { challenges: 'التحديات', hadith: 'البخاري', leaderboard: 'المتصدرين' };

  function icon(name, cls) {
    return '<i data-lucide="' + name + '" class="' + (cls || '') + '"></i>';
  }

  function tfEl() { return document.getElementById('top-family'); }

  function gofam(v) {
    var tf = tfEl(); if (!tf) return;
    var b = tf.querySelector('[data-gofam="' + v + '"]');
    if (b) { b.click(); return; }
    var tab = document.querySelector('.tab-btn[data-tab="challenges"]');
    if (tab) tab.click();
  }

  function buildHero() {
    var host = document.getElementById('top-zone');
    var tf = tfEl();
    if (!host || !tf) return;
    var hero = document.getElementById('fam-hero');
    if (!hero) {
      hero = document.createElement('section');
      hero.id = 'fam-hero';
      hero.setAttribute('aria-label', 'قسم الأسرة');
      host.insertBefore(hero, host.firstChild);
      hero.addEventListener('click', function (e) {
        var t = e.target.closest('[data-fh]');
        if (!t) return;
        e.preventDefault();
        gofam(t.getAttribute('data-fh'));
      });
    }
    var html = tf.innerHTML || '';
    var hasFam = html.indexOf('أفراد أسرتي') !== -1 || html.indexOf('أسرتي ·') !== -1;
    var name = '';
    var m = html.match(/👨‍👩‍👧\s*([^<]{1,40})/);
    if (m) name = m[1].trim();
    var pts = (html.match(/⭐\s*([0-9٠-٩]+)\s*نقطة/) || [])[1] || '';
    var online = (html.match(/([0-9٠-٩]+)\s*من\s*([0-9٠-٩]+)\s*متصلون/) || []);
    var rank = (html.match(/font-num text-2xl font-black">([^<]{1,8})</) || [])[1] || '';

    var body;
    if (hasFam) {
      body =
        '<div class="fh-top">' +
          '<div class="fh-icon">' + icon('users-round') + '</div>' +
          '<div style="min-width:0">' +
            '<h2>' + (name || 'أسرتي') + '<span class="fh-badge">أسرتي</span></h2>' +
            '<div class="fh-sub">أسرتك معاك في التحدي — شوف أعضاءها وترتيبها بين الأسر.</div>' +
          '</div>' +
        '</div>' +
        '<div class="fh-stats">' +
          (pts ? '<span class="fh-stat">⭐ <b>' + pts + '</b> نقطة</span>' : '') +
          (online.length ? '<span class="fh-stat">🟢 <b>' + online[1] + '</b> من <b>' + online[2] + '</b> متصلون الآن</span>' : '') +
          (rank ? '<span class="fh-stat">🏅 ترتيب الأسر <b>' + rank + '</b></span>' : '') +
        '</div>' +
        '<div class="fh-actions">' +
          '<button type="button" class="fh-primary" data-fh="family">' + icon('users') + ' أفراد أسرتي</button>' +
          '<button type="button" class="fh-ghost" data-fh="fams">' + icon('trophy') + ' ترتيب الأسر</button>' +
        '</div>';
    } else {
      body =
        '<div class="fh-top">' +
          '<div class="fh-icon">' + icon('users-round') + '</div>' +
          '<div style="min-width:0">' +
            '<h2>أسرة سابقون<span class="fh-badge">جديد</span></h2>' +
            '<div class="fh-sub">اجمع أهلك وأصحابك في أسرة واحدة، وتنافسوا على الأذكار. كود واحد يدخل بيه الكل.</div>' +
          '</div>' +
        '</div>' +
        '<div class="fh-stats">' +
          '<span class="fh-stat">👨‍👩‍👧 كود دعوة للأسرة</span>' +
          '<span class="fh-stat">🏆 تحدّي أسبوعي بين الأسر</span>' +
          '<span class="fh-stat">⭐ نقاط الأسرة تزيد معاكم</span>' +
        '</div>' +
        '<div class="fh-actions">' +
          '<button type="button" class="fh-primary" data-fh="family">' + icon('user-plus') + ' أنشئ أسرة الآن</button>' +
          '<button type="button" class="fh-ghost" data-fh="family">' + icon('key-round') + ' عندي كود أسرة</button>' +
        '</div>';
    }
    hero.innerHTML = '<div class="fh-in">' + body + '</div><div class="fh-mark">' + icon('users-round') + '</div>';
    if (window.lucide) { try { window.lucide.createIcons(); } catch (e) {} }
  }

  function shortenTabs() {
    document.querySelectorAll('.tab-btn').forEach(function (b) {
      var t = b.dataset.tab, label = SHORT[t];
      if (!label) return;
      var current = (b.textContent || '').replace(/\s+/g, ' ').trim();
      if (current === label) return;
      var ic = b.querySelector('svg, i');
      b.innerHTML = '';
      if (ic) b.appendChild(ic);
      b.appendChild(document.createTextNode(label));
    });
  }

  function apply() {
    shortenTabs();
    buildHero();
  }

  function boot() {
    apply();
    var tf = tfEl();
    if (tf && window.MutationObserver) {
      new MutationObserver(function () { buildHero(); }).observe(tf, { childList: true, subtree: true });
    }
    if (window.renderAll) {
      var prev = window.renderAll;
      window.renderAll = function () {
        var r = prev.apply(this, arguments);
        setTimeout(apply, 0);
        return r;
      };
    }
    // أي إعادة رسم لاحقة (تبديل تبويب مثلاً)
    document.addEventListener('click', function (e) {
      if (e.target.closest('.tab-btn')) setTimeout(apply, 0);
    }, true);
    window.addEventListener('resize', function () { shortenTabs(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
