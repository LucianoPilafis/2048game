# ADW (Autonomous Developer Workflows) - Quick Reference

## 🚀 Quick Commands

### Feature Development
```bash
# Start a new feature
claude /feature "Add touch controls to game"

# Feature workflow automatically:
# 1. Creates feature branch
# 2. Plans the work
# 3. Builds implementation
# 4. Runs tests
# 5. Creates PR
```

### Bug Fixes
```bash
# Start a bug fix
claude /bug "Tiles not merging correctly"
```

### Maintenance Tasks
```bash
# Start a chore/maintenance task
claude /chore "Refactor game logic"
```

### Patch Releases
```bash
# Create a patch
claude /patch "Fix critical bug"
```

---

## 🔄 Workflow Phases

### Phase 1: PLAN
**Script:** `adws/adw_plan.py`
- ✅ Analyze the feature/issue
- ✅ Design the solution
- ✅ Break into implementation tasks
- ✅ Identify files to modify
- ✅ Output: Specification document

### Phase 2: BUILD
**Script:** `adws/adw_build.py`
- ✅ Implement code changes
- ✅ Create commits
- ✅ Push to branch
- ✅ Output: Code changes

### Phase 3: TEST
**Script:** `adws/adw_test.py`
- ✅ Run unit tests (`npm test`)
- ✅ Run E2E tests
- ✅ Validate functionality
- ✅ Fix failing tests
- ✅ Output: Test results

### Phase 4: REVIEW
**Script:** `adws/adw_review.py`
- ✅ Review code changes
- ✅ Check for issues
- ✅ Provide feedback

### Phase 5: DOCUMENT
**Script:** `adws/adw_document.py`
- ✅ Generate documentation
- ✅ Update README/specs
- ✅ Create changelog

---

## 📋 Combined Workflow Commands

### Full Cycle (Plan → Build → Test)
```bash
python adws/adw_plan_build_test.py --issue "Issue #15" --type feature
```
**Result:** Feature planned, built, tested, and PR created automatically

### Plan Only
```bash
python adws/adw_plan.py --description "Feature description"
```

### Plan + Build
```bash
python adws/adw_plan_build.py --issue-id "15"
```

### Plan + Build + Test + Review
```bash
python adws/adw_plan_build_test_review.py --issue-id "15"
```

### Plan + Build + Document
```bash
python adws/adw_plan_build_document.py --issue-id "15"
```

---

## 📂 File Structure for ADWs

```
adws/
├── Core Workflows
│   ├── adw_plan.py              # Planning
│   ├── adw_build.py             # Building
│   ├── adw_test.py              # Testing
│   ├── adw_review.py            # Code review
│   ├── adw_document.py          # Documentation
│
├── Combined Workflows
│   ├── adw_plan_build.py
│   ├── adw_plan_build_test.py   # ⭐ Most common
│   ├── adw_plan_build_review.py
│   ├── adw_plan_build_test_review.py
│   ├── adw_plan_build_document.py
│
├── Utilities
│   └── adw_modules/             # Shared utilities
│       ├── agent.py             # Base agent
│       ├── git_ops.py           # Git operations
│       ├── github.py            # GitHub API
│       ├── state.py             # State tracking
│       └── utils.py             # Helper functions
```

---

## 🔍 Agent Workspace

Each ADW execution creates workspace files:

```
agents/[agent-id]/
├── plan/
│   └── plan.md                  # Generated plan
├── build/
│   └── [implementation files]   # Built code
├── test/
│   └── test_results.json        # Test output
└── review/
    └── review.md                # Review findings
```

**Example:** `agents/6abf18ba/` - Agent workspace for undo button feature

---

## 🧪 Available E2E Tests

```bash
# Run all E2E tests
claude /test_e2e

# Run specific E2E tests
claude /e2e:test_palette_scope           # Palette scoping
claude /e2e:test_tile_size_stability     # Tile rendering
claude /e2e:test_undo_button             # Undo functionality
claude /e2e:test_color_palette_themes    # Color themes
```

### E2E Test Files
- `.claude/commands/e2e/test_palette_scope.md`
- `.claude/commands/e2e/test_tile_size_stability.md`
- `.claude/commands/e2e/test_undo_button.md`
- `.claude/commands/e2e/test_color_palette_themes.md`

