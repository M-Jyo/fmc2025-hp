/* ============================================================
   ステージ・エリア紹介の設定
   ------------------------------------------------------------
   open: true  … 公開（クリックでエリア紹介を閲覧できる）
   open: false … 非公開（画像を暗くし COMING SOON 表示、閲覧不可）
   エリアを追加するときは areas に { name, en, image または images, text } を足す。
   ステージには text（説明文）と video（動画のURL）も書ける（詳しくは下の描画部分のコメント）。
   ============================================================ */
var STAGES = [
  {
    id: '1st', no: '　', name: '1st STAGE', open: false,
    preview: 'images/yosen_ss/sptn_00.jpeg',
    areas: [
      { 
        name: 'プリズムシーソー', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'ローリングヒル', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg',
        text: ' explain is null.' 
      },
      { 
        name: 'スクリュードライバー', en: 'ENDLESS STEPS',
        image: 'images/yosen_ss/enls_00.jpeg',
        text: ' explain is null.' 
      },
      { 
        name: 'フィッシュボーン', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg',
        text: ' explain is null.' 
      },
      { 
        name: 'ＤＸ', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg',
        text: ' explain is null.' 
      },
      { 
        name: 'ドラゴングライダー', en: 'ENDLESS STEPS',
        image: 'images/yosen_ss/enls_00.jpeg',
        text: ' explain is null.' 
      },
      { 
        name: 'タックル', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg',
        text: ' explain is null.' 
      },
      { 
        name: 'そり立つ壁', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg',
        text: ' explain is null.' 
      },
    ]
  },
  { 
    id: '2nd', no: '　', name: '2nd STAGE', open: false, 
    preview: 'images/yosen_ss/enls_00.jpeg', 
    areas: [
      { 
        name: 'ローリングログ', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'サーモンラダー上り/下り', en: 'ENDLESS STEPS', // TODO: 画像を2枚使う。
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'スパイダーラン/スパイダードロップ', en: 'ENDLESS STEPS', // TODO: 画像を2枚使う。
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'バックストリーム', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'リバースコンベア', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'ウォールリフティング', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      }
    ] 
  },
  { id: '3rd', no: '　', name: '3rd STAGE', open: false, 
    preview: 'images/yosen_ss/rpcb_00.jpeg', 
    areas: [
      { 
        name: 'フライングバー', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'サイドワインダー', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'スイングエッジ', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'クリフディメンション', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'バーティカルリミット.BURST', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      },
      { 
        name: 'パイプスライダー', en: 'ENDLESS STEPS', 
        image: 'images/yosen_ss/enls_00.jpeg', 
        text: ' explain is null.'
      }
    ] 
  }
];

