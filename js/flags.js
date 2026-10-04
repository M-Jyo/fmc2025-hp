/* ============================================================
   公開フラグ
   ------------------------------------------------------------
   RESULTS_OPEN … 予選会結果発表を受け付けるかどうか
     true  : 結果ページへのタブ・ボタンが赤色で押せる
     false : タブ・ボタンが灰色の「COMING SOON」になり押せない。
             結果ページを直接開いても一覧は表示しない。
   ============================================================ */
var RESULTS_OPEN = false;

(function () {
  if (RESULTS_OPEN) return;
  // 結果ページへのリンク（タブ・ボタン）を無効化する
  var links = document.querySelectorAll('a[href$="results.html"]');
  for (var i = 0; i < links.length; i++) {
    var a = links[i];
    a.removeAttribute('href');
    a.setAttribute('aria-disabled', 'true');
    a.classList.add('is-locked');
    a.textContent = a.getAttribute('data-label') || '予選会結果';
    var note = document.createElement('small');   // 名称の下の行に小さく表示
    note.className = 'lock-note';
    note.textContent = 'COMING SOON';
    a.appendChild(note);
  }
  // 結果ページ本体：一覧を出さず COMING SOON を表示する
  var grid = document.getElementById('player-grid');
  if (grid) {
    var p = document.createElement('p');
    p.className = 'results-locked';
    p.textContent = 'COMING SOON';
    grid.parentNode.replaceChild(p, grid);
  }
})();
