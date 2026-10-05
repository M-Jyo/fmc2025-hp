/* スライドショー（images/top フォルダの画像を、ファイル名順に切り替える） */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  // 画像一覧（js/hero-images.js）の順（ファイル名順）に img を作る
  var list = (typeof HERO_IMAGES !== 'undefined' && HERO_IMAGES ? HERO_IMAGES.slice() : []);
  for (var m = list.length - 1; m >= 0; m--) {
    var im = document.createElement('img');
    im.src = list[m]; im.alt = '';
    hero.insertBefore(im, hero.firstChild);
  }
  var imgs = hero.querySelectorAll('img');
  var dots = hero.querySelector('.hero-dots');
  var INTERVAL = 5000; // 切り替え間隔（ミリ秒）
  var cur = 0, timer = null, btns = [];
  function go(n) {
    cur = (n + imgs.length) % imgs.length;
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].classList.toggle('active', i === cur);
      if (btns[i]) btns[i].classList.toggle('active', i === cur);
    }
  }
  function start() {
    if (imgs.length < 2) return;
    clearInterval(timer);
    timer = setInterval(function () { go(cur + 1); }, INTERVAL);
  }
  for (var i = 0; i < imgs.length; i++) {
    (function (i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', (i + 1) + '枚目の画像を表示');
      b.addEventListener('click', function () { go(i); start(); });
      dots.appendChild(b); btns.push(b);
    })(i);
  }
  go(0); start();
})();
