# Nue-Inspired Design System Approach

This document explores an alternative approach to CSS architecture inspired by Nue.js design system principles. This approach favors semantic components over utility classes and is fundamentally different from Tailwind's utility-first philosophy.

---

## Philosophy: Semantic Components vs Utility Classes

### Core Principles

* **Design system constraints**: Limited color palette and consistent spacing scale for visual coherence
* **Semantic component approach**: Prioritize reusable semantic components over utility classes
* **Standards-first methodology**: Leverage CSS layers, custom properties, and modern CSS features
* **Accessibility-driven design**: ARIA-aware styling and semantic HTML structure
* **Minimal utility coupling**: Clean HTML structure separated from styling concerns

---

## CSS Layers Architecture

Following Nue's 6-layer system for maximum control and predictability:

```css
/* app.css - Main entry point */
@layer settings, structure, components, adjustments, screens, overrides;

@import "./settings.css" layer(settings);
@import "./structure.css" layer(structure);
@import "./components.css" layer(components);
@import "./adjustments.css" layer(adjustments);
@import "./screens.css" layer(screens);
@import "./overrides.css" layer(overrides);
```

### Layer Responsibilities

1. **Settings**: Design tokens, theme variables, global reset
2. **Structure**: Layout foundation (body, header, main, footer)
3. **Components**: Reusable UI components with semantic class names
4. **Adjustments**: Context-specific component tweaks
5. **Screens**: Responsive design overrides
6. **Overrides**: Final layer for exceptions (use sparingly)

---

## Constrained Design System

### settings.css - Design Tokens

```css
@layer settings {
  :root {
    /* Constrained color system - 5 core colors maximum */
    --color-accent: oklch(0.5 0.2 250);
    --color-accent-secondary: oklch(0.6 0.15 200);
    --color-foreground: oklch(0.1 0 0);
    --color-background: oklch(0.98 0 0);
    --color-muted: oklch(0.6 0.05 250);

    /* Typography system */
    --font-family-base: "Inter", ui-sans-serif, system-ui, sans-serif;
    --font-family-mono: "JetBrains Mono", ui-monospace, monospace;

    /* Mathematical spacing progression */
    --spacing-unit: 1rem;
    --spacing-xs: calc(var(--spacing-unit) * 0.25);
    --spacing-sm: calc(var(--spacing-unit) * 0.5);
    --spacing-md: var(--spacing-unit);
    --spacing-lg: calc(var(--spacing-unit) * 1.5);
    --spacing-xl: calc(var(--spacing-unit) * 2);
  }

  /* Minimal global reset */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  button, input, select, textarea {
    font: inherit;
  }
}
```

---

## Semantic Component Examples

### HTML Structure: Clean and Semantic

