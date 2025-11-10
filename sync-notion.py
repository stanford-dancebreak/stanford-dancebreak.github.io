#!/usr/bin/env -S uv run
import os
from notion_client import Client
from notion_client.helpers import collect_paginated_api
from notion_to_md import NotionToMarkdown
import yaml

POSTS_DB = "264fe184d6788074a210c7cdfea69ed4"

DJ_PAGE = "266fe184d678806093b9da5cc7965a90"
DJ_TITLE = "DJing at Dancebreak - DJ Guidelines"

INSTRUCTOR_PAGE = "29dfe184d67880de843bd8bb70fd1101"
INSTRUCTOR_TITLE = "Teaching at Dancebreak - Instructor Guidelines"

HEADER_TEMPLATE = "---\ntitle\n---\n\n"

def main():
    notion = Client(auth=os.environ["NOTION_SECRET"])
    n2m = NotionToMarkdown(notion)

    # events
    posts = notion.databases.query(database_id=POSTS_DB, page_size=65536)
    output = yaml.dump(posts['results'])
    with open('data/events.yaml', 'w') as f:
        f.write(output)
    
    # dj guidelines
    dj_header = HEADER_TEMPLATE.replace("title", DJ_TITLE)
    dj_blocks = n2m.page_to_markdown(DJ_PAGE)
    # Convert markdown blocks to string
    dj_str = n2m.to_markdown_string(dj_blocks).get('parent')
    dj_content = dj_str.split(DJ_TITLE)[-1].strip()
    # Write to a file
    with open("content/info/djing.md", "w") as f:
        f.write(dj_header + dj_content)

    # instructor guidelines
    inst_header = HEADER_TEMPLATE.replace("title", INSTRUCTOR_TITLE)
    inst_blocks = n2m.page_to_markdown(INSTRUCTOR_PAGE)
    # Convert markdown blocks to string
    inst_str = n2m.to_markdown_string(inst_blocks).get('parent')
    inst_content = inst_str.split(INSTRUCTOR_TITLE)[-1].strip()
    # Write to a file
    with open("content/info/teaching.md", "w") as f:
        f.write(inst_header + inst_content)


if __name__ == "__main__":
    main()
