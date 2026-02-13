# ReactFlo Brand Guidelines

_Version 1.0 - January 2026_

## 🎯 Brand Overview

**ReactFlo** is a declarative workflow builder framework that empowers developers to create custom workflow applications using TypeScript decorators, React Flow for UI, and a complete execution engine with JSON serialization.

**Core Principle:** _"We build the how, you focus on the what."_

**Brand Personality:** Developer-first, Declarative, Professional, Innovative

---

## 🎨 Logo & Visual Identity

### Primary Logo

The ReactFlo logo consists of a connected node network pattern representing workflow connections and data flow.

**Logo Variants:**

- **Primary**: Blue square with white nodes
- **Secondary**: Green square with white nodes
- **Monochrome**: Black nodes on white background
- **Reverse**: White nodes on dark background

### Logo Usage Rules

**✅ DO:**

- Use the logo at minimum 24px height for digital
- Maintain clear space equal to the height of one node around the logo
- Use the appropriate variant for the background
- Ensure high contrast between logo and background

**❌ DON'T:**

- Stretch, skew, or distort the logo
- Use the logo smaller than 24px height
- Place the logo on busy backgrounds
- Modify the node arrangement or colors

### Clear Space

Maintain a clear space around the logo equal to the height of one node circle (approximately 20% of the logo height).

---

## 🎨 Color Palette

### Primary Colors

**ReactFlo Blue**

- Hex: `#2563eb`
- RGB: 37, 99, 235
- Usage: Primary brand color, CTAs, links, primary logo

**ReactFlo Green**

- Hex: `#10b981`
- RGB: 16, 185, 129
- Usage: Success states, secondary brand color, accents

### Secondary Colors

**Neutral Gray**

- Hex: `#6b7280`
- RGB: 107, 114, 128
- Usage: Body text, secondary information

**Dark Gray**

- Hex: `#374151`
- RGB: 55, 65, 81
- Usage: Headers, primary text, high emphasis

**Light Gray**

- Hex: `#f9fafb`
- RGB: 249, 250, 251
- Usage: Background, subtle sections

### Accent Colors

**Error Red**

- Hex: `#ef4444`
- RGB: 239, 68, 68
- Usage: Error states, validation messages

**Warning Orange**

- Hex: `#f59e0b`
- RGB: 245, 158, 11
- Usage: Warning states, pending actions

**Code Purple**

- Hex: `#8b5cf6`
- RGB: 139, 92, 246
- Usage: Code syntax highlighting, decorators

---

## 📝 Typography

### Primary Typeface: Inter

- **Usage**: Headings, UI elements, body text
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Fallback**: system-ui, -apple-system, BlinkMacSystemFont, sans-serif

### Code Typeface: JetBrains Mono

- **Usage**: Code samples, decorators, technical content
- **Weights**: 400 (Regular), 500 (Medium), 700 (Bold)
- **Fallback**: 'Fira Code', 'Monaco', 'Cascadia Code', monospace

### Typography Scale

```
H1: 2.25rem (36px) - Bold - 1.2 line height
H2: 1.875rem (30px) - Semibold - 1.3 line height
H3: 1.5rem (24px) - Semibold - 1.4 line height
H4: 1.25rem (20px) - Medium - 1.5 line height
Body: 1rem (16px) - Regular - 1.6 line height
Small: 0.875rem (14px) - Regular - 1.5 line height
Code: 0.875rem (14px) - JetBrains Mono - 1.6 line height
```

---

## 🗣️ Voice & Tone

### Brand Voice Characteristics

**Developer-First**

- Technical but approachable
- Assumes familiarity with React/TypeScript
- Focuses on practical implementation

**Declarative**

- Emphasizes "what" over "how"
- Clear, direct communication
- Structured and logical

**Professional**

- Reliable and trustworthy
- Enterprise-ready messaging
- Serious about quality

**Innovative**

- Forward-thinking approach
- Embraces modern development practices
- Not afraid to challenge conventions

