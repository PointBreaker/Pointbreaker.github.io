#!/usr/bin/env python3
"""Translate visible English text in HTML files to Chinese using BeautifulSoup."""
import json
import sys
from bs4 import BeautifulSoup, NavigableString, Comment, Doctype

def translate_file(input_path, output_path, translations):
    with open(input_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')

    SKIP_TAGS = {'script', 'style'}
    CODE_TAGS = {'code', 'pre'}

    def should_translate(text_node):
        text = str(text_node)
        if not text.strip():
            return False
        parent = text_node.parent
        if not parent:
            return False
        p = parent
        while p:
            if hasattr(p, 'name') and p.name in SKIP_TAGS:
                return False
            if hasattr(p, 'name') and p.name == 'svg':
                return False
            p = p.parent
        p = parent
        in_code = False
        while p:
            if hasattr(p, 'name') and p.name in CODE_TAGS:
                in_code = True
                break
            p = p.parent
        if in_code:
            p = parent
            while p:
                if hasattr(p, 'name') and p.name == 'span':
                    classes = p.get('class', [])
                    if 'hljs-comment' in classes:
                        return True
                p = p.parent
            return False
        return True

    def translate_text(text):
        stripped = text.strip()
        if stripped in translations:
            translated = translations[stripped]
            leading = text[:len(text) - len(text.lstrip())]
            trailing = text[len(text.rstrip()):]
            return leading + translated + trailing
        return None

    count = 0
    for text_node in list(soup.strings):
        if isinstance(text_node, (Comment, Doctype)):
            continue
        if not should_translate(text_node):
            continue
        text = str(text_node)
        translated = translate_text(text)
        if translated is not None and translated != text:
            text_node.replace_with(NavigableString(translated))
            count += 1

    output = str(soup)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output)
    print(f"  Applied {count} translations -> {output_path}")

if __name__ == '__main__':
    dict_path = sys.argv[1]
    with open(dict_path, 'r', encoding='utf-8') as f:
        translations = json.load(f)

    pairs = [
        ('../index.html', 'index.html'),
        ('../code.html', 'code.html'),
    ]
    for src, dst in pairs:
        print(f"Processing {src} ...")
        translate_file(src, dst, translations)
