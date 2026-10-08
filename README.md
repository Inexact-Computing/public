# Public Sharing & Open Access Portal (share/public/)

This folder contains sanitized, open-access artifacts, benchmark exports, and public catalog data derived from the lab's 582+ paper analyses and reproducible work packages.

## Contents & Artifacts

- **`catalog_export.json` / `catalog_export.csv`**: Public literature metadata, categorization tags, and verified DOI links.
- **`benchmarks_pareto.json`**: Consolidated error vs. energy-delay product (EDP) measurements for standard approximate multipliers and adders across open PDKs.
- **`web/`**: Static documentation pages and interactive Pareto frontier visualization for public dissemination.

## Export Script

Run the automated public catalog exporter:
```bash
python share/public/export_public_catalog.py
```
