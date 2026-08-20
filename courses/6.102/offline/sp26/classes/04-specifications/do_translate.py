import re
import json

# Read the path-fixed file
with open('/Users/dax/code/github/Pointbreaker.github.io/courses/6.102/offline/sp26/classes/04-specifications/zh/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Load translations from JSON file
with open('/Users/dax/code/github/Pointbreaker.github.io/courses/6.102/offline/sp26/classes/04-specifications/translations.json', 'r', encoding='utf-8') as f:
    T = json.load(f)

# Split by code/pre blocks
parts = re.split(r'(<pre[^>]*>.*?</pre>|<code[^>]*>.*?</code>)', text, flags=re.DOTALL)

# Apply translations
result = []
for part in parts:
    if part.startswith('<pre') or part.startswith('<code'):
        result.append(part)
    else:
        for eng, chn in T.items():
            part = part.replace(eng, chn)
        result.append(part)

text = ''.join(result)

with open('/Users/dax/code/github/Pointbreaker.github.io/courses/6.102/offline/sp26/classes/04-specifications/zh/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
