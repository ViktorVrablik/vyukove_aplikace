# Design systém — Výukové aplikace

Sjednocená vizuální vrstva pro všechny stránky. Vzhled vychází z Notionu,
podporuje světlý i tmavý režim a je responzivní (kromě editoru diagramů,
který je záměrně jen pro počítač).

## Soubory

```
assets/
  tokens.css    barvy, typografie, odstupy, zaoblení, stíny — jediné místo pro změnu vzhledu
  style.css     reset, typografie, layout a komponenty (importuje tokens.css)
  theme.js      přepínání a ukládání světlého / tmavého režimu
  favicon.svg   ikona webu
```

Stránka načítá `style.css`, editor diagramů jen `tokens.css` (má vlastní layout).
V `<head>` každé stránky je krátký skript, který nastaví motiv ještě před
vykreslením, aby stránka neproblikla.

## Tokeny

Barvy nikdy nezapisuj natvrdo, vždy přes proměnnou.

| Skupina | Proměnné |
|---|---|
| Plochy | `--bg`, `--bg-sunken`, `--surface`, `--surface-raised`, `--surface-sunken` |
| Linky | `--border`, `--border-strong` |
| Text | `--text`, `--text-muted`, `--text-faint` |
| Akcent | `--accent`, `--accent-hover`, `--accent-soft`, `--accent-contrast` |
| Stavy | `--hover-bg`, `--active-bg`, `--selection` |
| Stíny | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| Barevná paleta | `--c-gray/brown/orange/yellow/green/blue/purple/pink/red` + `-bg` varianta |
| Odstupy | `--space-1` … `--space-16` (mřížka 4 px) |
| Zaoblení | `--radius-sm/md/lg/full` |
| Typografie | `--fs-xs` … `--fs-3xl`, `--font-sans`, `--font-mono` |

Staré názvy (`--bar-accent`, `--bar-sorted`, `--tag-math-bg`, `--hover`, …)
jsou zachovány jako aliasy, takže původní kód dál funguje.

Tmavý režim se definuje v `tokens.css` na `:root[data-theme="dark"]`
a zároveň v bloku `@media (prefers-color-scheme: dark)`, aby fungoval
i bez ručního přepnutí.

## Ikony

Všechny ikony pocházejí ze sady **[Feather](https://feathericons.com/)** (verze 4.29.2, licence MIT)
a jsou vloženy přímo do HTML jako inline SVG — žádná externí knihovna, žádné písmo,
funguje i po otevření souboru z disku.

```html
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- obsah ikony z feathericons.com -->
</svg>
```

| Třída | Použití |
|---|---|
| `.icon` | ikona v textu nebo v tlačítku, velikost 1,15 em, dědí barvu textu |
| `.icon--sm` | menší varianta (1 em) pro tabulky a popisky |
| `.icon--lg` | větší varianta (1,5 em) |
| `.icon--inline` | přidá vzduch okolo ikony uprostřed věty |
| `.page-icon` | velká ikona v záhlaví stránky (34 px) |
| `.card__icon` | ikona na kartě v rozcestníku (22 px) |

Novou ikonu přidáš tak, že z feathericons.com zkopíruješ SVG a doplníš `class="icon"`.
Ikona musí mít `aria-hidden="true"`, pokud stojí vedle textu; pokud je sama v tlačítku,
doplň `.visually-hidden` popisek.

Použité ikony: `book-open`, `hash`, `code`, `repeat`, `bar-chart-2`, `share-2`, `zap`,
`arrow-left/right/up/down`, `moon`, `sun`, `play`, `pause`, `square`, `skip-forward`,
`refresh-cw`, `activity`, `grid`, `crosshair`, `disc`, `zoom-in`, `zoom-out`, `maximize`,
`trash-2`, `edit-2`, `corner-up-left`, `help-circle`, `x`, `play-circle`, `stop-circle`,
`git-branch`, `message-square`, `download`, `upload`, `image`, `file-text`, `file`,
`camera`, `music`, `film`, `monitor`.

## Komponenty

| Třída | Popis |
|---|---|
| `.page` | obsahový sloupec (max 960 px) |
| `.site-header`, `.breadcrumb`, `.subtitle`, `.page-emoji` | hlavička stránky |
| `.btn` + `--primary`, `--solid`, `--danger`, `--ghost`, `--sm`, `--lg`, `--icon` | tlačítka |
| `.tabs` + `.tab` | záložky (starý název `.filter-bar` / `.filter-btn` funguje dál) |
| `.tab-content` | panel záložky, aktivní má třídu `active` |
| `.card`, `.card-grid`, `.card-title`, `.card-desc` | karty |
| `.tag` + barevné varianty | štítky |
| `.callout` + `--info`, `--warn`, `--success`, `--danger` | zvýrazněné bloky (staré `.info-box`, `.alert-box` fungují) |
| `.table-wrap` + `.notion-table` | tabulka se scrollem na úzkých obrazovkách |
| `.controls-bar`, `.control-group` | lišta s ovládáním |
| `.panel`, `.legend`, `.feedback`, `.result-overlay`, `.steps-box` | pomocné bloky |
| `.site-footer` | patička |

## Pravidla

- **Tabulky** vždy obal do `.table-wrap`, jinak na mobilu přetečou.
- **Barva nesmí být jediným nosičem informace** — doplň legendu (`.legend`) nebo text.
- **Stav při ovládání klávesnicí** řeší globální `:focus-visible`, nepřepisuj ho.
- **Záložky** mají `role="tablist"` / `role="tab"` a ovládají se šipkami.
- **Kreslení do canvasu** ber barvy z CSS proměnných a překresluj na událost
  `themechange`, kterou vysílá `theme.js`.
- Breakpointy: 560 / 640 / 720 / 760 / 900 px.
- **Ikony** ber jen ze sady Feather, ať zůstane jednotná tloušťka tahu i optická velikost.
  Matematické symboly (`↔`, `≈`, `⊕`) ikony nejsou a zůstávají jako text.

## Kontrast

Všechny dvojice text/pozadí splňují WCAG 2.1 AA (≥ 4,5:1) ve světlém
i tmavém režimu; akcentní plochy a rámečky nejméně 3:1.
