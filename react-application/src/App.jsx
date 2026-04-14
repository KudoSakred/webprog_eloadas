import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CrudManager from './pages/CrudApp';
import GameRoom from './pages/GameRoom';

function App() {
  return (
    <Router>
      {/* The Navbar stays on every page */}
      <nav style={{ padding: '20px', background: '#2d2430' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Data Manager (CRUD)</Link>
        <Link to="/game">Play Game</Link>
      </nav>

      {/* The Routes switch between the two */}
      <Routes>
        <Route path="/" element={<CrudManager />} />
        <Route path="/game" element={<GameRoom />} />
      </Routes>
    </Router>
  );
}

export default App;