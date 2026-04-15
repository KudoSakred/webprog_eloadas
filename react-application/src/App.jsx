import { useState } from 'react'
import './App.css'

function App() 
{
  // Kezdő adatok (opcionális)
  const initialCinemas = [
    { id: "101", name: "Corvin Mozi", city: "Budapest", capacity: 450 },
    { id: "102", name: "Apolló Mozi", city: "Pécs", capacity: 200 }
  ];

  // State-ek kezelése
  const [cinemas, setCinemas] = useState(initialCinemas);
  const [formData, setFormData] = useState({ id: '', name: '', city: '', capacity: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Input változás kezelése
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacity" ? parseInt(value) || '' : value
    });
  };

  // Hozzáadás vagy Frissítés
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.id || !formData.name || !formData.city || !formData.capacity) {
      alert("Kérlek tölts ki minden mezőt megfelelően!");
      return;
    }

    if (isEditing) {
      // Update
      setCinemas(cinemas.map(c => (c.id === formData.id ? formData : c)));
      setIsEditing(false);
    } else {
      // Create - Ellenőrizzük, hogy az ID egyedi-e
      if (cinemas.find(c => c.id === formData.id)) {
        alert("Ez a Mozi ID már létezik!");
        return;
      }
      setCinemas([...cinemas, formData]);
    }
    
    setFormData({ id: '', name: '', city: '', capacity: '' }); // Form ürítése
  };

  // Szerkesztés betöltése
  const handleEdit = (cinema) => {
    setFormData(cinema);
    setIsEditing(true);
  };

  // Törlés
  const handleDelete = (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a mozit?")) {
      setCinemas(cinemas.filter(c => c.id !== id));
    }
  };

  return (
    <div className="container">
      <h1>Helyi Mozi Kezelő (React CRUD)</h1>

      {/* Form Szekció */}
      <form onSubmit={handleSubmit} className="cinema-form">
        <h3>{isEditing ? "Mozi Szerkesztése" : "Új Mozi Hozzáadása"}</h3>
        <input
          type="text"
          name="id"
          placeholder="Mozi ID (pl. 101)"
          value={formData.id}
          onChange={handleInputChange}
          disabled={isEditing} // Szerkesztésnél az ID-t ne lehessen módosítani
        />
        <input
          type="text"
          name="name"
          placeholder="Mozi neve"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="Forgatási város"
          value={formData.city}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="capacity"
          placeholder="Férőhely (szám)"
          value={formData.capacity}
          onChange={handleInputChange}
          min="1"
        />
        <button type="submit" className="btn-save">
          {isEditing ? "Mentés" : "Hozzáadás"}
        </button>
        {isEditing && (
          <button type="button" className="btn-cancel" onClick={() => { setIsEditing(false); setFormData({ id: '', name: '', city: '', capacity: '' }); }}>
            Mégse
          </button>
        )}
      </form>

      {/* Lista Szekció */}
      <table className="cinema-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Város</th>
            <th>Férőhely</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {cinemas.length > 0 ? (
            cinemas.map((cinema) => (
              <tr key={cinema.id}>
                <td>{cinema.id}</td>
                <td>{cinema.name}</td>
                <td>{cinema.city}</td>
                <td>{cinema.capacity} fő</td>
                <td>
                  <button onClick={() => handleEdit(cinema)} className="btn-edit">Szerkesztés</button>
                  <button onClick={() => handleDelete(cinema.id)} className="btn-delete">Törlés</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nincs megjeleníthető mozi.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;