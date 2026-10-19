/* ============================================================
   制作チーム紹介：表示の整え（HTML は書き換えず、表示だけ整える）
   ・担当（「情報発信・クリエイティブ・建築 ほか」）を「・」で区切ってタグにする
     → 長い担当名が「ほか」だけ次の行に落ちるような折り返しを防ぐ
   ・X のリンクをボタン風の表示にする
   ============================================================ */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.admin-card .admin-text'), function (p) {
    var raw = p.textContent.trim();
    var etc = /\s*ほか$/.test(raw);
    var items = raw.replace(/\s*ほか$/, '').split(/[・、,，]/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (!items.length) return;
    var ul = document.createElement('ul');
    ul.className = 'admin-tags';
    ul.setAttribute('aria-label', '担当：' + raw);
    items.forEach(function (t, k) {
      var li = document.createElement('li'); li.textContent = t;
      if (etc && k === items.length - 1) {            // 「ほか」は最後のタグにくっつけて、1語だけ次の行に落ちないようにする
        var e = document.createElement('span'); e.className = 'admin-tags-etc'; e.textContent = 'ほか';
        li.appendChild(e);
      }
      ul.appendChild(li);
    });
    p.parentNode.replaceChild(ul, p);
  });
  Array.prototype.forEach.call(document.querySelectorAll('.admin-card .admin-x'), function (p) {
    var a = p.querySelector('a');
    if (!a) return;
    a.className = 'admin-x-link';
    a.innerHTML = '';
    var b = document.createElement('b'); b.textContent = 'X'; b.setAttribute('aria-hidden', 'true');
    a.appendChild(b);
    a.appendChild(document.createTextNode(a.href.replace(/^https?:\/\/(x|twitter)\.com\//, '@')));
    a.setAttribute('aria-label', 'X（' + a.textContent.replace(/^X/, '') + '）を開く');
    p.innerHTML = ''; p.appendChild(a);
  });
})();
