# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added link to [ainconv-rs](https://github.com/mkpoli/ainconv-rs) in [README.md](README.md).
- Added Biome as linting and formatting tool, fixed linting errors and formatted the codebase.
- Added unified test cases in [mkpoli/ainconv-tests](https://github.com/mkpoli/ainconv-tests).
- Added word-based sentence conversion for all scripts.
- Added CHANGELOG.md.

### Fixed

- Fixed Hangul test cases.

### Changed

- Changed /w/'s representation in Hangul to `ㅱ` instead of `ㅍ`.

## [0.2.1] - 2024-12-19

### Fixed

- Fixed empty hangul output.

## [0.2.0] - 2024-12-18

### Added

- Added Cyrillic accent conversion.

### Changed

- Refactored file structure (`ACCENT_CONVERSION_TABLE` is now in `latin.ts`).
- Inline inKeys function.

### Removed

- Removed Hangul accent conversion for now.

## [0.1.6] - 2024-12-18

### Changed

- Made so that letter casing is preserved between Latin and Cyrillic scripts.

## [0.1.5] - 2024-12-18

### Added

- Added build to pre-publish step.
- Added test case with `=`.

### Fixed

- Fixed non-pronunciation characters get deleted.
- Fixed variant replacement.

### Changed

- Cancelled default supression of -r variants.

## [0.1.4] - 2024-12-18

### Changed

- Make so that latin text is cleaned before conversion.

## [0.1.3] - 2024-12-17

### Added

- Exported all functions at index.

## [0.1.2] - 2024-12-17

### Added

- Added `terser` plugin to minify the build.

## [0.1.1] - 2023-12-17

### Fixed

- Fixed esm entry points.

## [0.1.0] - 2023-12-17

#### Added

- Added basic conversion between Katakana, Cyrillic, Hangul and Latin scripts.
- Added JSDoc comments to the code.
- Added package details to [package.json](package.json).
- Added test cases for conversions.
- Added LICENSE and README.md.
- Added TypeScript declaration files.