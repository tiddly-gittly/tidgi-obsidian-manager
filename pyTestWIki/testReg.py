# coding=utf-8

import re

reg = r"\!\[\[(.*?)\|(.*?)(?:[^|]*\|)*(.*?)\]\]"

# !\[\[(.*?)\|(.*?)(?:[^|]*\|)*(\d+)\]\]

text = "![[内部链接|山东省dfd|gffg|gfg|fadfadfadsfasd]]"

match = re.search(reg, text)

print(match.group(1), match.group(3))
