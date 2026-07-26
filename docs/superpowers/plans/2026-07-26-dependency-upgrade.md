# Dependency Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade every existing npm and GitHub Actions dependency to the approved latest release while preserving the Astro site, TinaCMS build, and GitHub Pages deployment.

**Architecture:** Apply the npm dependency and CI runtime changes in one coordinated manifest/workflow update, regenerate the npm lockfile once, then validate compatibility through the existing production build and static-output smoke checks. No application source migration is expected because the project does not use the Astro 6/7 removed APIs, Svelte already uses Svelte 5 runes, Tailwind remains on v4, and current Tina configuration APIs remain supported.

**Tech Stack:** npm 10, Node.js 22.12+, Astro 7, Svelte 5, Tailwind CSS 4, TinaCMS 3, GitHub Actions Pages deployment

---

## File Map

- Create: `docs/superpowers/plans/2026-07-26-dependency-upgrade.md` — executable upgrade checklist and verification expectations.
- Modify: `package.json:5-22` — add Node engine requirement and update seven direct dependency ranges.
- Modify: `package-lock.json` — npm-generated direct and transitive resolution for the new manifest.
- Modify: `.github/workflows/deploy.yml:8-44` — add deployment permission, update Node, and bump four existing actions.
- Modify only if regenerated: `tina/tina-lock.json` — retain a Tina-generated schema lock update, never hand-edit it.
- Modify: `astro.config.mjs:1-21` — set `redirectToDefaultLocale` to `false` for Astro 7-compatible locale routing.
- Verify unchanged: `src/**/*.astro`, `src/**/*.svelte`, `src/**/*.ts`, `src/styles/global.css`, `tina/config.ts`.
- Planning artifact: `docs/superpowers/specs/2026-07-26-dependency-upgrade-design.md` — already corrected to record that `actions/configure-pages` is absent and will not be added.

No implementation commit is authorized. Leave changes in the working tree for user review.

### Task 1: Capture Baseline Behavior

**Files:**
- Verify: `package.json`
- Verify: `package-lock.json`
- Verify: `dist/` (gitignored build output)

- [ ] **Step 1: Confirm isolated, reviewable starting state**

Run:

```bash
git status --short
```

Expected: only approved planning-document changes are present. Stop before dependency work if unrelated source or configuration changes appear.

- [ ] **Step 2: Confirm local runtime meets the new minimum**

Run:

```bash
node --version
npm --version
```

Expected: Node.js `v22.12.0` or newer and npm `9.6.5` or newer. The observed local versions are Node.js `v22.14.0` and npm `10.9.2`.

- [ ] **Step 3: Reproduce the current lockfile install**

Run:

```bash
npm ci
```

Expected: exit code 0 with no `ERESOLVE` or engine error. This replaces `node_modules/` from the current lockfile but does not change tracked files.

- [ ] **Step 4: Establish the pre-upgrade production-build baseline**

Run:

```bash
TINA_BRANCH=master npm run build
```

Expected: `tinacms build && astro build` exits 0 and creates `dist/`, mirroring `.github/workflows/deploy.yml` and preventing the known local Tina `Missing branch` error caused by no usable local branch. Do not print ignored `.env` values or CI secrets while diagnosing build output.

- [ ] **Step 5: Confirm baseline route and Tina admin output**

Run:

```bash
test -f dist/index.html
test -f dist/en/index.html
test -f dist/ru/index.html
test -f dist/admin/index.html
```

Expected: every command exits 0.

- [ ] **Step 6: Confirm generated baseline output remains ignored**

Run:

```bash
git status --short
```

Expected: same tracked/untracked planning files shown in Step 1; no `dist/`, `.astro/`, `node_modules/`, `public/admin/index.html`, or `tina/__generated__/` entries.

### Task 2: Upgrade All npm Dependencies in One Shot

**Files:**
- Modify: `package.json:5-22`
- Modify: `package-lock.json`

- [ ] **Step 1: Record the failing pre-upgrade dependency check**

Run:

```bash
npm outdated --json
```

Expected: exit code 1 and entries for `@astrojs/svelte`, `@tailwindcss/vite`, `@tinacms/cli`, `astro`, `svelte`, `tailwindcss`, and `tinacms`.

- [ ] **Step 2: Replace the manifest with the approved target versions**

Update `package.json` to exactly:

```json
{
  "name": "hanter.md",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "npx tinacms dev -c \"astro dev\"",
    "build": "tinacms build && astro build",
    "preview": "astro preview"
  },
  "engines": {
    "node": ">=22.12.0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@astrojs/svelte": "^9.0.1",
    "@tailwindcss/vite": "^4.3.3",
    "@tinacms/cli": "^2.5.6",
    "astro": "^7.1.3",
    "svelte": "^5.56.8",
    "tailwindcss": "^4.3.3",
    "tinacms": "^3.11.0"
  }
}
```

