import { ThemeProvider } from './themes/ThemeContext'
import Game from './components/Game'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <h1>2048</h1>
        <Game />
      </div>
    </ThemeProvider>
  )
}

export default App
