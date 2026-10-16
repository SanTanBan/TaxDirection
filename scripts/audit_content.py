"""Check that the archived original site's links and images remain on the homepage."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json


class Inventory(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.images = set(), set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.add(attrs["href"].rstrip("/"))
        if tag == "img" and attrs.get("src"):
            self.images.add(attrs["src"])


def main():
    root = Path(__file__).resolve().parents[1]
    old, new = Inventory(), Inventory()
    old.feed((root / "legacy.html").read_text(encoding="utf-8-sig"))
    new.feed((root / "index.html").read_text(encoding="utf-8-sig"))
    missing_links, missing_images = sorted(old.links - new.links), sorted(old.images - new.images)
    missing_files = sorted(src for src in new.images if not urlsplit(src).scheme and not (root / unquote(src)).is_file())
    result = dict(original_unique_links=len(old.links), original_images=len(old.images),
                  missing_links=missing_links, missing_images=missing_images,
                  missing_image_files=missing_files, preserved=not(missing_links or missing_images or missing_files))
    print(json.dumps(result, indent=2))
    if not result["preserved"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
