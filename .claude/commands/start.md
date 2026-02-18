# Start the application

## Variables

PORT: 5173
APP_URL: http://localhost:5173

## Prerequisites Check

1. **Node.js**: Verify Node.js is installed. If not, inform user to install it
2. **.env File**: Check if `.env` file exists. If missing, check `.env.sample` and offer to create it
3. **Dependencies**: Check if `node_modules` exists. If missing, ask user if they want to install (or auto-install if in CI)

## Workflow

1. Run prerequisite checks from above
2. Check if a process is already running on PORT using `lsof -i :PORT` or `netstat -tuln | grep PORT`
   - If running: open browser to APP_URL and inform user it's already running
   - If not running: proceed to step 3

3. If not running, execute these steps:
   - Run `npm run dev` (Vite dev server)
   - Wait 3 seconds for server to start
   - Open browser to APP_URL using appropriate command (open, xdg-open, or start depending on OS)
   - Display message: "✅ Application started at APP_URL"

## Error Handling

- If Node.js not found: "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
- If `.env` missing: "⚠️ .env file not found. Please create one (copy from .env.sample if needed)"
- If npm install fails: Display error and ask user to run `npm install` manually
- If dev server fails to start: Display error output and suggest checking logs

## Notes

- Use `nohup` to run in background so terminal remains available
- Verify port is accessible before opening browser
- Handle both WSL and native OS for cross-platform compatibility