#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""予選会CSV（data/yosen.csv）を js/players-data.js に変換する。

使い方（fmc-hp フォルダで実行）:
    python tools/convert_yosen.py
    python tools/convert_yosen.py 入力.csv 出力.js   ← 場所を変える場合

CSVの列（1行目は見出し、列の並び順は自由）:
    zekken_no    ゼッケン番号（1～50。結果一覧のカード位置）
    entry_id     エントリー番号
    player_name  選手名
    score_elst   エンドレスステップスの順位
    score_sptn   スプリントターンの順位
    score_rpcl   ロープクライムの順位
    total_score  総合スコア（3競技の順位の和。小さいほど上位）
    rank_yosen   予選会の最終順位

問題（エラー）が1つでもあれば、出力ファイルは書き換えない。
"""
import csv, json, os, sys

COLUMNS = ['zekken_no', 'entry_id', 'player_name', 'score_elst', 'score_sptn',
           'score_rpcl', 'total_score', 'rank_yosen']
SCORE_COLS = ['score_elst', 'score_sptn', 'score_rpcl']
PLAYER_COUNT = 50

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'data', 'yosen.csv')
dst = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'js', 'players-data.js')


def read_text(path):
    raw = open(path, 'rb').read()
    for enc in ('utf-8-sig', 'cp932'):   # UTF-8 / Excelの日本語CSV の順に試す
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            pass
    sys.exit('エラー: 文字コードを判別できません。UTF-8 で保存してください。')


if not os.path.exists(src):
    sys.exit('エラー: CSVが見つかりません: ' + src)

rows = list(csv.DictReader(read_text(src).splitlines()))
header = [h.strip() for h in (rows[0].keys() if rows else [])]
errors, warnings, players = [], [], {}

missing = [c for c in COLUMNS if c not in header]
if not rows:
    errors.append('データ行がありません。')
elif missing:
    errors.append('列がありません: ' + ', '.join(missing))
else:
    for line, row in enumerate(rows, start=2):
        row = {(k or '').strip(): (v or '').strip() for k, v in row.items()}
        if not any(row.values()):
            continue                      # 空行は飛ばす
        where = '%d行目' % line

        def num(col):
            try:
                return int(row[col])
            except ValueError:
                errors.append('%s: %s が整数ではありません（"%s"）' % (where, col, row[col]))
                return None

        no = num('zekken_no')
        scores = [num(c) for c in SCORE_COLS]
        total, rank = num('total_score'), num('rank_yosen')
        if not row['player_name']:
            errors.append('%s: player_name が空です' % where)
        if no is not None:
            if not 1 <= no <= PLAYER_COUNT:
                errors.append('%s: zekken_no が 1～%d の範囲外です（%d）' % (where, PLAYER_COUNT, no))
            elif no in players:
                errors.append('%s: zekken_no %d が重複しています' % (where, no))
        if None in scores or None in (no, total, rank):
            continue
        if sum(scores) != total:
            warnings.append('%s: total_score（%d）が3競技の順位の和（%d）と一致しません' % (where, total, sum(scores)))
        players[no] = {'entry_id': row['entry_id'], 'name': row['player_name'],
                       'scores': scores, 'total': total, 'rank': rank}

    # 総合スコアが小さいほど上位、になっているかを確認（同点の扱いは決めないので警告のみ）
    ordered = sorted(players.items(), key=lambda kv: kv[1]['rank'])
    for (na, a), (nb, b) in zip(ordered, ordered[1:]):
        if a['rank'] < b['rank'] and a['total'] > b['total']:
            warnings.append('No.%02d（%d位, スコア%d）と No.%02d（%d位, スコア%d）: 順位とスコアの大小が逆です'
                            % (na, a['rank'], a['total'], nb, b['rank'], b['total']))

for w in warnings:
    print('警告: ' + w)
if errors:
    for e in errors:
        print('エラー: ' + e)
    sys.exit('変換を中止しました（%s は書き換えていません）。' % os.path.basename(dst))

body = ',\n'.join('  %d: %s' % (no, json.dumps(players[no], ensure_ascii=False)) for no in sorted(players))
with open(dst, 'w', encoding='utf-8', newline='\n') as f:
    f.write('/* このファイルは tools/convert_yosen.py が data/yosen.csv から自動生成します。\n'
            '   手で編集せず、CSVを直して変換し直してください。 */\n'
            'var PLAYERS_DATA = {\n' + body + '\n};\n')
print('%d 人分を書き出しました → %s' % (len(players), dst))
