/* ============================================================
   ステージ・エリア紹介の設定
   ------------------------------------------------------------
   open: true  … 公開（クリックでエリア紹介を閲覧できる）
   open: false … 非公開（画像を暗くし COMING SOON 表示、閲覧不可）
   エリアを追加するときは areas に { name, en, image, text } を足す。
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
  function show() {
    var id = location.hash.replace('#', '');
    var stage = null;
    STAGES.forEach(function (s) { if (s.id === id) stage = s; });
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
    if (!stage.areas.length) detail.appendChild(el('p', 'area-empty', 'エリア情報は準備中です。'));
    stage.areas.forEach(function (a, i) {
      var card = el('article', 'area-card');
      var fig = el('figure');
      var img = el('img'); img.src = a.image; img.alt = a.name; img.loading = 'lazy';
      fig.appendChild(img);
      var body = el('div', 'area-body');
      body.appendChild(el('p', 'section-label', 'AREA ' + ('0' + (i + 1)).slice(-2) + ' / ' + a.en));
      body.appendChild(el('h3', '', a.name));
      body.appendChild(el('p', '', a.text));
      card.appendChild(fig); card.appendChild(body);
      detail.appendChild(card);
    });
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  window.addEventListener('hashchange', show);
  if (location.hash) show();
})();