### Tone Guidelines

**Documentation**: Clear, instructional, comprehensive
**Marketing**: Confident, benefit-focused, technical
**Social Media**: Engaging, helpful, community-focused
**Error Messages**: Helpful, specific, solution-oriented

### Key Messaging

**Primary Value Prop:**
_"Build custom workflow applications with the power of TypeScript decorators and React Flow - focus on your business logic while ReactFlo handles the execution."_

**Key Benefits:**

- Type-safe workflow definitions
- Visual workflow builder
- JSON serialization
- React Flow integration
- Decorator-based simplicity

---

## 🎯 Brand Applications

### Website & Documentation

**Header Style:**

- ReactFlo logo + wordmark on left
- Navigation with ReactFlo Blue links
- Clean, minimal design with lots of whitespace

**Content Style:**

- Inter typography throughout
- Code samples with syntax highlighting
- ReactFlo Blue for primary actions
- Consistent spacing using 8px grid

### GitHub & Social Media

**GitHub Profile:**

- Logo as avatar (circular crop works well)
- Consistent README styling
- Code examples with brand colors

**Social Media Profiles:**

- Logo as profile picture
- ReactFlo Blue in cover images
- Consistent bio: "Declarative workflow builder for React developers"

### Marketing Materials

**Presentations:**

- Dark theme with ReactFlo Blue accents
- Node network patterns as backgrounds
- Consistent typography scale

**Blog Posts:**

- Hero images with node patterns
- Code samples with proper syntax highlighting
- ReactFlo brand colors for emphasis

---

## 🔧 Technical Specifications

### CSS Custom Properties

```css
:root {
  /* Colors */
  --reactflo-blue: #2563eb;
  --reactflo-green: #10b981;
  --reactflo-gray: #6b7280;
  --reactflo-dark: #374151;
  --reactflo-light: #f9fafb;
  --reactflo-red: #ef4444;
  --reactflo-orange: #f59e0b;
  --reactflo-purple: #8b5cf6;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing (8px grid) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
}
```

### Tailwind CSS Configuration

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        reactflo: {
          blue: '#2563eb',
          green: '#10b981',
          gray: '#6b7280',
          dark: '#374151',
          light: '#f9fafb',
          red: '#ef4444',
          orange: '#f59e0b',
          purple: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
};
```

---

## 📱 Asset Library

### Logo Files Needed

- `reactflo-logo.svg` - Primary logo (vector)
- `crystalflow-logo-blue.png` - Blue version (1024x1024)
- `reactflo-logo-green.png` - Green version (1024x1024)
- `reactflo-logo-mono.png` - Monochrome (1024x1024)
- `crystalflow-icon.svg` - Icon only (vector)
- `favicon.ico` - Favicon (32x32, 16x16)

### Social Media Assets

- Twitter/X header: 1500x500px
- LinkedIn cover: 1584x396px
- GitHub social preview: 1200x630px
- Open Graph images: 1200x630px

### Documentation Assets

- Hero images with node patterns
- Feature illustrations
- Code syntax highlighting themes
- Diagram templates

---

## ✅ Brand Checklist

Before publishing any ReactFlo content, verify:

- [ ] Logo used correctly with proper clear space
- [ ] Colors match brand palette exactly
- [ ] Typography uses Inter/JetBrains Mono
- [ ] Voice matches brand personality
- [ ] Messaging emphasizes declarative approach
- [ ] Technical accuracy maintained
- [ ] Consistent spacing (8px grid)
- [ ] High contrast for accessibility
- [ ] Brand assets are high quality

---

## 📞 Brand Contact

For questions about brand usage or to request additional assets:

- **Team**: Fladeed
- **Project**: ReactFlo
- **Repository**: github.com/fladeed-org/reactflo
- **Guidelines Version**: 1.0 (January 2026)

---

_These guidelines ensure consistent ReactFlo branding across all touchpoints while maintaining the developer-first, declarative identity that makes ReactFlo unique in the workflow automation space._
