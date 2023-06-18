# coding=utf-8


# 先读取一个文件的内容进行替换。

import os
import re


dir_path = r"C:\\Users\\Snowy\\Documents\\GitHub\\Neural-Networks\\"

# list to store files name
# res = []
# for (dir_path, dir_names, file_names) in os.walk(dir_path):
#     res.extend(file_names)
# print(res)


regexWi = r"\!\[\[(.*?)\]\]"  # ![[]]
regexMi = r"\!\[(.*?)\]\((.*?)\)"  # ![]()


# 定义要批量替换的目录
directory = r"C:\\Users\\Snowy\\Desktop\\ni"

# 遍历目录中的所有文件
for filename in os.listdir(directory):
    filepath = os.path.join(directory, filename)

    # 只处理 Markdown 文件
    if filepath.endswith(".md"):
        # 读取文件内容
        with open(filepath, "r", encoding='utf-8') as file:
            text = file.read()

        # 使用正则表达式替换文本
        new_text = re.sub(r"\!\[\[(.*?)\]\]", r"[img[\1]]", text)
        new1_text = re.sub(r"\!\[(.*?)\]\((.*?)\)", r"[img[\2]]", new_text)

        # 写入替换后的内容到同名文件中
        with open(filepath, "w", encoding='utf-8') as file:
            file.write(new_text)

# file = open('雏菊.md', encoding='utf-8')
# text = file.read()

# 该代码使用 re.sub() 函数将匹配项替换为指定的字符串。模式和替换字符串与前面提到的一样，使用捕获组 \1 引用文件名，并将其插入到新的字符串 [img[]] 中。
# [img[$1]], 使用捕获组 $1 中的文件名替换整个字符串，形成 [img[image.png]] 的结果。
# new_text = re.sub(regexWi, r"[img[\1]]", text)
# new1_text = re.sub(regexMi, r"[img[\2]]", new_text)

# print(new1_text)

# 然后就是如果文件名中有/路径，则要删除路径，仅保留文件名。
