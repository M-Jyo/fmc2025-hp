/* ============================================================
   本選結果（honsen.html）
   ------------------------------------------------------------
   Day 1 / Day 2 のボタンで、その日の 2nd STAGE 進出者一覧を切り替える。
   ゼッケン番号（No.01～50）を一意のIDとして、
     左：選手画像（images/players/player_NN.png）
     右：No.・肩書き・選手名（js/players-data.js）と記録
   を1列で縦に並べる。

   記録は js/honsen-data.js（__backup/tools/convert_days.py が
   __dummy/day1_記録.csv・day2_記録.csv から作る）を使う。
     C    … クリア
     数字 … 到達エリア（js/stages.js の 1st STAGE のエリアの並び順で名前に置き換える）
     最高記録 … クリア時の残りタイム
   C（クリア）のある選手が 2nd STAGE 進出者として表示される。
   ============================================================ */
var HONSEN_DAYS = [
  { id: 'day1', label: 'Day 1' },
  { id: 'day2', label: 'Day 2' }
];

(function () {
  var list = document.getElementById('honsen-list');
  if (!list) return;
  var PLAYERS = (typeof PLAYERS_DATA !== 'undefined' && PLAYERS_DATA) || {};
  var RECORDS = (typeof HONSEN_DATA !== 'undefined' && HONSEN_DATA) || {};
  var AREAS = (typeof STAGES !== 'undefined' && STAGES[0] && STAGES[0].areas) || [];   // 1st STAGE のエリア
  var NULL_IMG = 'images/players/player_00.png';
  var tabs = document.getElementById('honsen-days');
  var sub = document.getElementById('honsen-subheading');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function areaName(t) {                               // 到達エリアの番号 → エリア名
    var a = AREAS[parseInt(t, 10) - 1];
    return a && a.name ? a.name : 'エリア' + t;
  }
  function tryText(t) { return t === 'C' ? 'クリア' : areaName(t); }

  function render(day) {
    list.innerHTML = '';
    if (sub) sub.textContent = '2nd STAGE 進出者（' + day.label + '）';
    var recs = RECORDS[day.id] || {}, shown = 0;
    for (var n = 1; n <= 50; n++) {
      var d = recs[n];
      if (!d || d.show !== true) continue;            // クリアした選手だけ表示
      shown++;
      var no = ('0' + n).slice(-2);
      var p = PLAYERS[n] || {};
      var name = p.name || '選手名';

      var li = el('li', 'honsen-row');
      var img = el('img', 'honsen-photo');
      img.alt = 'No.' + no + ' ' + name; img.loading = 'lazy';
      img.onerror = function () { this.onerror = null; this.src = NULL_IMG; };
      img.src = 'images/players/player_' + no + '.png';
      li.appendChild(img);

      var body = el('div', 'honsen-body');
      var who = el('div', 'honsen-who');
      who.appendChild(el('p', 'honsen-no', 'No.' + no));
      if (p.text) who.appendChild(el('p', 'honsen-title', p.text));
      who.appendChild(el('h3', 'honsen-name', name));
      body.appendChild(who);

      var res = el('div', 'honsen-result');
      res.appendChild(el('p', 'honsen-result-main', d.cleared ? '1st STAGE クリア' : '1st STAGE'));
      if (d.cleared && d.best) res.appendChild(el('p', 'honsen-result-time', '残りタイム ' + d.best + ' 秒'));
      // 1回目・2回目を1行ずつ。1回目でクリアした選手、または2回目の記録が無い選手は2回目を「-」にする
      var t1 = (d.tries || [])[0], t2 = (d.tries || [])[1];
      var tries = el('div', 'honsen-tries');
      tries.appendChild(el('p', 'honsen-result-detail', '1回目：' + (t1 ? tryText(t1) : '-')));
      tries.appendChild(el('p', 'honsen-result-detail' + (t1 === 'C' || !t2 ? ' is-none' : ''),
        '2回目：' + (t1 === 'C' || !t2 ? '-' : tryText(t2))));
      res.appendChild(tries);
      body.appendChild(res);
      li.appendChild(body);
      list.appendChild(li);
    }
    if (!shown) list.appendChild(el('li', 'honsen-empty', day.label + ' の 2nd STAGE 進出者は発表前です。'));
    if (tabs) Array.prototype.forEach.call(tabs.children, function (b) {
      var on = b.getAttribute('data-day') === day.id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  // Day 切り替えボタン
  if (tabs) {
    HONSEN_DAYS.forEach(function (day) {
      var b = el('button', 'honsen-day', day.label);
      b.type = 'button';
      b.setAttribute('data-day', day.id);
      if (!RECORDS[day.id]) b.appendChild(el('small', 'lock-note', '発表前'));
      b.addEventListener('click', function () { render(day); });
      tabs.appendChild(b);
    });
  }
  // 最初に表示する日：記録のある最後の日（無ければ Day 1）
  var first = HONSEN_DAYS[0];
  HONSEN_DAYS.forEach(function (d) { if (RECORDS[d.id]) first = d; });
  render(first);
})();
