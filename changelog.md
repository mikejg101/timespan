# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] – 2025-04-13

**⚠ BREAKING CHANGE:**  
Internal modules have been fully restructured. If you're importing from internal paths, update your imports to use the main public interface. Direct deep imports are no longer supported.

### Added
- **UMD Web Build**: The library can now be used directly in the browser via a CDN like jsDelivr. A `window.Timespan` global is now available for browser usage.
- **Static Web Test Page**: Added `web-test.html` to validate UMD builds and expose all public methods.
- **Size Monitoring**: Size tracking with [Size Limit](https://github.com/ai/size-limit) is now integrated into CI for bundle size awareness.
- **Code Coverage Reporting**: Integration with Codecov for unit test coverage tracking.
- **Jest JUnit Reporting**: Support added for CI-friendly test result outputs in `reports/junit.xml`.

### Changed
- `Timespan.toString(startDate)` now accepts an optional base date to anchor formatting.
- The internal unit conversion system was fully modularized:
  - Constants, formatting, and calculations now live in separate utility files.
  - Assertion functions and type guards improve runtime validation.
- Build system now uses Rollup for UMD and tsup for ESM/CJS builds.
- Node.js version requirements updated in CI to test against latest versions.
- `npm run clean` and build scripts improved for cross-platform compatibility.

### Removed
- Legacy utility and calculation files.
- Typedoc generation (temporarily) due to CI inconsistencies.

### Fixed
- Resolved a bug that caused incorrect `day` calculations in some scenarios.
- Timezone-related parsing issues fixed.
- Fixed issues with dependency audits targeting dev-only modules.

---

## [1.0.5] – April 11, 2025
- Public interface simplified: consumers now only import from the root module.
- Moved internal constants out of `Timespan` and into dedicated files.
- `Timespan.fromString()` now accepts an optional start date for relative parsing.
- Line-ending formatting issues resolved across platforms.

## [1.0.4] – May 27, 2023
- Bugfix: incorrect duration calculations involving days and timezones.
- Internal structure improvements and additional unit tests.
- Added standard community documents (e.g., Code of Conduct, license metadata).
- Migrated all internal tooling to TypeScript.

## [1.0.3] – May 27, 2023
- Feature: improved accuracy for duration breakdown and parsing logic.

## [1.0.2] – May 27, 2023
- Documentation: updated usage examples in README to reflect current API.

## [1.0.1] – May 27, 2023
- Docs: added project badges and refined installation instructions.

## [1.0.0] – May 27, 2023
- Initial release of the `Timespan` utility.
- Included CLI tools, parsing, formatting, and duration breakdown support.
