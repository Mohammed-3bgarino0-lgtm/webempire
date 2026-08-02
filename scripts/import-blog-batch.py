#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
import tempfile
import zipfile
from pathlib import Path


REQUIRED_FIELDS = {
    "id",
    "slug",
    "title",
    "description",
    "category",
    "category_code",
    "author",
    "publish_date",
    "cover_url",
    "cover_alt",
    "word_count",
    "primary_keyword",
    "intent",
    "body_html",
    "related_slugs",
}


def resolve_source(source: Path, temp_root: Path) -> Path:
    if source.is_dir():
        return source

    if source.is_file() and source.suffix.lower() == ".zip":
        extracted = temp_root / "extracted"
        extracted.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(source) as archive:
            archive.extractall(extracted)
        return extracted

    raise SystemExit("Source must be a directory or ZIP archive.")


def find_cover(source_root: Path, article: dict) -> Path | None:
    cover_url = str(article["cover_url"]).lstrip("/")
    exact = source_root / cover_url
    if exact.exists():
        return exact

    expected_name = Path(cover_url).name
    matches = list(source_root.rglob(expected_name))
    return matches[0] if matches else None


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import an original Web Empire article batch safely."
    )
    parser.add_argument("source", type=Path, help="Batch directory or ZIP archive")
    parser.add_argument(
        "--overwrite-identical",
        action="store_true",
        help="Allow replacing an existing article only when its JSON is identical.",
    )
    args = parser.parse_args()

    project_root = Path.cwd()
    posts_target = project_root / "src/content/blog/posts"

    if not (project_root / "package.json").exists() or not posts_target.exists():
        raise SystemExit("Run this command from the webempire project root.")

    imported = []
    skipped_identical = []
    conflicts = []
    missing_covers = []

    with tempfile.TemporaryDirectory(prefix="web-empire-blog-import-") as temp:
        source_root = resolve_source(args.source.resolve(), Path(temp))
        article_files = sorted(source_root.rglob("article-*.json"))

        if not article_files:
            raise SystemExit("No article-####.json files were found in the batch.")

        for article_path in article_files:
            article = json.loads(article_path.read_text(encoding="utf-8"))
            missing = sorted(REQUIRED_FIELDS.difference(article))
            if missing:
                raise SystemExit(
                    f"{article_path.name}: missing fields: {', '.join(missing)}"
                )

            article_id = int(article["id"])
            expected_name = f"article-{article_id:04d}.json"
            target_json = posts_target / expected_name
            normalized = json.dumps(
                article, ensure_ascii=False, separators=(",", ":")
            ) + "\n"

            if target_json.exists():
                current = json.loads(target_json.read_text(encoding="utf-8"))
                if current == article and args.overwrite_identical:
                    skipped_identical.append(article_id)
                    continue
                conflicts.append(article_id)
                continue

            cover_source = find_cover(source_root, article)
            if cover_source is None:
                missing_covers.append(article_id)
                continue

            target_json.write_text(normalized, encoding="utf-8")

            cover_relative = Path(str(article["cover_url"]).lstrip("/"))
            cover_target = project_root / "public" / cover_relative
            cover_target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(cover_source, cover_target)
            imported.append(article_id)

    report = {
        "imported_count": len(imported),
        "imported_first": imported[0] if imported else None,
        "imported_last": imported[-1] if imported else None,
        "skipped_identical": skipped_identical,
        "conflicts": conflicts,
        "missing_covers": missing_covers,
    }

    report_path = project_root / "blog-import-report.json"
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(json.dumps(report, ensure_ascii=False, indent=2))

    if conflicts or missing_covers:
        raise SystemExit(
            "Import stopped with conflicts or missing covers. Review blog-import-report.json."
        )

    print("Import completed. Run: node scripts/rebuild-blog-index.mjs")


if __name__ == "__main__":
    main()
