import React, { useState } from 'react';

export default function CrudApp() {
    const [items, setItems] = useState([]); // Read
    const [inputValue, setInputValue] = useState('');
    
    // Objektum kreálás
    const addItem = () => {
    if (!inputValue) return;
    const newItem = { id: Date.now(), text: inputValue };
    setItems([...items, newItem]);
    setInputValue('');
    };

    // Távolítás
    const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    };

    // Frissítés/Szerkesztés
    const editItem = (id) => {
    const newText = prompt("Edit item:");
    if (newText) {
        setItems(items.map(item => item.id === id ? { ...item, text: newText } : item));
    }
    };

    return (
    <div style={{ padding: '20px' }}>
        <h1>CRUD Application</h1>
        <input 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        placeholder="Add something!"
        />
        <button onClick={addItem}>Add</button>

        <ul>
        {items.map(item => (
            <li key={item.id}>
            {item.text} 
            <button onClick={() => editItem(item.id)}>Edit</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
            </li>
        ))}
        </ul>
    </div>
    );
}