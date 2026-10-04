#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""images フォルダ直下の画像一覧を js/hero-images.js に書き出す。

メインページ上部のスライドショーは、この一覧の順（ファイル名順）で画像を表示する。
images に画像を追加・削除したら、fmc-hp フォルダで次を実行して一覧を更新する:
    python tools/update_hero_images.py

・子フォルダ（players, yosen_ss, honsen_ss など）の中は対象外
・EXCLUDE に書いたファイル（ロゴなど）は対象外
"""
import os

EXCLUDE = {'fmc-logo.png'}
EXTS = ('.png', '.jpg', '.jpeg', '.webp', '.gif')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
img_dir = os.path.join(ROOT, 'images')
names = sorted(n for n in os.listdir(img_dir)
               if os.path.isfile(os.path.join(img_dir, n))
               and n.lower().endswith(EXTS) and n not in EXCLUDE)

dst = os.path.join(ROOT, 'js', 'hero-images.js')
with open(dst, 'w', encoding='utf-8', newline='\n') as f:
    f.write('/* tools/update_hero_images.py が images フォルダ直下から自動生成します。 */\n'
            'var HERO_IMAGES = [\n' + ''.join("  'images/%s',\n" % n for n in names) + '];\n')
print('%d 枚を登録しました → %s' % (len(names), dst))
for n in names:
    print('  ' + n)
