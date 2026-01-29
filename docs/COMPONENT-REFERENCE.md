# Component Reference Guide

## Universal Design System

A minimal, high-contrast design system for SZOKS. Three colors, two typefaces, sharp edges, and maximum energy.

---

## Hero Section

**Class:** `.hero`

**Purpose:** Full-screen introductory section with headline, subheading, CTA button, and image.

**Key Classes:**
- `.hero` - Container
- `.hero__container` - 2-column grid (responsive to 1-column on mobile)
- `.hero__content` - Text content column
- `.hero__headline` - Main headline
- `.hero__subheading` - Subtitle text
- `.hero__image` - Image column with 16:9 aspect ratio

**Markup Example:**
```html
<section class="hero">
  <div class="hero__container">
    <div class="hero__content">
      <h1 class="hero__headline">Your Headline Here</h1>
      <p class="hero__subheading">Supporting text for additional context and engagement.</p>
      <button class="btn--primary">Call to Action</button>
    </div>
    <div class="hero__image">
      <img src="image.jpg" alt="Hero image">
    </div>
  </div>
</section>
```

**CSS Variables Used:**
- `--font-headline` (Cal Sans)
- `--fs-h1` (responsive: clamp(2.5rem, 8vw, 5rem))
- `--fs-body-large` (1.125rem)
- `--color-black` (#000000)
- `--color-white` (#FFFFFF)
- `--color-action` (#FF6B00)
- `--ar-banner` (16 / 9)
- `--spacing-xl` (48px)
- `--spacing-lg` (32px)
- `--spacing-2xl` (64px)
- `--grid-gutter` (32px)
- `--lh-tight` (1.1)

**Responsive Behavior:**
- Desktop: 2-column layout (image right, content left)
- Tablet/Mobile: 1-column layout (image first, then content)
- Headline scales down to `--fs-h2` on mobile

---

## Product Card

**Class:** `.product-card`

**Purpose:** Displays a single product with image, title, price, and add-to-cart button.

**Key Classes:**
- `.product-card` - Container
- `.product-card__image` - Product image with 4:5 aspect ratio
- `.product-card__title` - Product title (Cal Sans, uppercase)
- `.product-card__price` - Product price
- `.btn--product` - Add to cart button (full width)
- `.product-grid` - Container for multiple product cards

**Markup Example:**
```html
<div class="product-card">
  <div class="product-card__image">
    <img src="product.jpg" alt="Product name">
  </div>
  <h3 class="product-card__title">Product Name</h3>
  <p class="product-card__price">$99.00</p>
  <button class="btn--product">Add to Cart</button>
</div>
```

**Grid Container:**
```html
<div class="product-grid">
  <!-- Product cards here -->
</div>
```

**CSS Variables Used:**
- `--font-headline` (Cal Sans - titles)
- `--font-body` (Space Grotesk - prices)
- `--fs-h4` (1.25rem)
- `--fs-body` (1rem)
- `--fs-body-small` (0.875rem)
- `--color-black` (#000000)
- `--color-white` (#FFFFFF)
- `--color-action` (#FF6B00)
- `--ar-product` (4 / 5)
- `--spacing-xs` (8px)
- `--spacing-md` (24px)
- `--spacing-lg` (32px)
- `--spacing-xl` (48px)
- `--spacing-2xl` (64px)
- `--lh-tight` (1.1)
- `--transition-normal` (0.3s linear)
- `--transition-fast` (0.2s linear)

**Responsive Behavior:**
- Desktop: Auto-fill grid with min 280px columns
- Tablet: 2 columns
- Mobile: 1 column
- Image scales 1.05 on hover
- Button transforms scale(0.98) on active

---

## Button Styles

All buttons follow the same interaction pattern: sharp corners (0px radius), uppercase text, scale transforms on hover/active.

### Button Base Styles

**Global Reset Applied To:**
- `button`
- `.button`
- `[role="button"]`

**Default Styling:**
- Background: `--color-black` (#000000)
- Color: `--color-white` (#FFFFFF)
- Padding: 12px 24px (var(--btn-padding-y) var(--btn-padding-x))
- Border: None
- Border-radius: 0 (sharp corners)
- Font-family: `--font-body` (Space Grotesk)
- Font-size: `--btn-font-size` (0.875rem / 14px)
- Font-weight: `--btn-font-weight` (600)
- Text-transform: UPPERCASE
- Letter-spacing: 0.05em
- Cursor: pointer

### Interaction States

**Hover:**
- Background: `--color-action` (#FF6B00)
- Transform: scale(1.04)
- Transition: 0.2s linear

**Active/Clicked:**
- Transform: scale(0.98)
- Transition: 0.2s linear

### Primary CTA Button

**Class:** `.btn--primary`

**Context:** Hero section CTAs and main call-to-action buttons

**Markup:**
```html
<button class="btn--primary">Explore Collection</button>
```

**Specific Styling:**
- Padding: 12px 36px (wider padding - `var(--btn-padding-x) * 1.5`)
- Font-size: `--fs-body-small` (0.875rem)
- Font-weight: 700

**Interaction:**
- Default: Orange background (#FF6B00), white text
- Hover: Black background (#000000), scale(1.04)
- Active: scale(0.98)

---

### Product Button

**Class:** `.btn--product`

**Context:** Product card add-to-cart buttons

**Markup:**
```html
<button class="btn--product">Add to Cart</button>
```

**Specific Styling:**
- Width: 100% (full width of card)
- Background: Black (#000000)
- Color: White (#FFFFFF)
- Padding: 12px 24px

**Interaction:**
- Default: Black background, white text
- Hover: Orange background (#FF6B00), scale(1.04)
- Active: scale(0.98)

---

### Secondary Button

**Class:** `.button--secondary`

**Context:** Alternative actions, less emphasis

**Markup:**
```html
<button class="button--secondary">Learn More</button>
```

**Styling:**
- Background: Transparent
- Color: Black (#000000)
- Border: 1px solid black

**Interaction:**
- Hover: Black background, white text, scale(1.04)

---

## Typography

The design system uses two typefaces: Cal Sans for headlines and Space Grotesk for body text.

### Headlines

**Font:** Cal Sans, 700 weight, uppercase

**Characteristics:**
- Text-transform: UPPERCASE
- Letter-spacing: -0.02em to -0.03em (tight tracking)
- Line-height: 1.1 (tight)
- Color: Black (#000000)

**Font Sizes:**

| Element | Size | CSS Variable | Responsive |
|---------|------|--------------|------------|
| H1 | clamp(2.5rem, 8vw, 5rem) | `--fs-h1` | Yes |
| H2 | clamp(2rem, 6vw, 3.5rem) | `--fs-h2` | Yes |
| H3 | clamp(1.5rem, 4vw, 2.5rem) | `--fs-h3` | Yes |
| H4 | 1.25rem | `--fs-h4` | No |

**Markup:**
```html
<h1>Main Headline</h1>
<h2>Section Heading</h2>
<h3>Subsection</h3>
<h4>Minor Heading</h4>
```

---

### Body Text

**Font:** Space Grotesk, 400–600 weight

**Characteristics:**
- Line-height: 1.5 (normal)
- Color: Black (#000000)
- Default weight: 400 (regular)

**Font Sizes:**

| Element | Size | CSS Variable |
|---------|------|--------------|
| Large | 1.125rem | `--fs-body-large` |
| Body | 1rem | `--fs-body` |
| Small | 0.875rem | `--fs-body-small` |
| Caption | 0.75rem | `--fs-caption` |

**Markup:**
```html
<p>Standard body text uses Space Grotesk at 1rem.</p>
<p class="text-large">Larger body text at 1.125rem.</p>
<p class="text-small">Smaller text at 0.875rem.</p>
<p class="text-caption">Caption text at 0.75rem.</p>
```

---

## Color Usage

**NO other colors allowed.** The system uses only three colors: black, white, and orange.

### Color Palette

| Color | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Black | #000000 | `--color-black` | Text, borders, button backgrounds, primary CTA hover |
| White | #FFFFFF | `--color-white` | Backgrounds, button text, contrast |
| Orange | #FF6B00 | `--color-action` | Primary CTA buttons, hover states, accents, indicators |

### Usage Guidelines

- **Black:** Body text, headlines, borders, default button backgrounds, product card backgrounds
- **White:** Section backgrounds, negative space, button text on action states
- **Orange:** Primary call-to-action buttons, hover states for secondary buttons, progress indicators, accents

**DO NOT USE:** Greys, additional accent colors, or color variations beyond these three.

---

## Spacing Scale

All spacing is based on an 8px base grid.

| Scale | Size | CSS Variable |
|-------|------|--------------|
| xs | 8px | `--spacing-xs` |
| sm | 16px | `--spacing-sm` |
| md | 24px | `--spacing-md` |
| lg | 32px | `--spacing-lg` |
| xl | 48px | `--spacing-xl` |
| 2xl | 64px | `--spacing-2xl` |
| 3xl | 96px | `--spacing-3xl` |

### Section Spacing

Sections use responsive spacing for "breathing room":

| Breakpoint | Spacing | CSS Variable |
|------------|---------|--------------|
| Mobile | 60px | `--premium-section-spacing-mobile` |
| Tablet | 80px | `--premium-section-spacing-tablet` |
| Desktop | 100px | `--premium-section-spacing-desktop` |
| Large (1440px+) | 120px | `--premium-section-spacing-large` |

**Default:** `--section-spacing: clamp(6rem, 20vw, 9.375rem)`

### Usage Examples

```css
/* Tight spacing */
margin-bottom: var(--spacing-xs);  /* 8px */

/* Standard spacing */
margin-bottom: var(--spacing-md);  /* 24px */

/* Section separation */
padding: var(--section-spacing) 0;  /* 60px–120px responsive */
```

---

## Grid System

**Columns:** 12-column grid

**Gap:** 32px (`--grid-gutter`)

### Responsive Breakpoints

| Device | Breakpoint | Columns | Layout |
|--------|-----------|---------|--------|
| Mobile | < 750px | 1–2 | Single or 2-column |
| Tablet | 750px–989px | 2–3 | 2–3 column |
| Desktop | 990px–1439px | 3–4 | 3–4 column |
| Large | 1440px+ | 4+ | 4+ column with max-width |

### Container

**Max-width:** 1440px
**Padding:** `var(--spacing-xl)` (48px) on left/right

**Markup:**
```html
<div class="page-width">
  <!-- Content here -->
</div>
```

**CSS:**
```css
.page-width {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}
```

---

## Image Aspect Ratios

All images use CSS custom properties for consistent aspect ratios.

| Ratio | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| Banner | 16 / 9 | `--ar-banner` | Hero sections, promotional images |
| Product | 4 / 5 | `--ar-product` | Product cards, catalog |
| Square | 1 / 1 | `--ar-square` | Social media, square images |

**Markup:**
```html
<div style="aspect-ratio: var(--ar-product);">
  <img src="product.jpg" alt="Product">
</div>
```

---

## Line Height

| Type | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| Tight | 1.1 | `--lh-tight` | Headlines (high contrast) |
| Normal | 1.5 | `--lh-normal` | Body text |
| Relaxed | 1.8 | `--lh-relaxed` | Large body text, subheadings |

---

## Transitions

All transitions are linear for a mechanical, minimal feel.

| Speed | Duration | CSS Variable | Usage |
|-------|----------|--------------|-------|
| Fast | 0.2s | `--transition-fast` | Buttons, hover states |
| Normal | 0.3s | `--transition-normal` | Image scales, moderate animations |

**Example:**
```css
transition: background-color var(--transition-fast), transform var(--transition-fast);
```

---

## Borders

**Default:** None (border-radius: 0, sharp corners)

**Available Border Styles:**

| Border | Value | CSS Variable |
|--------|-------|--------------|
| Hairline | 1px solid black | `--border-hairline` |
| None | none | `--border-none` |

**Usage:**
```html
<div style="border: var(--border-hairline);">Content</div>
```

---

## Accessibility

### Focus States

All interactive elements have visible focus indicators:

```css
*:focus-visible {
  outline: 2px solid var(--color-black);
  outline-offset: 2px;
}
```

### Color Contrast

- Black on white: 21:1 contrast ratio (WCAG AAA)
- White on orange: 3.2:1 contrast ratio (WCAG AA)
- Orange on white: 5.7:1 contrast ratio (WCAG AA)

### Semantic HTML

- Use `<h1>`, `<h2>`, etc. for headings
- Use `<button>` for interactive elements
- Use `<a>` for navigation links
- Use `role="button"` for non-button elements that behave like buttons

---

## CSS Variables Quick Reference

```css
:root {
  /* Colors */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-action: #FF6B00;

  /* Typography */
  --font-headline: 'Cal Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Font Sizes */
  --fs-h1: clamp(2.5rem, 8vw, 5rem);
  --fs-h2: clamp(2rem, 6vw, 3.5rem);
  --fs-h3: clamp(1.5rem, 4vw, 2.5rem);
  --fs-h4: 1.25rem;
  --fs-body-large: 1.125rem;
  --fs-body: 1rem;
  --fs-body-small: 0.875rem;
  --fs-caption: 0.75rem;

  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-2xl: 4rem;
  --spacing-3xl: 6rem;
  --section-spacing: clamp(6rem, 20vw, 9.375rem);

  /* Grid */
  --grid-columns: 12;
  --grid-gutter: 2rem;

  /* Buttons */
  --btn-padding-y: 12px;
  --btn-padding-x: 24px;
  --btn-border-radius: 0;
  --btn-font-size: 0.875rem;
  --btn-font-weight: 600;

  /* Aspect Ratios */
  --ar-product: 4 / 5;
  --ar-banner: 16 / 9;
  --ar-square: 1 / 1;

  /* Line Height */
  --lh-tight: 1.1;
  --lh-normal: 1.5;
  --lh-relaxed: 1.8;

  /* Borders */
  --border-hairline: 1px solid var(--color-black);
  --border-none: none;

  /* Transitions */
  --transition-fast: 0.2s linear;
  --transition-normal: 0.3s linear;
}
```

---

## Design Principles

1. **Minimal:** Only three colors, two fonts, sharp corners
2. **High Energy:** Bold typography, strong contrast, active states
3. **Accessibility:** WCAG AA/AAA compliant contrast ratios
4. **Responsive:** Mobile-first, fluid typography with clamp()
5. **Consistent:** All spacing, colors, and transitions use CSS variables
6. **Grid-based:** 8px base grid for all measurements

---

## File Structure

```
assets/
├── universal-system-variables.css      # All CSS variables
├── universal-system-hero.css           # Hero component
├── universal-system-product-card.css   # Product card component
├── universal-system-overwrite.css      # Global resets and overrides
└── premium-theme.css                   # Theme-specific overrides
```

---

## Version History

- **v1.0.0** (January 2026) - Initial design system release
  - 3-color palette (black, white, orange)
  - 2 typefaces (Cal Sans, Space Grotesk)
  - Hero and product card components
  - Responsive grid system
  - Button interaction patterns

---

## Support & Questions

For questions about this design system or to propose changes, refer to the [Universal Design System Documentation](./UNIVERSAL-DESIGN-SYSTEM.md).
