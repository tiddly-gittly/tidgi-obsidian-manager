# coding=utf-8

import re

reg = r"\!\[(.*?)\]\((.*?)\)"

text = "![[内部链接|山东省dfd|gffg|gfg|fadfadfadsfasd|100]](fdfasdf)"

match = re.search(reg, text)

print(match.group(1), match.group(2))
