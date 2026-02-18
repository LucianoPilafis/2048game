# Review - 2048 Game Implementation

Review work done against a specification file to ensure implemented features match requirements for the 2048 game.

## Variables

- `adw_id`: $1 - Agent workflow ID
- `spec_file`: $2 - Path to specification file
- `agent_name`: $3 - Agent name (default: 'review_agent')
- `review_image_dir`: `/agents/<adw_id>/<agent_name>/review_img/`

## Review Process

1. **Context**: Check current git branch and review changes with `git diff origin/main`
2. **Requirements**: Read the spec file to understand requirements
3. **Setup**: Execute `.claude/commands/prepare_app.md` to prepare the application
4. **Validation**: Validate implementation against spec
5. **Screenshots**: Capture 2-3 critical screenshots demonstrating the new functionality
6. **Issues**: Document any blocking issues (use severity: blocker/tech_debt/skippable)
7. **Report**: Return results as JSON only

## Validation Checklist for 2048 Game Features

When reviewing changes, validate against these game-specific criteria:

- **Game Mechanics**: Does the core 2048 logic work correctly?
- **UI Rendering**: Are tiles displayed correctly with proper styling/colors?
- **Palette/Theme**: Does the color scheme apply correctly to the board?
- **User Interactions**: Can players move tiles and see immediate feedback?
- **State Management**: Does undo/reset work if applicable?
- **Responsive Design**: Does the game look good on different screen sizes?

## Screenshot Guidelines

- Capture **2-3 critical screenshots** showing the implemented functionality
- Focus on the new feature being tested (not full game walkthrough)
- Use descriptive filenames: `01_feature_name.png`, `02_feature_result.png`
- Store all screenshots in `review_image_dir` with full absolute paths
- For issues, include a screenshot showing the problem

## Issue Severity

- **blocker**: Feature doesn't work as specified; prevents release
- **tech_debt**: Works but has code quality issues; should be addressed soon
- **skippable**: Minor issues that don't affect user experience

## Output Format

Return ONLY valid JSON (no other text):

```json
{
    "success": true,
    "review_summary": "2-4 sentence summary of what was implemented and whether it matches spec",
    "review_issues": [
        {
            "review_issue_number": 1,
            "screenshot_path": "/absolute/path/to/issue_screenshot.png",
            "issue_description": "Description of the issue",
            "issue_resolution": "How to resolve it",
            "issue_severity": "blocker"
        }
    ],
    "screenshots": [
        "/absolute/path/to/01_feature.png",
        "/absolute/path/to/02_result.png"
    ]
}
```

## Notes

- Only report BLOCKING issues as failures; skippable/tech_debt issues can exist with success=true
- Think carefully about user experience and critical functionality
- Keep review focused on spec requirements, not general code quality
- Ensure all paths are absolute and screenshots exist