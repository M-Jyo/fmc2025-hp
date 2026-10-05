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

/* お問い合わせ欄：公式アカウント（YouTube・X）の埋め込み */
(function () {
  var yt = document.querySelector('[data-youtube-channel-id]');
  if (yt) {
    var cid = (yt.getAttribute('data-youtube-channel-id') || '').trim();
    var box = yt.querySelector('.sns-embed'), link = yt.querySelector('.sns-link');
    if (/^UC[\w-]{10,}$/.test(cid)) {
      // チャンネルの投稿動画一覧（アップロード再生リスト）を埋め込む
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/videoseries?list=UU' + cid.slice(2);
      f.title = 'YouTubeチャンネルの動画';
      f.loading = 'lazy';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      box.appendChild(f);
      link.href = 'https://www.youtube.com/channel/' + cid;
    } else {
      box.textContent = '（チャンネルを記載予定）';
      box.classList.add('is-empty');
      link.style.display = 'none';
    }
  }
  var x = document.querySelector('[data-x-id]');
  if (x) {
    var id = (x.getAttribute('data-x-id') || '').trim().replace(/^@/, '');
    var xbox = x.querySelector('.sns-embed'), xlink = x.querySelector('.sns-link');
    if (/^\w{1,15}$/.test(id)) {
      // Xのタイムラインを埋め込む（表示できない環境では下のボタンから開ける）
      var a = document.createElement('a');
      a.className = 'twitter-timeline';
      a.href = 'https://twitter.com/' + id;
      a.setAttribute('data-height', '360');
      a.setAttribute('data-chrome', 'noheader nofooter');
      a.textContent = '@' + id + ' のポスト';
      xbox.appendChild(a);
      var sc = document.createElement('script');
      sc.async = true; sc.src = 'https://platform.twitter.com/widgets.js'; sc.charset = 'utf-8';
      document.body.appendChild(sc);
      xlink.href = 'https://x.com/' + id;
      xlink.textContent = '@' + id + ' を開く';
    } else {
      xbox.textContent = '（アカウントを記載予定）';
      xbox.classList.add('is-empty');
      xlink.style.display = 'none';
    }
  }
})();
