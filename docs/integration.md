# Integration

## Package boundaries

The package supports React 18.3.1 and 19, with ESM JavaScript and TypeScript declarations.
React and React DOM are peer dependencies. Iconify and clsx are runtime dependencies.
Import `theme.css`, then `styles.css`, once in your application. JavaScript entries preserve
module boundaries so bundlers can remove unused components; the shared stylesheet contains all
component styles. Extracting a package reduces duplicated source maintenance, not necessarily the
browser download size.

Root exports are named. Most component subpaths export a default component; `Page` exports
`PageHeader`, `PageTitle`, and `PageContent`, and `Markdown` exports `MDTitle`.
`Tooltip.Label` and `Tooltip.Value` are compound children. Prop declarations ship in `dist/`;
the complete working examples are in `demo/main.tsx`.

## Host routing and translation

Without a provider, links use native anchors and headings use native heading elements. A provider
can supply the host's components. For example, Docusaurus hosts can define this adapter locally:

```tsx
import DocusaurusLink from '@docusaurus/Link';
import DocusaurusHeading from '@theme/Heading';
import { LaikitProvider, type LinkProps, type HeadingProps } from '@lailai0916/ui';

function SiteLink({ to, href, ...props }: LinkProps) {
  return <DocusaurusLink {...props} to={to ?? href} />;
}

function SiteHeading(props: HeadingProps) {
  return <DocusaurusHeading {...props} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LaikitProvider locale="en" linkComponent={SiteLink} headingComponent={SiteHeading}>
      {children}
    </LaikitProvider>
  );
}
```

Supply the current host locale instead of a fixed string in a multilingual site. `locale="zh-Hans"`
selects Chinese defaults; `messages` can override individual built-in labels. `selectMessage`
can delegate plural handling to a host. The default selector accepts pipe-separated forms in
`zero | one | two | few | many | other` order, including only categories used by the locale.
Single-form labels pass through unchanged. Provider nesting inherits unspecified configuration;
changing the locale selects that locale's default messages. Providers add no DOM wrapper.

## Theme and base styles

Use `data-theme="light"` or `data-theme="dark"` on the document root. With no explicit root theme,
colors follow `prefers-color-scheme`. Prefer document-wide theme selection; nested mixed themes
are not a supported isolation boundary. User styles should follow the package imports.

```css
html {
  font-family: var(--lk-font-family);
  font-size: var(--lk-font-size);
  line-height: var(--lk-line-height);
}

body {
  margin: 0;
  color: var(--lk-font-color-base);
  background: var(--lk-background-color);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  --lk-color-primary: #1d9bf0;
}
```

No global reset is included. A Docusaurus host should map `--lk-*` color variables to its live
`--ifm-*` variables after the imports, using `:root, :root[data-theme]` specificity. This preserves
runtime accent changes and font preferences. Shadows and focus rings are shared theme tokens.
Modern CSS features such as `color-mix`, container queries, and backdrop filters require modern
browsers. The reduced-motion rule targets the package's prefixed CSS Module classes.

## Component contracts

- `Card` supplies a surface; `TitleCard` adds a header (`md`, `sm`, or `plain`). Use plain `Card`
  when there is no title. Cards deliberately do not clip focus rings; a full-bleed child may need
  a clipping wrapper owned by the caller.
- `Chart` receives preformatted time-series labels and numeric values. `Donut` receives `{x, y}`
  items; `maxSlices` groups a long tail into the configurable Other slice. `loading`, empty data,
  `error`, and retained-data `notice` remain separate states. Pass accessible empty/error labels.
- `Segmented` button mode uses radio semantics, roving tab order, and arrow keys. Items with `href`
  navigate instead of calling `onChange`. Do not mix navigation and radio items in one group.
  Horizontal groups stack at 480 px, or 360 px with `stackAt={360}`.
- `WindowPanel` owns tabs and collapse behavior. Supply translated collapse/expand labels;
  content and optional toolbar belong to the caller.
- `GitHub` fetches public GitHub repository metadata in the browser; API failures and rate limits
  render a localized error. Iconify may load icon data over the network. Other components take data
  from the host and do not need application credentials.
- `MDTitle` accepts React content and has no personal greeting logic. `PageTitle` retains the original
  HTML title contract for existing hosts: pass only trusted application-authored title strings,
  never untrusted user HTML.

## Server rendering

Imports and server rendering do not access the browser unguarded. Each emitted JavaScript module
retains a `use client` directive for React frameworks with server component boundaries. Interactive
components and providers belong in a client boundary; pass serializable data across the server/client
boundary and define router adapter functions inside that client module. Import global CSS from the
framework's supported application entry. A provider itself has no browser-only DOM wrapper.

Use identical locale and initial values for server rendering and hydration. Browser-dependent
content such as image status, measurements, and GitHub data updates after mount. Hosts should load
saved preferences before paint using their own established mechanism.
