#!/usr/bin/env python3
"""
Public Literature and Benchmark Exporter
Extracts sanitized literature summaries and benchmark results from docs/ and papers/
into share/public/ for open-access dissemination.
"""

import json
import csv
import os
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
PAPERS_DIR = REPO_ROOT / "papers"
DOCS_DIR = REPO_ROOT / "docs"
PUBLIC_DIR = REPO_ROOT / "share" / "public"

def parse_analysis_file(analysis_path: Path):
    if not analysis_path.exists():
        return None
    
    content = analysis_path.read_text(encoding="utf-8", errors="ignore")
    
    # Extract metadata fields
    title_m = re.search(r"^\s*#\s+(.+)$", content, re.MULTILINE)
    doi_m = re.search(r"DOI:\s*\[?([^\]\)\s]+)\]?", content, re.IGNORECASE)
    venue_m = re.search(r"Venue:\s*([^\n\r]+)", content, re.IGNORECASE)
    year_m = re.search(r"Year:\s*(\d{4})", content, re.IGNORECASE)
    novelty_m = re.search(r"Novelty score:\s*(\d+)", content, re.IGNORECASE)
    
    return {
        "slug": analysis_path.parent.name,
        "title": title_m.group(1).strip() if title_m else analysis_path.parent.name,
        "doi": doi_m.group(1).strip() if doi_m else "",
        "venue": venue_m.group(1).strip() if venue_m else "",
        "year": int(year_m.group(1)) if year_m else None,
        "novelty": int(novelty_m.group(1)) if novelty_m else None
    }

def main():
    print(f"Scanning papers under {PAPERS_DIR}...")
    records = []
    
    if PAPERS_DIR.exists():
        for p_dir in sorted(PAPERS_DIR.iterdir()):
            if p_dir.is_dir():
                analysis_f = p_dir / "analysis.md"
                data = parse_analysis_file(analysis_f)
                if data:
                    records.append(data)
    
    print(f"Parsed {len(records)} paper dossiers.")
    
    out_json = PUBLIC_DIR / "catalog_export.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    print(f"Exported JSON catalog to: {out_json}")
    
    out_csv = PUBLIC_DIR / "catalog_export.csv"
    if records:
        with open(out_csv, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["slug", "title", "venue", "year", "doi", "novelty"])
            writer.writeheader()
            writer.writerows(records)
        print(f"Exported CSV catalog to: {out_csv}")

if __name__ == "__main__":
    main()
