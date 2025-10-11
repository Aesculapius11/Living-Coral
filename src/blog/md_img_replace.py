import os
import re

def replace_md_images(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 匹配 ![alt](url)
    pattern = r'!\[([^\]]*)\]\(([^)]+)\)'
    replaced = re.sub(pattern, r'{% image "\2", "\1" %}', content)

    if replaced != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(replaced)
        print(f"已处理: {file_path}")

def main():
    folder = os.path.dirname(os.path.abspath(__file__))
    for filename in os.listdir(folder):
        if filename.endswith('.md'):
            replace_md_images(os.path.join(folder, filename))

if __name__ == "__main__":
    main()