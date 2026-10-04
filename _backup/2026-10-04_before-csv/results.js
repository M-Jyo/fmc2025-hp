/* ============================================================
   予選会結果一覧（選手カードを 横5 × 縦10 = 50 枚並べる）
   ------------------------------------------------------------
   カード1枚の構成
     画像内下部 1行目 … 小さい文字の文章（text）
     画像内下部 2行目 … 太字の選手名（name）
     ―― 赤い区切り線 ――
     画像外下部        … ゼッケン番号 No.01 ～ No.50

   選手画像にカーソルを合わせる／タップ／Tabキーで選択すると、
   その選手の予選会スコア（エリアごとの結果・総スコア・全体順位）を表示する。

   選手ごとの内容は PLAYERS に
     ゼッケン番号: { name, text, scores: ['結果1','結果2','結果3'], total: 数値, rank: 数値 }
   の形で書く。scores は SCORE_AREAS と同じ順番。
   書いていない項目は仮の文言、スコア類は「-」を表示する。

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

// 予選会のエリア名（スコア表示の並び順）
var SCORE_AREAS = ['エンドレスステップ', 'スプリントターン', 'ロープクライム'];

var PLAYERS = {
  // 記入例：
  // 1: { name: 'Steve', text: '初出場の挑戦者', scores: ['クリア', '12.34秒', 'リタイア'], total: 250, rank: 3 },
  // 2: { name: 'Alex',  text: '前回大会 1st STAGE クリア', scores: ['クリア', '10.98秒', 'クリア'], total: 300, rank: 1 }
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

    // スコア表示（フォーカス時に出るパネル）
    var has = function (v) { return v !== undefined && v !== null && v !== ''; };
    var panel = el('div', 'player-score');
    panel.appendChild(el('p', 'score-head', 'No.' + no + ' ' + name));
    var ol = el('ol', 'score-list');
    for (var i = 0; i < SCORE_AREAS.length; i++) {
      var row = el('li', '');
      row.appendChild(el('span', 'score-area', (i + 1) + ' ' + SCORE_AREAS[i]));
      row.appendChild(el('span', 'score-value', p.scores && has(p.scores[i]) ? String(p.scores[i]) : '-'));
      ol.appendChild(row);
    }
    panel.appendChild(ol);
    panel.appendChild(el('p', 'score-total', '総スコア：' + (has(p.total) ? p.total : '-')));
    panel.appendChild(el('p', 'score-rank', '全体順位：' + (has(p.rank) ? p.rank + '位' : '-')));
    li.appendChild(panel);
    li.tabIndex = 0;  // キーボード・タップでも選択できるようにする
    grid.appendChild(li);
  }
})();
