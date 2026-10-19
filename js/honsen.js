/* ============================================================
   本選結果（honsen.html）
   ------------------------------------------------------------
   タブで「進出者一覧（赤）」と「エリア通過率（青）」を切り替える。
     進出者一覧：2nd STAGE 進出者（Day 1 / Day 2 切り替え）、
                 3rd STAGE 進出者、FINALIST を縦に並べる
     エリア通過率：ステージごとに、エリアの通過率を横棒で表示する
   データは js/honsen-data.js（__backup/tools/convert_honsen.py が
   __dummy/results.csv から作る）と、エリア通過率は js/stages-data.js（convert_stages.py が
   __dummy/stages.csv から作る）を使う。
   2nd STAGE 進出者だけ Day 1 / Day 2 で分け、3rd STAGE 進出者・FINALIST には競技日を表示しない。
   ============================================================ */
var HONSEN_DAYS = [
  { id: 'day1', label: 'Day 1' },
  { id: 'day2', label: 'Day 2' }
];

(function () {
  var D = (typeof HONSEN_DATA !== 'undefined' && HONSEN_DATA) || {};
  var PLAYERS = (typeof PLAYERS_DATA !== 'undefined' && PLAYERS_DATA) || {};
  var ST = (typeof STAGES !== 'undefined' && STAGES) || [];
  var NULL_IMG = 'images/players/player_00.png';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function $(sel) { return document.querySelector(sel); }

  // ---------- タブ ----------
  var tabs = document.querySelectorAll('.hs-tab');
  function openPanel(name, push) {
    Array.prototype.forEach.call(tabs, function (t) {
      var on = t.getAttribute('data-panel') === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      document.getElementById('panel-' + t.getAttribute('data-panel')).hidden = !on;
    });
    if (push && history.replaceState) history.replaceState(null, '', '#' + name);
    if (name === 'rates' && window.__animateRates) window.__animateRates();
  }
  Array.prototype.forEach.call(tabs, function (t) {
    t.addEventListener('click', function () { openPanel(t.getAttribute('data-panel'), true); });
  });
  openPanel(location.hash === '#rates' ? 'rates' : 'players', false);

  // ---------- 進出者一覧 ----------
  // stageIdx: 記録のステージ（0=1st, 1=2nd, 2=3rd）。到達エリアの番号をそのステージのエリア名に置き換える
  function areaName(stageIdx, t) {
    var a = ST[stageIdx] && ST[stageIdx].areas[parseInt(t, 10) - 1];
    return a && a.name ? a.name : 'エリア' + t;
  }
  function row(n, rec, stageIdx) {
    var no = ('0' + n).slice(-2), p = (D.players && D.players[n]) || PLAYERS[n] || {}, name = p.name || '選手名';  // 名前・肩書きは results.csv を優先
    var li = el('li', 'honsen-row');
    var img = el('img', 'honsen-photo');
    img.alt = 'No.' + no + ' ' + name; img.loading = 'lazy';
    img.onerror = function () { this.onerror = null; this.src = NULL_IMG; };
    img.src = 'images/players/player_' + no + '.png';
    li.appendChild(img);
    var body = el('div', 'honsen-body'), who = el('div', 'honsen-who');
    who.appendChild(el('p', 'honsen-no', 'No.' + no));
    if (p.text) who.appendChild(el('p', 'honsen-title', p.text));
    who.appendChild(el('h3', 'honsen-name', name));
    body.appendChild(who);
    var res = el('div', 'honsen-result');
    var stageName = ST[stageIdx] ? ST[stageIdx].name : '';
    res.appendChild(el('p', 'honsen-result-main', stageName + ' クリア'));
    if (rec.best) res.appendChild(el('p', 'honsen-result-time', '残りタイム ' + rec.best + ' 秒'));
    var t1 = (rec.tries || [])[0], t2 = (rec.tries || [])[1];
    var txt = function (t) { return t === 'C' ? 'クリア' : areaName(stageIdx, t); };
    if (rec.tries && rec.tries.length) {      // 1st STAGE は1回目・2回目を表示（2nd STAGE 以降は1回のみなので表示しない）
      var tries = el('div', 'honsen-tries');
      tries.appendChild(el('p', 'honsen-result-detail', '1回目：' + (t1 ? txt(t1) : '-')));
      var none = t1 === 'C' || !t2;
      tries.appendChild(el('p', 'honsen-result-detail' + (none ? ' is-none' : ''), '2回目：' + (none ? '-' : txt(t2))));
      res.appendChild(tries);
    }
    body.appendChild(res);
    li.appendChild(body);
    return li;
  }
  function fill(key, recs, stageIdx, emptyText) {
    var list = $('[data-list="' + key + '"]'), count = $('[data-count="' + key + '"]');
    if (!list) return;
    list.innerHTML = '';
    var n = 0;
    if (recs) for (var z = 1; z <= 50; z++) {
      if (recs[z] && recs[z].show === true) { list.appendChild(row(z, recs[z], stageIdx)); n++; }
    }
    if (!n) list.appendChild(el('li', 'honsen-empty', emptyText));
    if (count) count.textContent = recs ? n + '名' : '発表前';
  }
  // 2nd STAGE 進出者：Day 切り替え
  function clearCount(dayId) {                    // 1st STAGE クリア人数（dayId を省くと全日程の合計）
    var n = 0;
    HONSEN_DAYS.forEach(function (d) {
      if (dayId && d.id !== dayId) return;
      var r = D[d.id] || {};
      for (var z in r) if (r[z] && r[z].show === true) n++;
    });
    return n;
  }
  var dayBox = document.getElementById('honsen-days');
  function showDay(day) {
    fill('2nd', D[day.id], 0, day.label + ' の 2nd STAGE 進出者は発表前です。');
    var c = $('[data-count="2nd"]');               // 見出しには全日程の合計を表示
    if (c) c.textContent = HONSEN_DAYS.some(function (d) { return D[d.id]; }) ? clearCount() + '名' : '発表前';
    Array.prototype.forEach.call(dayBox.children, function (b) {
      var on = b.getAttribute('data-day') === day.id;
      b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  if (dayBox) {
    HONSEN_DAYS.forEach(function (day) {
      var b = el('button', 'honsen-day', day.label);
      b.type = 'button'; b.setAttribute('data-day', day.id);
      // ボタンにはその日のクリア人数を表示
      b.appendChild(el('small', 'lock-note', D[day.id] ? clearCount(day.id) + '名' : '発表前'));
      b.addEventListener('click', function () { showDay(day); });
      dayBox.appendChild(b);
    });
    var first = HONSEN_DAYS[0];
    HONSEN_DAYS.forEach(function (d) { if (D[d.id]) first = d; });
    showDay(first);
  }
  fill('3rd', D.s2, 1, '3rd STAGE 進出者は発表前です。');
  fill('final', D.s3, 2, '今大会で FINALIST は現れませんでした。');

  // ---------- エリア通過率 ----------
  var box = document.getElementById('hs-rates');
  function fmt(v) { return v.toFixed(2) + '%'; }   // パーセントは小数第2位まで固定（0.00%～100.00%）
  var ANIM = [];                                   // { bar, num, to } … 伸ばすゲージと数字
  var DURATION = 1200;                             // ゲージが伸びきるまでの時間（ミリ秒）
  var animated = false;
  window.__animateRates = function () {
    if (animated || !ANIM.length) return;
    animated = true;                               // 2回目以降に開いても動かさない
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function draw(t) {                             // t: 0 → 1
      ANIM.forEach(function (a) {
        var v = a.to * t;
        a.bar.style.width = v + '%';
        a.num.textContent = fmt(t >= 1 ? a.to : v);
      });
    }
    if (reduce || !window.requestAnimationFrame) { draw(1); return; }
    var start = null;
    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / DURATION, 1);
      draw(1 - Math.pow(1 - p, 3));                // 最初は速く、最後はゆっくり止まる
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };
  if (box) {
    // 通過率は stages.csv（js/stages-data.js）から。1st → 2nd → 3rd → FINAL の順
    var SD = (typeof STAGES_DATA !== 'undefined' && STAGES_DATA) || {}, groups = [];
    ['1st', '2nd', '3rd', 'final'].forEach(function (k) { if (SD[k] && SD[k].areas.length) groups.push(SD[k]); });
    if (!groups.length) box.appendChild(el('p', 'honsen-empty', 'エリア通過率は発表前です。'));
    var pct = function (a, b) { return a / b * 100; };
    groups.forEach(function (g) {
      var card = el('section', 'rate-card');
      var head = el('h3', 'rate-head');
      head.appendChild(el('span', '', g.name));
      var known = g.areas.filter(function (a) { return a.tried != null && a.passed != null; });
      var firstA = g.areas[0], lastA = g.areas[g.areas.length - 1];
      if (firstA && lastA && firstA.tried && lastA.passed != null && known.length === g.areas.length) {
        head.appendChild(el('em', 'rate-total', '完走率 ' + fmt(pct(lastA.passed, firstA.tried)) + '（' + lastA.passed + ' / ' + firstA.tried + '）'));
      } else {
        head.appendChild(el('em', 'rate-total is-pending', '集計前'));
      }
      card.appendChild(head);
      var ol = el('ol', 'rate-list');
      g.areas.forEach(function (a, k) {
        var li = el('li', 'rate-row');
        var label = el('span', 'rate-name');
        label.appendChild(el('b', 'rate-no', k < 20 ? String.fromCharCode(0x2460 + k) : '(' + (k + 1) + ')'));
        label.appendChild(document.createTextNode(a.name));
        li.appendChild(label);
        var track = el('span', 'rate-track');
        var ok = a.tried && a.passed != null;
        var v = ok ? pct(a.passed, a.tried) : 0;
        var bar = el('span', 'rate-bar'); bar.style.width = '0%';    // 最初は0%（開いたときに伸ばす）
        track.appendChild(bar);
        li.appendChild(track);
        var val = el('span', 'rate-value' + (ok ? '' : ' is-pending'));
        var num = el('b', 'rate-num', ok ? fmt(0) : '—');
        val.appendChild(num);
        if (ok) ANIM.push({ bar: bar, num: num, to: v });
        if (ok) val.appendChild(el('small', '', a.passed + ' / ' + a.tried + '人'));
        if (ok && a.triedAll) val.appendChild(el('small', 'rate-all', '全挑戦 ' + a.passedAll + ' / ' + a.triedAll + '回'));
        li.appendChild(val);
        li.title = a.name + '：' + (ok ? '通過 ' + a.passed + '人 ／ 挑戦 ' + a.tried + '人（' + fmt(v) + '）' : '集計前');
        ol.appendChild(li);
      });
      card.appendChild(ol);
      box.appendChild(card);
    });
  }
  // 最初から通過率のタブが開いている場合（URL末尾が #rates）
  var rp = document.getElementById('panel-rates');
  if (rp && !rp.hidden) window.__animateRates();
})();
