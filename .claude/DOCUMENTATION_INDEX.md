# Documentation Index - 2048 Game Project

## 📚 Project Documentation Map

This index helps you navigate the project documentation. Choose your starting point based on your needs.

---

## 🎯 Quick Start by Role

### 👨‍💻 Developer (Implementing Features)
1. Read **CLAUDE.md** - Project guidelines
2. Read **SRC_ARCHITECTURE.md** - Understand code structure
3. Read **README.md** - Setup instructions
4. Start coding in `src/`

### 🤖 Agent/Automation Developer
1. Read **CLAUDE.md** - Understand ADW requirements
2. Read **ADW_QUICK_REFERENCE.md** - ADW command reference
3. Read **adws/README.md** - Detailed ADW system
4. Modify ADW workflows in `adws/`

### 📋 Project Manager / Issue Tracker
1. Read **README.md** - Project overview
2. Read **PROJECT_STRUCTURE.md** - File organization
3. Check **specs/** - Issue specifications
4. Monitor **agents/** - ADW progress

### 🧪 QA / Tester
1. Read **SRC_ARCHITECTURE.md** - Feature locations
2. Check **.claude/commands/e2e/** - E2E test specs
3. Run tests: `npm test` and `npm run test:e2e`
4. Review test results in `agents/[id]/test/`

### 📖 Documentation Writer
1. Read **PROJECT_STRUCTURE.md** - What exists
2. Read **SRC_ARCHITECTURE.md** - How it works
3. Update **README.md** - User-facing docs
4. Maintain **CLAUDE.md** - Developer guides

---

## 📖 Documentation Files Overview

### Core Project Documentation

| File | Purpose | Audience | Read Time |
|------|---------|----------|-----------|
| **README.md** | Project overview, getting started | Everyone | 5 min |
| **CLAUDE.md** | Claude Code instructions ⭐ **IMPORTANT** | Developers | 10 min |
| **SETUP.md** | Detailed setup instructions | New developers | 15 min |
| **PROJECT_STRUCTURE.md** | File organization & architecture | Developers | 15 min |
| **SRC_ARCHITECTURE.md** | Component & code structure | Developers | 20 min |
| **ADW_QUICK_REFERENCE.md** | ADW workflows quick reference | Agents/DevOps | 10 min |

### Supporting Documentation

| File | Purpose | Location |
|------|---------|----------|
| ADW System Details | Detailed ADW documentation | `adws/README.md` |
| E2E Test Specs | Automated test specifications | `.claude/commands/e2e/` |
| ADW Commands | Claude Code command definitions | `.claude/commands/` |
| Issue Specifications | Detailed issue breakdowns | `specs/` |

---

## 🗂️ Where to Find Things

### Configuration & Setup
```
Root Directory
├── package.json           → Dependencies & scripts
├── tsconfig.json          → TypeScript config
├── vite.config.ts         → Build configuration
├── vitest.config.ts       → Test configuration
├── vercel.json            → Deployment config
├── .env                   → Environment variables
└── .env.sample            → .env template
```

### Source Code
```
src/
├── game/                  → Game logic (2048 rules)
│   └── logic.ts          → Core algorithms
├── components/            → React UI components
│   ├── Game.tsx          → Main game board
│   ├── Tile.tsx          → Single tile display
│   └── PaletteSelector.tsx → Theme selector
├── themes/               → Theming system
│   ├── ThemeContext.tsx  → React context
│   └── palettes.ts       → Color definitions
└── App.tsx              → Root component
```

### ADW Workflows
```
adws/
├── adw_plan.py           → Planning phase
├── adw_build.py          → Build phase
├── adw_test.py           → Testing phase
├── adw_review.py         → Review phase
├── adw_document.py       → Documentation phase
├── adw_plan_build_test.py → Full workflow ⭐
└── adw_modules/          → Shared utilities
```

### Claude Code Configuration
```
.claude/
├── commands/             → Custom commands
│   ├── feature.md        → Feature workflow
│   ├── bug.md            → Bug fix workflow
│   ├── test.md           → Test command
│   └── e2e/              → E2E test specs
├── hooks/                → Tool automation
│   ├── pre_tool_use.py   → Before tool execution
│   └── post_tool_use.py  → After tool execution
└── settings.json         → Configuration
```

### Agent Execution
```
agents/
├── 6abf18ba/            → Agent workspace example
│   ├── plan/            → Planning phase output
│   ├── build/           → Build phase output
│   ├── test/            → Test phase output
│   └── review/          → Review phase output
└── [other agent IDs]/   → More workspaces
```

---

## 🔄 Reading Path by Topic

### Want to Understand the Game?
1. **SRC_ARCHITECTURE.md** - Component structure
2. **src/game/logic.ts** - Game logic
3. **src/components/Game.tsx** - Board rendering
4. **src/components/Tile.tsx** - Tile display

### Want to Understand ADW System?
1. **CLAUDE.md** - Overview
2. **ADW_QUICK_REFERENCE.md** - Quick commands
3. **adws/README.md** - Detailed documentation
4. **adws/adw_modules/** - Implementation details

### Want to Add a New Feature?
1. **CLAUDE.md** - Review guidelines
2. **PROJECT_STRUCTURE.md** - Understand where to put code
3. **SRC_ARCHITECTURE.md** - Understand related components
4. **src/** - Read similar implementations
5. Create issue → Use `claude /feature` command

### Want to Understand Build Process?
1. **package.json** - Scripts
2. **vite.config.ts** - Build config
3. **tsconfig.json** - TypeScript config
4. **vercel.json** - Deployment

### Want to Run Tests?
1. **SRC_ARCHITECTURE.md** - Testing strategy section
2. **vitest.config.ts** - Test configuration
3. **.claude/commands/e2e/** - E2E test specs
4. Run: `npm test` and `npm run test:e2e`

---

## 🎯 Quick Reference by Task

### ✅ Setup Project
```bash
# 1. Read SETUP.md
# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

### ✅ Add New Feature
```bash
# 1. Read SRC_ARCHITECTURE.md
# 2. Create GitHub issue
# 3. Use ADW command
claude /feature "Feature description"
# OR use manual workflow
python adws/adw_plan_build_test.py --description "Feature"
```

### ✅ Fix a Bug
```bash
# 1. Identify bug in code
# 2. Use bug command
claude /bug "Bug description"
```

### ✅ Run Tests
```bash
npm test                    # Unit & component tests
npm run test:e2e           # E2E tests
npm run build              # Build check
```

### ✅ Review Code Changes
```bash
# 1. Create PR (automatic with ADW)
# 2. Use review command
claude /review
```

### ✅ Understand a Component
```bash
# 1. Open SRC_ARCHITECTURE.md
# 2. Find component section
# 3. Read src/components/[Component].tsx
# 4. Check related tests
```

---

## 📊 Documentation Statistics

| Category | Count | Files |
|----------|-------|-------|
| Source Code | 8 | `src/**` |
| ADW Workflows | 20+ | `adws/**` |
| Commands | 20+ | `.claude/commands/**` |
| Hooks | 8 | `.claude/hooks/**` |
| Agent Workspaces | 16 | `agents/*/` |
| Issue Specs | 5 | `specs/` |
| Logs | 50+ | `logs/` |

---

## 🔍 Document Type Reference

### Reference Documents (Lookup Information)
- ✅ **PROJECT_STRUCTURE.md** - File organization
- ✅ **SRC_ARCHITECTURE.md** - Code structure
- ✅ **ADW_QUICK_REFERENCE.md** - ADW commands

### Guides (Step-by-Step Instructions)
- ✅ **README.md** - Getting started
- ✅ **SETUP.md** - Detailed setup
- ✅ **CLAUDE.md** - Development guidelines

### Auto-Generated Content
- ✅ **specs/** - Issue breakdowns
- ✅ **agents/** - ADW outputs
- ✅ **logs/** - Execution logs

---

## 🎓 Learning Paths

### Path 1: Become a Game Developer (3-4 hours)
1. Read README.md (5 min)
2. Read PROJECT_STRUCTURE.md (15 min)
3. Read SRC_ARCHITECTURE.md (20 min)
4. Run `npm run dev` (5 min)
5. Explore src/ code (60 min)
6. Read game/logic.ts carefully (30 min)
7. Add small feature & test (60 min)

### Path 2: Become an ADW Developer (2-3 hours)
1. Read CLAUDE.md (10 min)
2. Read ADW_QUICK_REFERENCE.md (10 min)
3. Run `npm run dev` (5 min)
4. Run test: `npm test` (5 min)
5. Read adws/README.md (20 min)
6. Explore adws/adw_modules/ (30 min)
7. Trace one workflow (60 min)

### Path 3: Project Manager (1-2 hours)
1. Read README.md (5 min)
2. Read PROJECT_STRUCTURE.md (15 min)
3. Read CLAUDE.md (10 min)
4. Read ADW_QUICK_REFERENCE.md (10 min)
5. Review specs/ folder (20 min)
6. Review agents/ folder (15 min)

---

## 🆘 Troubleshooting Documentation

### Issue: How do I...?
- ✅ **...add a new feature?** → CLAUDE.md + ADW_QUICK_REFERENCE.md
- ✅ **...understand the game logic?** → SRC_ARCHITECTURE.md
- ✅ **...run tests?** → SRC_ARCHITECTURE.md "Testing Strategy"
- ✅ **...setup the project?** → SETUP.md
- ✅ **...use ADW workflows?** → ADW_QUICK_REFERENCE.md
- ✅ **...find where X is?** → PROJECT_STRUCTURE.md

### Issue: Where is...?
- ✅ **...the game logic?** → `src/game/logic.ts`
- ✅ **...the components?** → `src/components/`
- ✅ **...the themes?** → `src/themes/`
- ✅ **...the ADW code?** → `adws/`
- ✅ **...the commands?** → `.claude/commands/`
- ✅ **...agent outputs?** → `agents/[id]/`

---

## 📱 Documentation by Device

### 📖 Desktop Reading
- **PROJECT_STRUCTURE.md** - Full file tree
- **SRC_ARCHITECTURE.md** - Detailed explanations
- **ADW_QUICK_REFERENCE.md** - Command reference

### 📱 Mobile Reading
- **README.md** - Quick overview
- **CLAUDE.md** - Key guidelines
- **ADW_QUICK_REFERENCE.md** - Quick lookup

### 💻 IDE Reading
- Open `CLAUDE.md` - Always visible
- Reference `PROJECT_STRUCTURE.md` - Keep handy
- Open relevant source file - Explore code

---

## 🔗 Cross-References

### If you're in SRC_ARCHITECTURE.md
- Related: PROJECT_STRUCTURE.md
- Code: `src/`
- Tests: `vitest.config.ts`

### If you're in ADW_QUICK_REFERENCE.md
- Related: CLAUDE.md, adws/README.md
- Code: `adws/`
- Commands: `.claude/commands/`

### If you're in PROJECT_STRUCTURE.md
- Related: SRC_ARCHITECTURE.md
- Root: All directories listed
- Updates: DOCUMENTATION_INDEX.md (this file)

---

## 📅 Last Updated

| Document | Updated | Status |
|----------|---------|--------|
| README.md | 2026-02-14 | Current |
| CLAUDE.md | 2026-02-14 | Current |
| SETUP.md | 2026-02-14 | Current |
| PROJECT_STRUCTURE.md | 2026-02-18 | ✨ New |
| SRC_ARCHITECTURE.md | 2026-02-18 | ✨ New |
| ADW_QUICK_REFERENCE.md | 2026-02-18 | ✨ New |
| DOCUMENTATION_INDEX.md | 2026-02-18 | ✨ New |

---

## 🚀 Getting Help

### Quick Help
- `/help` - Claude Code help
- `npm run build` - Check for errors
- `npm test` - Run tests

### Detailed Help
1. Find topic in this index
2. Read recommended documentation
3. Look at source code
4. Check git history: `git log --oneline`

### Report Issues
https://github.com/anthropics/claude-code/issues

---

## 📝 Documentation Summary

| Doc Name | Type | Best For | Length |
|----------|------|----------|--------|
| README.md | Overview | Getting started | 5 min |
| CLAUDE.md | Guidelines | Development rules | 10 min |
| SETUP.md | Instructions | First-time setup | 15 min |
| PROJECT_STRUCTURE.md | Reference | File organization | 15 min |
| SRC_ARCHITECTURE.md | Reference | Code structure | 20 min |
| ADW_QUICK_REFERENCE.md | Reference | ADW workflows | 10 min |
| DOCUMENTATION_INDEX.md | Navigation | Finding info | 5 min |

**Total Documentation: ~90 minutes comprehensive reading**

---

*Documentation Index v1.0*
*2026-02-18*
*Navigate this project effectively using this index*
