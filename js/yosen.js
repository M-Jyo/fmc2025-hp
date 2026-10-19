/* ============================================================
   メインページ：予選会の競技説明を stages.csv（js/stages-data.js の yosen）から表示する
   ・競技名（h4）とエリア名が一致するものの説明に置き換える
   ・説明の1段落目だけを表示し、2段落目以降は「詳しく見る」で開く
   ・データが無いときは HTML に書いてある説明のまま
   ============================================================ */
(function () {
  var list = document.querySelector('.event-list');
  var Y = (typeof STAGES_DATA !== 'undefined' && STAGES_DATA && STAGES_DATA.yosen) || null;
  if (!list || !Y) return;
  function norm(t) { return String(t || '').replace(/[\s　]/g, ''); }
  Array.prototype.forEach.call(list.querySelectorAll('li'), function (li) {
    var h = li.querySelector('.event-body h4'), p = li.querySelector('.event-body p');
    if (!h || !p) return;
    var title = norm(h.textContent).replace(/^\d+/, '');          // 先頭の番号を除いた競技名
    var area = null;
    Y.areas.forEach(function (a) { if (norm(a.name) === title) area = a; });
    if (!area || !norm(area.text)) return;
    var parts = area.text.replace(/\r/g, '').split(/\n\s*\n/);      // 空行で段落に分ける
    p.textContent = parts[0].trim();
    p.classList.add('event-text');
    if (parts.length > 1) {
      var more = document.createElement('details');
      more.className = 'event-more';
      var sum = document.createElement('summary');
      sum.textContent = '詳しく見る';
      more.appendChild(sum);
      parts.slice(1).forEach(function (para) {      // 段落ごとに分けて、空白行を出さない
        if (!para.trim()) return;
        var body = document.createElement('p');
        body.className = 'event-text';
        body.textContent = para.trim();
        more.appendChild(body);
      });
      p.parentNode.insertBefore(more, p.nextSibling);
    }
  });
})();