- [ ] **Step 3: Resolve the complete target set and regenerate the lockfile**

Run:

```bash
npm install
```

Expected: exit code 0, no `ERESOLVE`, `package-lock.json` remains lockfile version 3, and its root package records `node >=22.12.0` plus all seven new ranges.

- [ ] **Step 4: Verify direct resolutions and peer compatibility**

Run:

```bash
npm ls --depth=0
```

Expected direct versions:

```text
@astrojs/svelte@9.0.1
@tailwindcss/vite@4.3.3
@tinacms/cli@2.5.6
astro@7.1.3
svelte@5.56.8
tailwindcss@4.3.3
tinacms@3.11.0
```

Expected: exit code 0 with no `invalid`, `missing`, or peer-dependency errors.

- [ ] **Step 5: Turn the dependency characterization check green**

Run:

```bash
npm outdated --json
```

Expected: exit code 0 and `{}`.

- [ ] **Step 6: Review manifest and lockfile scope**

Run:

```bash
git diff -- package.json package-lock.json
```

Expected: `package.json` contains only the engine and seven version changes; lockfile changes are npm-generated package resolutions with no application content.

### Task 3: Upgrade Existing GitHub Actions and CI Node

**Files:**
- Modify: `.github/workflows/deploy.yml:8-44`

- [ ] **Step 1: Confirm the workflow contains only four existing action dependencies**

Run:

```bash
rg -n "actions/(checkout|setup-node|configure-pages|upload-pages-artifact|deploy-pages)" .github/workflows/deploy.yml
```

Expected: checkout v4, setup-node v4, upload-pages-artifact v3, and deploy-pages v4. No configure-pages match appears.

- [ ] **Step 2: Apply the complete workflow update**

Replace `.github/workflows/deploy.yml` with:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  actions: read
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          TINA_CLIENT_ID: ${{ secrets.TINA_CLIENT_ID }}
          TINA_TOKEN: ${{ secrets.TINA_TOKEN }}
          TINA_BRANCH: master
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

`pages: write` and `id-token: write` satisfy deploy-pages requirements. `actions: read` is an explicit read-only workflow permission. Do not add `actions/configure-pages`; user explicitly chose to update existing dependencies only.

- [ ] **Step 3: Verify workflow diff and whitespace**

Run:

```bash
git diff --check
git diff -- .github/workflows/deploy.yml
```

Expected: no whitespace errors. Workflow diff contains one permission addition, Node 20 to 22, and these four action changes: v4 to v7, v4 to v7, v3 to v5, and v4 to v5.

### Task 4: Validate Astro 6/7 Compatibility Surface

**Files:**
- Modify: `astro.config.mjs:1-21` — expected diff is exactly `redirectToDefaultLocale: true` to `redirectToDefaultLocale: false`.
- Verify unchanged: `src/**/*.astro`
- Verify unchanged: `src/**/*.svelte`
- Verify unchanged: `src/**/*.ts`
- Verify unchanged: `src/styles/global.css`
- Verify unchanged: `tina/config.ts`
- Modify only if regenerated: `tina/tina-lock.json`

- [ ] **Step 1: Reproduce the Astro 7 routing configuration failure**

Run:

```bash
TINA_BRANCH=master npm run build
```

Expected RED result: Astro 7 build fails because `prefixDefaultLocale: false` is combined with `redirectToDefaultLocale: true`.

- [ ] **Step 2: Apply the minimal Astro config migration**

Change only `astro.config.mjs`:

```diff
-      redirectToDefaultLocale: true,
+      redirectToDefaultLocale: false,
```

Keep `src/**/*.astro`, `src/**/*.svelte`, `src/**/*.ts`, `src/styles/global.css`, and `tina/config.ts` unchanged. The Astro config diff must contain only this boolean change.

- [ ] **Step 3: Confirm removed and deprecated Astro APIs remain absent**

Run:

```bash
rg -n "Astro\.glob|astro:schema|astro:transitions|@astrojs/db|getContainerRenderer|ASSETS_PREFIX" src astro.config.mjs
```

Expected: no output and exit code 1. The project uses direct JSON imports, `astro:i18n`, `astro:middleware`, and ordinary Svelte integration APIs that remain supported.

- [ ] **Step 4: Confirm reserved routing and Markdown migrations do not apply**

Run:

```bash
test ! -e src/fetch.ts
rg --files src -g "*.md" -g "*.mdx"
```

Expected: `test` exits 0; `rg` prints nothing and exits 1. No advanced-routing filename collision or Markdown processor configuration is present.

- [ ] **Step 5: Check Astro templates for v7 inline-whitespace risk**

Run:

```bash
rg -n -U "</(a|abbr|b|em|i|label|small|span|strong)>\\s*<(a|abbr|b|em|i|label|small|span|strong)" src -g "*.astro"
```

