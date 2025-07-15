# 📋 MedPro Dashboard Markdown Standard

## 🎯 Purpose
This document defines the **EXACT** markdown format required for the MedPro Tasks Dashboard parser. Any deviation from this format will cause parsing failures.

**⚠️ CRITICAL: Follow this format EXACTLY - the parser is strict and will fail silently on format violations.**

---

## 📊 Required Header Section

```markdown
# 📋 MedPro - Consolidated Tasks Tracking
**Master Control Document for All Ongoing Development**

**Last Updated:** YYYY-MM-DD (HH:MM)  
**Status:** [Status Description]  
**Current Focus:** [Current Focus Area]  
**Total Active Tasks:** [NUMBER]
```

**Rules:**
- `**Last Updated:**` must be followed by space and date
- `**Total Active Tasks:**` must be followed by space and number
- All lines must end with exactly 2 spaces then newline

---

## 📈 Required Stats Section

```markdown
### 📊 Status Overview
- 🔴 **Critical Blockers:** [NUMBER] items
- 🟡 **High Priority:** [NUMBER] items
- 🟢 **Medium Priority:** [NUMBER] items
- 🔵 **Low Priority:** [NUMBER] items
```

**Rules:**
- Must use exact emoji and text: `🔴 **Critical Blockers:**`
- Must end with ` items` (note the space before "items")
- No parenthetical comments (like "down from X") - parser ignores them
- Each line starts with `- ` (dash + space)

---

## 🚨 Critical Tasks Section Format

```markdown
## 🚨 CRITICAL BLOCKERS

### 1. [Task Title]
**Status:** [STATUS]
**File:** `[file/path.ext]`
**Problem:** [Problem description]
**Impact:** [Impact description]

### 2. [Task Title]
**Status:** [STATUS]
**File:** `[file/path.ext]`
**Problem:** [Problem description]
**Impact:** [Impact description]

---
```

**CRITICAL RULES:**
1. **Section Header**: Must be exactly `## 🚨 CRITICAL BLOCKERS`
2. **Task Headers**: Must follow pattern `### [NUMBER]. [Title]`
3. **Field Format**: `**FieldName:** [value]` (no trailing spaces)
4. **Required Fields**: Status, File, Problem, Impact (in that order)
5. **File Format**: Must be wrapped in backticks: `` `path/file.ext` ``
6. **Termination**: Section must end with `---` on its own line
7. **Spacing**: Single empty line between tasks, no trailing whitespace

**FORBIDDEN:**
- ❌ Extra fields like `**Missing:**`, `**Tasks:**`
- ❌ Trailing spaces after field values
- ❌ Multiple sections within critical tasks
- ❌ Nested lists or bullet points
- ❌ Different section names (like "REMAINING CRITICAL BLOCKERS")

---

## 🎉 Achievements Section Format

```markdown
## 🎉 MAJOR ACHIEVEMENTS (Just Completed)

### 1. ✅ [Achievement Title] (COMPLETED)
**Status:** ✅ FULLY RESOLVED
**File:** `[documentation/file.md]`
**Achievement:** [Description of what was completed]
**Solutions Delivered:**
- ✅ [Solution 1]
- ✅ [Solution 2]
- ✅ [Solution 3]

### 2. ✅ [Achievement Title] (COMPLETED)
[Same format as above]
```

**Rules:**
- Use `✅` emoji for completed items
- Status must include `✅` emoji
- Solutions list uses `- ✅ ` prefix

---

## 📱 Module Sections Format

```markdown
## 📱 [MODULE NAME]

### [Priority Icon] [Task Title]
**Status:** [STATUS]
**File:** `[file/path]`
**Problem:** [Description]
**Impact:** [Impact]
```

**Supported Priority Icons:**
- 🔴 Critical
- 🟡 High Priority  
- 🟢 Medium Priority
- 🔵 Low Priority
- ✅ Completed

---

## 🔧 Parser Technical Requirements

### Regex Patterns Used
```javascript
// Header parsing
/\*\*Last Updated:\*\* (.+)/
/\*\*Total Active Tasks:\*\* (\d+)/

// Stats parsing  
/- 🔴 \*\*Critical Blockers:\*\* (\d+) items/
/- 🟡 \*\*High Priority:\*\* (\d+) items/
/- 🟢 \*\*Medium Priority:\*\* (\d+) items/
/- 🔵 \*\*Low Priority:\*\* (\d+) items/

// Critical section parsing
/## 🚨 CRITICAL BLOCKERS[\s\S]*?(?=##|---)/
/### \d+\. (.+?)\n[\s\S]*?(?=### \d+\.|##|---|\n\n##)/g

// Field parsing within tasks
/### \d+\. (.+?)\n/           // Title
/\*\*Status:\*\* (.+?)\n/    // Status
/\*\*File:\*\* `(.+?)`/      // File (in backticks)
/\*\*Problem:\*\* (.+?)\n/   // Problem
/\*\*Impact:\*\* (.+?)\n/    // Impact
```

### Required Terminators
- Critical tasks section: Must end with `---`
- Individual tasks: Must end with newline before next `###` or `---`
- Fields: Must end with newline (`\n`)

---

## ✅ Validation Checklist

Before updating the consolidated markdown file, verify:

- [ ] Header section follows exact format
- [ ] Stats section uses exact emoji and "items" suffix
- [ ] Critical tasks section named exactly `## 🚨 CRITICAL BLOCKERS`
- [ ] Each critical task has all 4 required fields (Status, File, Problem, Impact)
- [ ] File paths wrapped in backticks
- [ ] No trailing spaces on field lines
- [ ] Section ends with `---`
- [ ] No extra fields or nested content in critical tasks

---

## 🚨 Emergency Fixes

If dashboard shows parsing errors:

1. **Check console logs** for specific regex failures
2. **Verify exact spelling** of section headers and field names
3. **Remove any extra fields** from critical tasks
4. **Ensure proper line endings** (no trailing spaces)
5. **Validate emoji usage** (copy from this document)

---

**🔒 RULE: When in doubt, copy the exact format from this standard document. The parser is unforgiving!**