# Portfolio Layout Structure

## Overview
The portfolio now uses a proper flexbox layout with isolated z-index scopes per component.

## Layout Hierarchy

```
#root (flex column)
  └── .app-container (flex column, min-height: 100vh)
      ├── Header (flex-shrink: 0, z-index: 100)
      ├── .main-content (flex: 1 0 auto, z-index: 1)
      │   └── Page Components
      │       ├── HomePage
      │       ├── AboutPage
      │       ├── ResumePage
      │       ├── BlogListPage
      │       └── etc.
      └── Footer (flex-shrink: 0, margin-top: auto)
```

## Z-Index Hierarchy

### Header Component (z-index: 100-102)
- `.modern-header`: 100
- `.header-container`, `.logo`: 101
- `.mobile-menu-btn`: 102 (highest priority)
- `.mobile-nav`: 99
- `.mobile-overlay`: 98

### Page Content (z-index: 1-20)
- `.main-content`: 1
- Page containers: 1-2
- Page elements: 1-20 (local scope)

### Modals & Overlays (z-index: 9000+)
- Modal backdrop: 9000
- Modal: 9001
- Toast notifications: 9500

## Key Features

1. **Proper Flexbox Layout**
   - Header and Footer don't shrink
   - Main content fills available space
   - Footer sticks to bottom

2. **Isolated Z-Index**
   - Each component manages its own z-index
   - No global z-index variables
   - Simple, predictable stacking

3. **Performance Optimizations**
   - `contain: layout style` on major sections
   - `isolation: isolate` on app-container
   - Minimal repaints and reflows

4. **Mobile Responsive**
   - Consistent padding across breakpoints
   - Touch-friendly button sizes (44px minimum)
   - Proper mobile menu functionality

## File Structure

```
src/
├── App.tsx (main layout wrapper)
├── index.css (app-container, main-content styles)
├── components/
│   ├── common/
│   │   ├── Header.tsx/css (z-index: 100-102)
│   │   └── Footer.tsx/css (no z-index needed)
│   └── sections/
│       ├── HomePage.tsx/css (z-index: 1-20)
│       ├── AboutPage.tsx/css (z-index: 1-20)
│       ├── ResumePage.tsx/css (z-index: 1-20)
│       └── BlogListPage.tsx/css (z-index: 1-20)
└── styles/
    └── variables.css (colors, typography, spacing only)
```

## Benefits

✅ Clean separation of concerns
✅ No z-index conflicts
✅ Better performance
✅ Mobile-friendly
✅ Easy to maintain
✅ Predictable layout behavior