(function () {
  var list = document.getElementById('stage-list');
  if (!list) return;
  var base = list.getAttribute('data-link-base') || '';
  var detail = document.getElementById('area-detail');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ステージバーの描画
  STAGES.forEach(function (s) {
    var bar = el(s.open ? 'a' : 'div', 'stage-trigger' + (s.open ? '' : ' is-locked'));
    bar.setAttribute('data-stage', s.id);
    if (s.open) {
      bar.href = base + '#' + s.id;
    } else {
      bar.setAttribute('aria-disabled', 'true');
    }
    var img = el('img'); img.src = s.preview; img.alt = ''; img.loading = 'lazy';
    bar.appendChild(img);
    if (s.no && s.no.replace(/[\s\u3000]/g, '')) bar.appendChild(el('span', '', s.no));  // 番号が空なら表示しない
    bar.appendChild(el('h3', '', s.name));
    if (!s.open) bar.appendChild(el('em', 'stage-lock', 'COMING SOON'));
    list.appendChild(bar);
  });

  if (!detail) return;

  // エリア紹介の描画（areas.html のみ）
  // ステージごとの設定で使う項目（STAGES の各ステージに書く）
  //   text  : ステージの説明文（「文章で見る」の位置に表示）
  //   video : 動画のURL（「動画で見る」で開く。空なら「準備中」）
  // エリアごとの設定で使う項目
  //   images: プレビュー画像の配列（例：['images/honsen_ss/a_00.jpeg', 'images/honsen_ss/a_01.jpeg']）
  //           書いていないときは image を1枚だけ表示する
  //   text  : エリアの説明（空なら表示しない）
  function circled(n) { return n <= 20 ? String.fromCharCode(0x245F + n) : '(' + n + ')'; }
  function has(v) { return v != null && String(v).replace(/[\s　]/g, '') !== '' && !/is null\.?$/.test(String(v).trim()); }

  function pagerItem(s, dir) {
    if (!s) return el('span', 'pager-blank');                       // 前後のステージが無い側は空白
    var label = dir === 'prev' ? '← ' + s.name + 'へ' : s.name + 'へ →';
    if (!s.open) {
      var d = el('span', 'pager-link is-locked', label);
      d.appendChild(el('small', 'lock-note', 'COMING SOON'));
      return d;
    }
    var a = el('a', 'pager-link pager-' + dir, label);
    a.href = '#' + s.id;
    return a;
  }

  function show() {
    var id = location.hash.replace('#', '');
    var stage = null, idx = -1;
    STAGES.forEach(function (s, k) { if (s.id === id) { stage = s; idx = k; } });
    detail.innerHTML = '';
    Array.prototype.forEach.call(list.children, function (b) {
      b.classList.toggle('is-current', !!stage && stage.open && b.getAttribute('data-stage') === id);
    });
    if (!stage) return;
    if (!stage.open) {            // 非公開ステージは URL を直接指定しても表示しない
      detail.appendChild(el('p', 'area-empty', stage.name + ' は COMING SOON です。'));
      return;
    }
    detail.appendChild(el('h2', 'area-stage-title', stage.name));

    // ◆文章で見る／◆動画で見る
    var modes = el('div', 'area-modes');
    var textBtn = el('button', 'area-mode is-red', '◆ 文章で見る');
    textBtn.type = 'button';
    textBtn.addEventListener('click', function () { textBox.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    modes.appendChild(textBtn);
    if (has(stage.video)) {
      var v = el('a', 'area-mode is-blue', '◆ 動画で見る');
      v.href = stage.video; v.target = '_blank'; v.rel = 'noopener';
      modes.appendChild(v);
    } else {
      var vd = el('span', 'area-mode is-blue is-locked', '◆ 動画で見る');
      vd.appendChild(el('small', 'lock-note', '準備中'));
      modes.appendChild(vd);
    }
    detail.appendChild(modes);

    // ステージの説明文
    var textBox = el('div', 'area-intro');
    textBox.appendChild(el('p', '', has(stage.text) ? stage.text : '（' + stage.name + ' の説明文を記載予定）'));
    detail.appendChild(textBox);

    // ①②③… エリア名＋プレビュー画像数枚
    if (!stage.areas.length) detail.appendChild(el('p', 'area-empty', 'エリア情報は準備中です。'));
    var ol = el('ol', 'area-list');
    stage.areas.forEach(function (a, i) {
      var li = el('li', 'area-item');
      var head = el('h3', 'area-item-head');
      head.appendChild(el('span', 'area-no', circled(i + 1)));
      head.appendChild(document.createTextNode(a.name));
      li.appendChild(head);
      if (has(a.text)) li.appendChild(el('p', 'area-item-text', a.text));
      var imgs = (a.images && a.images.length) ? a.images : (a.image ? [a.image] : []);
      var gal = el('div', 'area-gallery count-' + Math.min(imgs.length, 3));
      imgs.forEach(function (src, k) {
        var im = el('img'); im.src = src; im.alt = a.name + ' プレビュー' + (k + 1); im.loading = 'lazy';
        gal.appendChild(im);
      });
      if (imgs.length) li.appendChild(gal);
      ol.appendChild(li);
    });
    detail.appendChild(ol);

    // 最下部：← 前のステージへ　トップへ　次のステージへ →
    var pager = el('nav', 'stage-pager');
    pager.setAttribute('aria-label', 'ステージの移動');
    pager.appendChild(pagerItem(STAGES[idx - 1], 'prev'));
    var top = el('a', 'pager-link pager-top', 'トップへ');
    top.href = 'index.html#honsen';
    pager.appendChild(top);
    pager.appendChild(pagerItem(STAGES[idx + 1], 'next'));
    detail.appendChild(pager);

    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  window.addEventListener('hashchange', show);
  if (location.hash) show();
})();
