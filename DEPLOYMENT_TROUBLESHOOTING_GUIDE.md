# Deployment Troubleshooting Guide

## Overview
This document outlines common deployment issues encountered during Vercel deployments and their solutions. Keep this file in your project root to quickly resolve similar issues in future developments.

## Common Deployment Errors

### 1. Missing Component Exports

**Error Pattern:**
```
Attempted import error: 'ComponentName' is not exported from '@/components/ui/component-file'
```

**Root Cause:**
- Component exists in file but not exported with the expected name
- Barrel export inconsistencies

**Solutions:**
```typescript
// Option 1: Add alias export
const Progress = ProgressBar;
export { ProgressBar, Progress };

// Option 2: Rename component to match import
export const Progress = () => { ... };

// Option 3: Update import to match actual export
import { ProgressBar as Progress } from '@/components/ui/progress';
```

**Prevention:**
- Always verify export names match import expectations
- Use consistent naming conventions across components
- Implement proper barrel exports (index.ts files)

### 2. Icon-Related Issues

#### 2a. Lucide React Icon Import Errors

**Error Pattern:**
```
Attempted import error: 'IconName' is not exported from '__barrel_optimize__?names=...lucide-react'
```

**Root Cause:**
- Icon doesn't exist in lucide-react library
- Barrel optimization conflicts
- Version mismatches

**Solutions:**
```typescript
// Replace non-existent icons with alternatives
import { Fire } from 'lucide-react';     // ❌ May not exist
import { Flame } from 'lucide-react';    // ✅ Common alternative

// Verify icon exists at: https://lucide.dev/icons/
```

#### 2b. Custom Icon Component Typos

**Error Pattern:**
```
Type error: Property 'download' does not exist on type 'Icons'. Did you mean 'downlaod'?
```

**Root Cause:**
- Typos in icon object property names
- Inconsistent naming between import and export

**Solutions:**
```typescript
// ❌ Problematic - typo in property name
export const Icons = {
  downlaod: Download,  // Typo: should be "download"
};

// ✅ Fixed
export const Icons = {
  download: Download,
};

// ❌ Usage that will fail
<Icons.download className="h-4 w-4" />

// ✅ Usage that works after fix
<Icons.download className="h-4 w-4" />
```

**Prevention:**
- Use consistent naming conventions
- Run TypeScript checks regularly
- Use IDE autocomplete to avoid typos
- Check lucide.dev before using icons
- Use common, well-established icon names
- Keep lucide-react updated to latest version

### 3. TypeScript Component Interface Errors

**Error Pattern:**
```
Type error: Property 'className' does not exist on type 'IntrinsicAttributes & ComponentProps'.
Type error: This JSX tag's 'children' prop expects type 'never'
```

**Root Cause:**
- Missing props in component interfaces
- Incorrect type inheritance for components
- Component not accepting required props like `className` or `children`

**Solutions:**
```typescript
// ❌ Problematic - missing className prop
interface ProgressBarProps {
  value: number;
  color?: IColor;
  animated?: boolean;
}

// ✅ Fixed - added className prop
interface ProgressBarProps {
  value: number;
  color?: IColor;
  animated?: boolean;
  className?: string;
}

// ❌ Problematic - children type conflict
interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  // HTMLAttributes includes children, causing conflicts
}

// ✅ Fixed - exclude children and redefine
interface ComponentProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  children?: React.ReactNode;
}
```

**Additional TypeScript Fixes:**
```typescript
// Fix Stripe API version error
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil', // Use latest supported version
});

// Fix comparison type errors by ensuring all cases are covered
const severityConfig = ['low', 'medium', 'high'] as const;
// Ensure all values exist in your data

// Fix i18n configuration missing locale
return {
  locale: locale as string, // Explicit type casting
  messages: (await import(`./messages/${locale}.json`)).default,
  // ... other config
};
```

**Prevention:**
- Always include common props like `className` and `children` in component interfaces
- Use `Omit` utility type to exclude conflicting inherited props
- Run `npx tsc --noEmit` before deployment
- Keep dependencies updated to latest compatible versions

### 4. React Unescaped Entities

**Error Pattern:**
```
Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`. react/no-unescaped-entities
Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`. react/no-unescaped-entities
```

**Root Cause:**
- Raw quotes and apostrophes in JSX text content
- React requires HTML entity encoding for special characters

**Solutions:**
```jsx
// ❌ Problematic
<p>Don't use raw apostrophes</p>
<p>"Avoid raw quotes"</p>

// ✅ Fixed
<p>Don&apos;t use raw apostrophes</p>
<p>&quot;Avoid raw quotes&quot;</p>

// ✅ Alternative - Use curly braces for dynamic content
<p>{"Don't use raw apostrophes"}</p>
<p>{`"Avoid raw quotes"`}</p>
```

**Character Replacements:**
| Character | HTML Entity | Description |
|-----------|-------------|-------------|
| `'`       | `&apos;`    | Apostrophe  |
| `"`       | `&quot;`    | Quote       |
| `'`       | `&lsquo;`   | Left quote  |
| `'`       | `&rsquo;`   | Right quote |
| `"`       | `&ldquo;`   | Left dquote |
| `"`       | `&rdquo;`   | Right dquote|

**Prevention:**
- Configure ESLint rule for early detection
- Use template literals for complex text
- Consider using a text linter in your IDE

## Pre-Deployment Checklist

