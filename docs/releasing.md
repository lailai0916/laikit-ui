# Releasing

The public npm package is `@lailai0916/ui`; GitHub source is `lailai0916/laikit-ui`.
The maintainer publishes through npm CLI authentication. No registry credential belongs in this
repository or its workflow files. CI validates every push and pull request; it does not publish.

1. Update the version in `package.json` and `package-lock.json`, and describe the release in
   `CHANGELOG.md`. Until 1.0, use a minor bump for breaking changes and a patch for compatible fixes.
2. Run `npm run check`, then `npm pack --dry-run`. Confirm the package includes only `dist/`, package
   metadata, README, and license. Install the tarball into a consumer and verify its build and UI.
3. Commit and push the release source. Wait for the CI workflow to pass.
4. Run `npm login` if needed, then `npm publish --access public`. Complete npm's account or two-factor
   prompts yourself. The prepublish hook reruns the checks before upload.
5. Verify `npm view @lailai0916/ui version`, create the matching `vX.Y.Z` tag and GitHub release,
   and install the registry version in each consumer. Commit consumer lockfiles and run their checks.

An npm version is immutable: fix a published defect with another version. Keep the website on an
explicit reviewed version; shared source updates do not silently change a deployed website.
