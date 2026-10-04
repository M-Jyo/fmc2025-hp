/* スライドショー（一定時間ごとに画像を切り替える） */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;
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
