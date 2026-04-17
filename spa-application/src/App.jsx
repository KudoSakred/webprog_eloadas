import React, { useState } from 'react';
import './App.css';
import ExpenseTracker from './pages/ExpenseTracker'; // Az új import
import SnakeGame from './pages/SnakeGame';

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="container">
      <header>
        <nav>
          <button onClick={() => setView('expenses')}>Kiadáskövető</button>
          <button onClick={() => setView('snake')}>Snake Játék</button>
        </nav>
      </header>
      
      <main>
        {view === 'home' && <p>Válassz egy alkalmazást a fenti menüből!</p>}
        {view === 'expenses' && <ExpenseTracker />}
        {view === 'snake' && <SnakeGame />}
      </main>
    </div>
  );
}

export default App;