---

## 🛠️ Manual ADW Execution

### Execute Full Workflow Programmatically
```python
from adws.adw_plan_build_test import run_full_workflow

result = run_full_workflow(
    issue_id="15",
    issue_type="feature",
    description="Add undo button",
    branch_name="feature-issue-15-adw-add-undo"
)
```

### Agent Execution Status
```python
from adws.adw_modules.state import AgentState

state = AgentState(agent_id="6abf18ba")
status = state.get_status()  # Get current phase
results = state.get_results()  # Get phase results
```

---

## 📊 Tracking ADW Progress

### View Agent Logs
```bash
# List all agent workspaces
ls agents/

# View specific agent logs
cat agents/6abf18ba/plan/plan.md
cat agents/6abf18ba/build/build.log
cat agents/6abf18ba/test/test_results.json
```

### View Issue Specs
```bash
# List all issue specs
ls specs/

# View spec content
cat specs/issue-15-adw-6abf18ba-sdlc_planner-add-undo-button.md
```

---

## 🎯 ADW Workflow Phases in Detail

### Phase 1: PLAN (`adw_plan.py`)
```
INPUT: Issue description or GitHub issue URL
PROCESS:
  1. Parse issue requirements
  2. Design solution architecture
  3. Identify files to modify
  4. Break into implementation tasks
  5. Estimate complexity
OUTPUT: plan.md with detailed breakdown
```

### Phase 2: BUILD (`adw_build.py`)
```
INPUT: Plan from Phase 1
PROCESS:
  1. Create feature branch
  2. Read plan tasks
  3. Implement code changes
  4. Write/modify files
  5. Create commits
  6. Push to origin
OUTPUT: Feature branch with commits
```

### Phase 3: TEST (`adw_test.py`)
```
INPUT: Built code from Phase 2
PROCESS:
  1. Run npm test (unit tests)
  2. Run E2E tests
  3. Check coverage
  4. Fix failing tests
  5. Validate game logic
OUTPUT: test_results.json with pass/fail status
```

### Phase 4: REVIEW (`adw_review.py`)
```
INPUT: Built code from Phase 2
PROCESS:
  1. Check code quality
  2. Verify best practices
  3. Check for bugs
  4. Provide recommendations
OUTPUT: review.md with findings
```

### Phase 5: DOCUMENT (`adw_document.py`)
```
INPUT: Plan + Code
PROCESS:
  1. Generate API docs
  2. Update README
  3. Create CHANGELOG
  4. Document new features
OUTPUT: Documentation updates
```

---

## 🚨 Troubleshooting ADWs

### If Phase Fails

**Build Failed:**
```bash
# Check build logs
tail -f agents/[agent-id]/build/build.log

# Run manual build
npm run build
```

**Tests Failed:**
```bash
# Check test results
cat agents/[agent-id]/test/test_results.json

# Run tests manually
npm test
```

**E2E Tests Failed:**
```bash
# Check E2E test output
cat agents/[agent-id]/test/e2e_results.json

# Run specific E2E test
npm run test:e2e -- --file test_palette_scope.mjs
```

### Clear Agent State
```bash
# Remove agent workspace (careful!)
rm -rf agents/[agent-id]

# Restart workflow
claude /feature "Feature name"
```

---

## 📈 ADW Metrics

Track ADW effectiveness:
- ✅ Features completed per week
- ✅ Test pass rate
- ✅ PR review time
- ✅ Time from issue to merge
- ✅ Code quality scores

---

## 🔗 Related Files

- **CLAUDE.md** - Project instructions
- **adws/README.md** - Detailed ADW documentation
- **.claude/commands/** - ADW command definitions
- **specs/** - Issue specifications
- **agents/** - Agent workspace outputs

---

## 💡 Tips

1. **Use descriptive issue titles** - ADWs parse these for planning
2. **Test locally first** - Before running full workflow
3. **Check logs** - Located in `agents/[id]/` directories
4. **Monitor E2E tests** - They validate user-facing features
5. **Review PRs** - Even though auto-generated, they should be reviewed

---

*ADW Quick Reference - Updated 2026-02-18*
*For detailed info, see CLAUDE.md and adws/README.md*
