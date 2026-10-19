/* ============================================================
   現代風レイアウトの動き（css/modern.css とセット）
   ・スクロール位置のバー  ・タブの影  ・ページ上部へ戻るボタン
   ・セクションがスクロールで下から現れる
   視覚効果を減らす設定の端末では、動きを付けない。
   ============================================================ */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // スクロール位置のバーと「上へ戻る」ボタン
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  var top = document.createElement('button');
  top.type = 'button'; top.className = 'to-top'; top.setAttribute('aria-label', 'ページの先頭へ戻る'); top.textContent = '↑';
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  document.body.appendChild(top);
  var jump = document.querySelector('.jump');
  var ticking = false;
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.pageYOffset;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    top.classList.toggle('is-shown', y > 600);
    if (jump) jump.classList.toggle('is-stuck', jump.getBoundingClientRect().top <= 0 && y > 0);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // スクロールで現れる（見出し・カード・表など）
  if (reduce || !('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll([
    '.section .section-label', '.section h2', '.lead', '.about-item', '.event-list li',
    '.info', '.sns-box', '.admin-group', '.pack-table', '.notes', '.hs-tabs',
    '.rate-card', '.honsen-row', '.stage-trigger', '.area-item', '.area-intro'
  ].join(','));
  if (!targets.length) return;
  document.documentElement.classList.add('js-anim');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  Array.prototype.forEach.call(targets, function (el) {
    // 同じ親の中で並んでいる要素は、少しずつ遅らせて順に出す
    var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
    el.style.setProperty('--delay', Math.min(sib, 6) * 0.06 + 's');
    el.classList.add('reveal');
    io.observe(el);
  });
  // 後から描画される要素（ステージバー・本選結果の一覧など）にも対応
  var mo = new MutationObserver(function (list) {
    list.forEach(function (m) {
      Array.prototype.forEach.call(m.addedNodes, function (n) {
        if (n.nodeType === 1 && n.matches && n.matches('.stage-trigger, .honsen-row, .rate-card, .area-item, .area-intro') && !n.classList.contains('reveal')) {
          n.classList.add('reveal'); io.observe(n);
        }
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
