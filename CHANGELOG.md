# Changelog

## 0.2.0 - 2026-02-23
### Added
- Node engine requirement (`>=18.17.0`) and stricter npm package whitelist.
- Release provenance workflow scaffold (`npm publish --provenance` via GitHub Actions OIDC).
- Release audit artifacts: SHA256, tarball file list, and CycloneDX SBOM generation.

## 0.1.1 - 2026-02-23
### Changed
- Scaffolded GitHub workflow now installs `god-spear` directly.
- README CI example aligned to `npm i -g god-spear`.

## 0.1.0 - 2026-02-23
### Added
- Spear-Core: trust rules with hard fail-fast checks.
- Spear-Trace: hash-chained tamper-evident trace log.
- Reports: JSON + HTML output and CI artifact upload.
- Scaffold: create-pfdo-secure generator.