### 1. Component Verification
```bash
# Check for missing exports
grep -r "import.*from '@/components" src/ | while read line; do
  # Extract component names and verify exports exist
done

# Verify all imported components exist
npm run build 2>&1 | grep "Attempted import error"
```

### 2. Icon Audit & Verification
```bash
# Comprehensive icon audit script
# Step 1: Extract all icon usage from codebase
grep -ro "Icons\.\w\+" ./src | sed 's/.*Icons\.//' | sort | uniq > used-icons.txt

# Step 2: Extract available icons from Icons component
grep -o "\w\+:" ./src/components/ui/icons.tsx | sed 's/:$//' | sort > available-icons.txt

# Step 3: Find missing icons
comm -23 used-icons.txt available-icons.txt > missing-icons.txt

# Step 4: Check for problematic lucide icons
grep -r "from 'lucide-react'" src/ | grep -E "(Fire|Flame|etc)"

# Step 5: Verify TypeScript compilation
npx tsc --noEmit --skipLibCheck 2>&1 | grep -i "Property.*does not exist.*Icons"
```

### 3. Entity Validation
```bash
# Find unescaped entities
grep -r "['\"]" src/ --include="*.tsx" --include="*.jsx" | grep -v "className\|href\|src="
```

### 4. Build Testing
```bash
# Always test build before deployment
npm run build
npm run lint
npm run typecheck # if available
```

## ESLint Configuration

Add these rules to prevent future issues:

```json
// .eslintrc.json
{
  "rules": {
    "react/no-unescaped-entities": "error",
    "import/no-unresolved": "error",
    "@typescript-eslint/no-unused-imports": "error"
  }
}
```

## Automated Fixes

### Script for Entity Fixes
```bash
#!/bin/bash
# fix-entities.sh
find src/ -name "*.tsx" -o -name "*.jsx" | xargs sed -i \
  -e "s/Don't/Don\&apos;t/g" \
  -e "s/You'll/You\&apos;t/g" \
  -e "s/We're/We\&apos;re/g" \
  -e "s/Here's/Here\&apos;s/g" \
  -e "s/What's/What\&apos;s/g"
```

### Pre-commit Hook
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run build"
    }
  }
}
```

## IDE Extensions

**VS Code Extensions:**
- ESLint - Catches unescaped entities
- Auto Import - ES6, TS, JSX, TSX - Prevents import errors
- Lucide Icons - Icon autocomplete and validation

## Platform-Specific Notes

### Vercel
- Strict ESLint enforcement during build
- Barrel optimization can affect imports
- Build failures stop deployment

### Netlify
- Similar ESLint requirements
- May have different icon handling

### Self-hosted
- Configure build pipeline to match platform requirements
- Test locally with production build settings

## Icon Audit Automation Script

Save this as `audit-icons.sh` in your project root:

```bash
#!/bin/bash
echo "🔍 Starting comprehensive icon audit..."

# Extract all icon usage
echo "📊 Extracting icon usage from codebase..."
grep -ro "Icons\.\w\+" ./src | sed 's/.*Icons\.//' | sort | uniq > used-icons.txt
echo "Found $(wc -l < used-icons.txt) unique icon references"

# Extract available icons
echo "📋 Checking available icons in component..."
grep -o "\w\+:" ./src/components/ui/icons.tsx | sed 's/:$//' | grep -v "sun\|moon\|star\|twitter\|close\|spinner" | sort > available-icons.txt
echo "Found $(wc -l < available-icons.txt) available icons"

# Find missing icons
echo "❌ Finding missing icons..."
comm -23 used-icons.txt available-icons.txt > missing-icons.txt

if [ -s missing-icons.txt ]; then
  echo "🚨 Missing icons found:"
  cat missing-icons.txt
  echo ""
  echo "💡 Add these to your Icons component:"
  echo "// In imports:"
  while IFS= read -r icon; do
    capitalized=$(echo "${icon^}" | sed 's/.*/\u&/')
    echo "  $capitalized,"
  done < missing-icons.txt
  echo ""
  echo "// In Icons object:"
  while IFS= read -r icon; do
    capitalized=$(echo "${icon^}" | sed 's/.*/\u&/')
    echo "  $icon: $capitalized,"
  done < missing-icons.txt
  exit 1
else
  echo "✅ All icons are available!"
fi

# Cleanup
rm -f used-icons.txt available-icons.txt missing-icons.txt
echo "🎉 Icon audit completed successfully!"
```

## Quick Reference Commands

```bash
# Run comprehensive icon audit
./audit-icons.sh

# Find and fix common issues
npm run lint --fix
npm run build
grep -r "&apos;" src/  # Verify entity fixes
grep -r "from 'lucide-react'" src/ # Check icon imports

# Check TypeScript compilation for icon errors
npx tsc --noEmit --skipLibCheck 2>&1 | grep -i "Property.*does not exist.*Icons"
```

## Troubleshooting Workflow

1. **Build locally first**: `npm run build`
2. **Check specific error types**: Import vs. Entity vs. Icon
3. **Apply targeted fixes**: Use solutions above
4. **Verify fix**: Re-run build
5. **Test deployment**: Deploy to staging/preview
6. **Document new patterns**: Update this guide

---

**Created:** $(date)
**Last Updated:** $(date)
**Project:** Jazila Bazar
**Platform:** Vercel

> Keep this file updated with new deployment issues and solutions encountered during development.