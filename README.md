# LikeMe

Static site for `https://likeme.mprlab.com/`.

## Lifecycle

- `make release` validates the site and prepares a versioned Pages archive locally.
- `make publish` publishes the exact prepared archive as a GitHub Release asset.
- `make deploy` activates that published archive on the `gh-pages` branch and verifies the live release marker.

The repository-owned deployment command is `make deploy`. GitHub Pages serves the `gh-pages` branch.
The provider setting was verified on September 9, 2026.

## Shared UI Migration

I001 prepares the footer for the current `mpr-ui` menu contract under mpr-ui I009.
Production assets retain literal `@latest` URLs.

Install browser test dependencies with `npm ci --prefix tests/browser`.
Install Chromium with `cd tests/browser && npx playwright install chromium`.
Run `make test-shared-ui` to verify the exported Pages artifact against the shared candidate.
Run `make ci` to complete the application checks.

`tests/browser/candidate.json` records the candidate revision and asset digests.
The browser tests verify each downloaded asset before they serve it at the production URL.
The tests cover keyboard controls, navigation, all four themes, image delivery, and layout at mobile and desktop widths.
Final `make ci` passed against B069 revision `768f25936497c5aabd426197d21c2100b6e5d9a1`.
Both browser checks verify the final JavaScript and CSS digests.

The owner must complete the coordinated publication and cache procedure in `mpr-ui/docs/config-migration-deployment-plan.md` before activation.
Published asset and browser cache acceptance remain separate from candidate validation.

The [public asset record](docs/mpr-ui/public-assets-2026-09-09.json) contains three HTTP observations from one network location.
The page declares `max-age=600`. The shared assets declare `max-age=604800` and `s-maxage=43200`.
