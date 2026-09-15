import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Button,
  Card,
  Chart,
  DataCard,
  Donut,
  GitHub,
  LaikitProvider,
  MDTitle,
  PageTitle,
  Quote,
  Segmented,
  Tooltip,
  WindowPanel,
  formatBytes,
  formatCompact,
  selectPluralMessage,
} from '../dist/index.js';

const render = (node, props = {}) => renderToStaticMarkup(h(LaikitProvider, props, node));

test('renders standalone links and delegates routing without introducing a wrapper', () => {
  assert.match(render(h(Card, { to: '/docs' }, 'Docs')), /href="\/docs"/);
  const linkComponent = ({ to, children, ...props }) =>
    h('a', { ...props, href: `/zh-Hans${to}`, 'data-router': 'host' }, children);
  const html = render(h(Card, { to: '/docs' }, 'Docs'), { linkComponent });
  assert.match(html, /^<a[^>]*href="\/zh-Hans\/docs"/);
  assert.match(html, /data-router="host"/);
});

test('heading adapter receives the original attributes and personal content is host-owned', () => {
  const headingComponent = ({ as, ...props }) => h(as, { ...props, 'data-heading': 'host' });
  assert.match(
    render(h(PageTitle, { title: 'Hello <em>world</em>', description: 'Text' }), {
      headingComponent,
    }),
    /Hello <em>world<\/em>/
  );
  const html = render(h(MDTitle, { title: 'About' }), { headingComponent });
  assert.match(html, /data-heading="host"/);
  assert.match(html, />About<\/h1>/);
  assert.doesNotMatch(html, /lailai|🎉/);
});

test('localized labels use provider overrides and plural rules', () => {
  assert.equal(selectPluralMessage(1, 'Country|Countries'), 'Country');
  assert.equal(selectPluralMessage(2, 'Country|Countries'), 'Countries');
  assert.equal(selectPluralMessage(2, '国家', 'zh-Hans'), '国家');
  assert.equal(selectPluralMessage(2, 'one|few|many|other', 'ru'), 'few');
  assert.match(
    render(h(DataCard, { value: 2, label: 'Country|Countries', icon: 'lucide:flag' })),
    /Countries/
  );
  assert.match(
    render(h(DataCard, { value: 2, label: 'value', icon: 'lucide:flag' }), {
      selectMessage: () => '国家',
    }),
    /国家/
  );
  assert.match(
    render(h(Quote, { author: 'Author' }, 'Text'), { messages: { quoteAttributionDash: 'By ' } }),
    /By /
  );
  assert.match(render(h(Quote, { author: '作者' }, '正文'), { locale: 'zh-Hans' }), /——/);
});

test('nested providers inherit routing and localization', () => {
  const linkComponent = ({ to, ...props }) =>
    h('a', { ...props, href: to, 'data-router': 'outer' });
  const html = render(
    h(LaikitProvider, { messages: { other: '其余' } }, h(Card, { to: '/test' }, 'Test')),
    { locale: 'zh-Hans', linkComponent }
  );
  assert.match(html, /data-router="outer"/);
});

test('controls preserve disabled state, accessible names, and roving tab order', () => {
  assert.match(render(h(Button, { disabled: true }, 'Save')), /disabled=""/);
  const html = render(
    h(Segmented, {
      value: 'b',
      ariaLabel: 'View',
      items: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ],
    })
  );
  assert.match(html, /role="radiogroup" aria-label="View"/);
  assert.match(html, /aria-checked="false" tabindex="-1"/);
  assert.match(html, /aria-checked="true" tabindex="0"/);
  const navigation = render(
    h(Segmented, { value: 'a', items: [{ value: 'a', label: 'A', href: '/a' }] })
  );
  assert.match(navigation, /href="\/a"/);
  assert.match(navigation, /aria-current="page"/);
  assert.doesNotMatch(navigation, /role="radio"/);
});

test('charts distinguish loading, empty, error, and successful data', () => {
  const props = { title: 'Visitors', type: 'bar', data: [], emptyText: 'Empty dataset' };
  assert.match(render(h(Chart, props)), /Empty dataset/);
  assert.match(
    render(h(Chart, { ...props, error: 'Offline', errorAction: h(Button, null, 'Retry') })),
    /Offline.*Retry/s
  );
  assert.doesNotMatch(render(h(Chart, { ...props, loading: true })), /Empty dataset/);
  const html = render(
    h(Chart, { ...props, data: [{ key: 'a', value: 12, tooltipLabel: 'January' }] })
  );
  assert.match(html, /<caption>Visitors<\/caption>/);
  assert.match(html, /<th scope="row">January<\/th><td>12<\/td>/);
});

test('donut folds the long tail and uses the localized other label', () => {
  const html = render(
    h(Donut, {
      title: 'Browsers',
      icon: 'lucide:globe',
      maxSlices: 2,
      emptyText: 'Empty',
      items: [
        { x: 'A', y: 80 },
        { x: 'B', y: 15 },
        { x: 'C', y: 5 },
      ],
    }),
    { locale: 'zh-Hans' }
  );
  assert.match(html, /其他/);
  assert.match(html, /80\.0%/);
  assert.match(html, /20\.0%/);
});

test('server rendering browser-dependent components is safe', () => {
  assert.doesNotThrow(() => render(h(GitHub, { repo: 'lailai0916/laikit-ui' })));
  assert.match(
    render(h(Tooltip, null, h(Tooltip.Label, null, 'Label'), h(Tooltip.Value, null, '42'))),
    /Label.*42/s
  );
  assert.doesNotThrow(() =>
    render(
      h(WindowPanel, {
        tabs: [{ label: 'Tab', content: 'Body' }],
        collapseLabel: 'Collapse',
        expandLabel: 'Expand',
      })
    )
  );
});

test('formatters retain the website numeric contract', () => {
  assert.equal(formatCompact(1250, 'en'), '1.25K');
  assert.equal(formatCompact(NaN), '–');
  assert.equal(formatBytes(1536), '1.50 KB');
});

test('published files are framework-neutral and retain client boundaries', async () => {
  const entries = await readdir('dist', { recursive: true });
  for (const entry of entries.filter((entry) => /\.(js|css|d\.ts)$/.test(entry))) {
    const content = await readFile(`dist/${entry}`, 'utf8');
    assert.doesNotMatch(content, /@site\/|@docusaurus\/|@theme\/|--ifm-/, entry);
    if (entry.endsWith('.js')) assert.match(content, /^"use client";/, entry);
  }
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.deepEqual(pkg.files, ['dist']);
  assert.ok(pkg.peerDependencies.react);
  assert.ok(!pkg.dependencies.react);
  assert.deepEqual(pkg.sideEffects, ['**/*.css']);
  await readFile('dist/theme.css');
  await readFile('dist/styles.css');
  await readFile('dist/index.d.ts');
});
