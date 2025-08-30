# Guidelines for Tailwind CSS v4 Projects
*Layer-First Architecture Implementation Guide*

## **Core Implementation Patterns**

**For standard Tailwind features**, refer to context7 `/context7/tailwindcss` documentation.

### **Layer-First Deviations from Standard Tailwind:**
- **Semantic design token bridge**: `:root` variables + `@theme` integration
- **Strategic component extraction**: 3+ repetition rule
- **Explicit layer organization**: purpose-driven file separation

---

## **1. File Structure & Import Pattern**

```
/styles
├── app.css           # Layer imports
├── theme.css         # :root + @theme bridge
├── base.css          # Element defaults
├── components/       # Component extractions
│   ├── index.css     # Component imports
│   └── button.css    # Individual components
└── utilities.css     # Custom utilities
```

### **app.css Template**
```css
@layer theme, base, components, utilities;

@import 'tailwindcss/theme' layer(theme);
@import 'tailwindcss/preflight' layer(base);
@import 'tailwindcss/utilities' layer(utilities);

@import "./theme.css" layer(theme);
@import "./base.css" layer(base);
@import "./components/index.css" layer(components);
@import "./utilities.css" layer(utilities);

@custom-variant dark (&:where(.dark, .dark *));
@plugin "@tailwindcss/forms";
```

---

## **2. Semantic Design Token Bridge Pattern**

### **theme.css - Unique Pattern**
```css
:root {
    --foreground: oklch(0.15 0.01 270);
    --background: oklch(0.99 0.002 270);
    --primary: oklch(0.55 0.18 262);
    --muted: oklch(0.55 0.03 270);

    @variant dark {
        --foreground: oklch(0.95 0.01 270);
        --background: oklch(0.05 0.002 270);
        --primary: oklch(0.7 0.15 262);
        --muted: oklch(0.45 0.02 270);
    }
}

@theme {
    --color-primary: var(--primary);
    --color-foreground: var(--foreground);
    --color-background: var(--background);
    --color-muted: var(--muted);
}
```

**Why**: Semantic variables work across frameworks, `@theme` generates Tailwind utilities automatically.

---

## **3. Layer Content Organization**

### **base.css**
```css
html { @apply scroll-smooth; }
body { @apply bg-background text-foreground font-sans; }
button, input, select, textarea { font: inherit; }
```

### **components/index.css**
```css
@import "./button.css";
@import "./card.css";
@import "./form.css";
```

### **components/button.css** (no `@layer` wrapper)
```css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
  @apply focus:outline-2 focus:outline-offset-2;

  &.btn-primary {
    @apply bg-primary text-white hover:bg-primary/90 focus:outline-primary;
  }
}
```

### **utilities.css**
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}
```

---

## **4. Component Extraction Rule**

**3+ Repetition Pattern:**
1. **First use**: Write with utilities
2. **Second use**: Copy pattern
3. **Third use**: Extract to component

**Important**: Modifier classes (e.g., `btn-primary`, `btn-secondary`, `badge-success`) are variations of the same component and do NOT count as separate repetitions. Only extract when the **base pattern** appears 3+ times.

```html
<!-- Before extraction -->
<button class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:outline-2 focus:outline-primary transition-colors">
  Primary Button
</button>

<!-- After extraction -->
<button class="btn btn-primary">Primary Button</button>
```

**Example of what counts as repetition:**
- ✅ Three different elements using `px-4 py-2 rounded-lg font-medium` pattern
- ❌ `btn btn-primary`, `btn btn-secondary`, `btn btn-outline` (same component, different modifiers)

---

## **5. Decision Matrix**

| Use Case | Solution | Layer |
|----------|----------|-------|
| Design tokens | `:root` + `@theme` bridge | theme |
| Element defaults | Traditional CSS + `@apply` | base |
| 3+ repeated patterns | `@apply` extraction | components |
| One-off utilities | Custom CSS | utilities |
| Project variants | `@custom-variant` | app.css |

---

## **References**

- **Tailwind CSS**: Use context7 `/context7/tailwindcss` for Tailwind CSS features
- **CSS**: Use context7 `/mdn/content` for standard CSS features

---

*This guide covers only layer-first patterns that deviate from standard Tailwind CSS documentation.*