```html
<!-- ✅ Semantic approach: Decoupled structure and styling -->
<div class="notification card">
  <h3>ChitChat</h3>
  <p>New message</p>
</div>

<!-- ✅ Semantic accordion -->
<details class="accordion">
  <summary>Section Title</summary>
  <div class="accordion-content">
    <p>Content here</p>
  </div>
</details>

<!-- ✅ Semantic navigation -->
<nav aria-label="Main navigation">
  <ul class="nav-list">
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

### components.css - Semantic Components

```css
@layer components {
  /* Card component with variants */
  .card {
    padding: var(--spacing-md);
    border: 1px solid var(--color-muted);
    border-radius: 0.5rem;
    background: var(--color-background);

    &.notification {
      background: url(/icons/bell.svg) var(--spacing-sm) center no-repeat;
      background-size: 1.5rem;
      padding-left: calc(var(--spacing-xl) + var(--spacing-sm));
    }
  }

  /* Button with ARIA-driven states */
  .btn {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 0.25rem;
    font-weight: 500;
    border: 1px solid transparent;
    transition: all 0.2s;
    cursor: pointer;

    &.primary {
      background: var(--color-accent);
      color: var(--color-background);

      &:hover {
        opacity: 0.9;
      }
    }

    &[aria-pressed="true"] {
      background: var(--color-accent-secondary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  /* Accordion using native HTML elements */
  .accordion {
    border: 1px solid var(--color-muted);
    border-radius: 0.5rem;

    summary {
      padding: var(--spacing-md);
      cursor: pointer;
      font-weight: 500;
    }

    .accordion-content {
      padding: 0 var(--spacing-md) var(--spacing-md);
    }
  }

  /* Navigation with semantic structure */
  .nav-list {
    display: flex;
    gap: var(--spacing-md);
    list-style: none;
    margin: 0;
    padding: 0;

    a {
      color: var(--color-accent);
      text-decoration: none;
      padding: var(--spacing-sm);

      &[aria-current="page"] {
        color: var(--color-foreground);
        font-weight: 500;
      }

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
```

---

## Accessibility-First Patterns

### ARIA-Driven Styling

```css
@layer components {
  /* Form components with validation states */
  .form-group {
    margin-bottom: var(--spacing-md);

    label {
      display: block;
      margin-bottom: var(--spacing-xs);
      font-weight: 500;
      color: var(--color-foreground);
    }

    input, textarea, select {
      width: 100%;
      padding: var(--spacing-sm);
      border: 1px solid var(--color-muted);
      border-radius: 0.25rem;

      &:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }

      &[aria-invalid="true"] {
        border-color: #dc2626;

        &:focus {
          outline-color: #dc2626;
        }
      }
    }
  }

  /* Skip to content link */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-accent);
    color: var(--color-background);
    padding: var(--spacing-sm);
    text-decoration: none;
    border-radius: 0.25rem;

    &:focus {
      top: 6px;
    }
  }
}
```

---

## Responsive Design with Layers

### screens.css - Media Query Organization

```css
@layer screens {
  @media (max-width: 768px) {
    body {
      padding: var(--spacing-sm);
    }

    .card {
      padding: var(--spacing-sm);
    }

    .btn {
      width: 100%;
      text-align: center;
    }
  }

  @media (min-width: 1024px) {
    .card {
      padding: var(--spacing-lg);
    }
  }

  /* Accessibility media queries */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media (prefers-contrast: high) {
    .card {
      border-width: 2px;
    }

    .btn {
      border-width: 2px;
      border-style: solid;
    }
  }
}
```

---

## When to Use This Approach

### Ideal Use Cases

- **Content-focused websites**: Blogs, documentation sites, marketing pages
- **Design system consistency**: Projects requiring strict visual coherence
- **Accessibility-first projects**: Applications with strong a11y requirements
- **Long-term maintenance**: Codebases that need to be maintained over years
- **Team collaboration**: Teams preferring semantic class names over utilities

### Advantages

- **Clean HTML**: Semantic structure without utility class bloat
- **Design constraints**: Limited palette prevents visual inconsistency
- **Accessibility**: ARIA-driven styling promotes better semantics
- **Maintainability**: Semantic components are easier to understand and modify
- **Performance**: Smaller HTML file sizes, efficient CSS caching

### Trade-offs

- **Less flexibility**: Harder to create one-off styles
- **More CSS**: Requires writing more custom CSS
- **Learning curve**: Teams need to understand component patterns
- **Build complexity**: Requires CSS layer support and organization

---

## Migration Strategy

If moving from utility-first to semantic approach:

1. **Identify common patterns**: Group repeated utility combinations into components
2. **Create design tokens**: Extract colors, spacing, and typography into CSS variables
3. **Build component library**: Convert utility patterns to semantic classes
4. **Implement layer organization**: Organize CSS using the 6-layer system
5. **Gradual adoption**: Migrate page by page or component by component

---

## Conclusion

This Nue-inspired approach represents a fundamentally different philosophy from Tailwind's utility-first methodology. It prioritizes semantic meaning, design constraints, and long-term maintainability over rapid prototyping and maximum flexibility.

Choose this approach when:
- Design consistency is paramount
- Long-term maintainability is crucial
- Accessibility is a primary concern
- Team prefers semantic over utility classes

The approach works best for content-focused applications, design systems, and projects where visual coherence and semantic meaning are more important than rapid iteration and maximum styling flexibility.
