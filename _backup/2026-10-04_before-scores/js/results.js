/* ============================================================
   予選会結果一覧（選手カードを 横5 × 縦10 = 50 枚並べる）
   ------------------------------------------------------------
   カード1枚の構成
     画像内下部 1行目 … 小さい文字の文章（text）
     画像内下部 2行目 … 太字の選手名（name）
     ―― 赤い区切り線 ――
     画像外下部        … ゼッケン番号 No.01 ～ No.50

   選手ごとの内容は PLAYERS に「ゼッケン番号: { name, text }」で書く。
   書いていない番号は DEFAULT_NAME / DEFAULT_TEXT を表示する。

   画像は現在すべて PLAYER_NULL（仮画像）。USE_NUMBERED を true にすると
   images/players/player_01.png ～ player_50.png を読み込む
   （ファイルが無い番号は仮画像のまま表示）。
   ============================================================ */
var PLAYER_COUNT = 50;
var PLAYER_DIR = 'images/players/';
var PLAYER_NULL = PLAYER_DIR + 'player_00.png';  // 仮画像（player_null.png を用意したらここを書き換える）
var USE_NUMBERED = false;

var DEFAULT_NAME = '選手名';
var DEFAULT_TEXT = 'ここに紹介文が入ります';

var PLAYERS = {
  // 記入例：
  // 1: { name: 'Steve', text: '初出場の挑戦者' },
  // 2: { name: 'Alex',  text: '前回大会 1st STAGE クリア' }
};

(function () {
  var grid = document.getElementById('player-grid');
  if (!grid) return;
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  for (var n = 1; n <= PLAYER_COUNT; n++) {
    var no = ('0' + n).slice(-2);
    var p = PLAYERS[n] || {};
    var name = p.name || DEFAULT_NAME;

    var li = el('li', 'player-card');
    var photo = el('div', 'player-photo');
    var img = document.createElement('img');
    img.alt = 'No.' + no + ' ' + name;
    img.loading = 'lazy';
    img.onerror = function () { this.onerror = null; this.src = PLAYER_NULL; };
    img.src = USE_NUMBERED ? PLAYER_DIR + 'player_' + no + '.png' : PLAYER_NULL;
    var cap = el('div', 'player-caption');
    cap.appendChild(el('p', 'player-text', p.text || DEFAULT_TEXT));
    cap.appendChild(el('p', 'player-name', name));
    photo.appendChild(img);
    photo.appendChild(cap);
    li.appendChild(photo);
    li.appendChild(el('p', 'player-no', 'No.' + no));
    grid.appendChild(li);
  }
})();