Expected: no output and exit code 1. Leave `compressHTML` unset because no adjacent inline-element text depends on Astro 6 whitespace insertion.

- [ ] **Step 6: Build with migrated Astro config**

Run:

```bash
TINA_BRANCH=master npm run build
```

Expected GREEN result: TinaCMS generation and Astro 7 Rust compilation both exit 0, mirroring `.github/workflows/deploy.yml` and preventing the known local Tina `Missing branch` error caused by no usable local branch. On any compiler or peer failure, stop speculative edits and invoke the `systematic-debugging` skill using the first exact error before continuing this plan.

- [ ] **Step 7: Confirm source, Tina config, and migration scope**

Run:

```bash
git diff -- astro.config.mjs src tina/config.ts
git diff --check
```

Expected: only `astro.config.mjs` differs, with exactly `true` to `false`; `src/` and `tina/config.ts` have no diff and whitespace check passes.

- [ ] **Step 8: Inspect Tina schema-lock behavior**

Run:

```bash
git status --short -- tina/tina-lock.json
git diff -- tina/tina-lock.json
```

Expected: no change. If upgraded Tina build regenerates this tracked file, retain only generated schema-lock update and do not hand-edit one-line JSON.

### Task 5: Smoke-Test Static Output and Base Path

**Files:**
- Verify: `dist/index.html`
- Verify: `dist/en/index.html`
- Verify: `dist/ru/index.html`
- Verify: `dist/admin/index.html`

- [ ] **Step 1: Confirm all expected output entry points exist**

Run:

```bash
test -f dist/index.html
test -f dist/en/index.html
test -f dist/ru/index.html
test -f dist/admin/index.html
```

Expected: every command exits 0.

- [ ] **Step 2: Confirm locale documents retain language metadata**

Run:

```bash
rg -F 'lang="ro"' dist/index.html
rg -F 'lang="en"' dist/en/index.html
rg -F 'lang="ru"' dist/ru/index.html
```

Expected: each command finds one matching `<html>` element.

- [ ] **Step 3: Confirm localized titles survive compilation**

Run:

```bash
rg -F 'Hanter.md — Covorașe auto premium' dist/index.html
rg -F 'Hanter.md — Premium car mats' dist/en/index.html
rg -F 'Hanter.md — Премиум автоковрики' dist/ru/index.html
```

Expected: each command finds its localized title.

- [ ] **Step 4: Confirm repository base-path URLs remain in generated pages**

Run:

```bash
rg -F '/hanter.md/' dist/index.html
rg -F '/hanter.md/' dist/en/index.html
rg -F '/hanter.md/' dist/ru/index.html
```

Expected: every page contains generated asset or navigation URLs rooted at `/hanter.md/`.

### Task 6: Run Final Clean Verification

**Files:**
- Verify: `package.json`
- Verify: `package-lock.json`
- Verify: `.github/workflows/deploy.yml`
- Verify: all final tracked changes

- [ ] **Step 1: Prove the new lockfile installs cleanly**

Run:

```bash
npm ci
```

Expected: exit code 0 with no engine, resolution, or peer error.

- [ ] **Step 2: Rebuild from the clean install**

Run:

```bash
TINA_BRANCH=master npm run build
```

Expected: exit code 0 and successful TinaCMS plus Astro production output, mirroring `.github/workflows/deploy.yml` and preventing the known local Tina `Missing branch` error caused by no usable local branch.

- [ ] **Step 3: Reconfirm direct dependencies are current and valid**

Run:

```bash
npm outdated --json
npm ls --depth=0
```

Expected: `npm outdated` prints `{}` and exits 0; `npm ls` reports the seven target direct versions without errors.

- [ ] **Step 4: Check security advisories without forcing dependency changes**

Run:

```bash
npm audit --audit-level=high
```

Expected: exit code 0 with no high or critical advisory. If npm reports an advisory, capture `npm audit --json`, report the affected transitive chain, and do not run `npm audit fix --force` or downgrade a requested latest direct dependency.

- [ ] **Step 5: Confirm no project validation scripts were omitted**

Run:

```bash
npm pkg get scripts
```

Expected: only `dev`, `build`, and `preview`. No repository-defined format, lint, typecheck, or test command is available.

- [ ] **Step 6: Run repository-level diff checks**

Run:

```bash
git diff --check
git status --short
git diff --stat
git diff -- package.json package-lock.json .github/workflows/deploy.yml tina/tina-lock.json
```

Expected implementation changes: `package.json`, `package-lock.json`, and `.github/workflows/deploy.yml`; `tina/tina-lock.json` appears only if Tina regenerated it. Planning docs may also appear. No `src/`, content, secret, build-output, or unrelated configuration change is allowed.

- [ ] **Step 7: Stop for user review without committing**

Present verification evidence and final changed-file list. Do not stage or commit implementation changes unless the user explicitly requests it.
