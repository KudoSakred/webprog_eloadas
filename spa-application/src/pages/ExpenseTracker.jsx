import React, { useState } from 'react';
import './ExpenseTracker.css';

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  const addExpense = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newExpense = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      amount: parseFloat(amount)
    };

    setExpenses([newExpense, ...expenses]);
    setText('');
    setAmount('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const total = expenses.reduce((acc, item) => acc + item.amount, 0).toFixed(2);

  return (
    <div className="expense-tracker">
      <h2>Kiadáskövető</h2>
      <div className="balance">
        <h3>Egyenleg: {total} Ft</h3>
      </div>

      <form onSubmit={addExpense}>
        <input 
          type="text" 
          placeholder="Mire költöttél?" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Összeg" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />
        <button type="submit">Hozzáadás</button>
      </form>

      <ul className="list">
        {expenses.map(expense => (
          <li key={expense.id} className={expense.amount < 0 ? 'minus' : 'plus'}>
            {expense.text} <span>{expense.amount} Ft</span>
            <button onClick={() => deleteExpense(expense.id)} className="delete-btn">x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseTracker;