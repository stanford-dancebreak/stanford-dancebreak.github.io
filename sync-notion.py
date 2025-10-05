#!/usr/bin/env -S uv run
import os
from notion_client import Client
import yaml

POSTS_DB = "264fe184d6788074a210c7cdfea69ed4"

def main():
    notion = Client(auth=os.environ["NOTION_SECRET"])
    posts = notion.databases.query(database_id=POSTS_DB, page_size=65536)
    output = yaml.dump(posts['results'])
    with open('data/events.yaml', 'w') as f:
        f.write(output)


if __name__ == "__main__":
    main()
