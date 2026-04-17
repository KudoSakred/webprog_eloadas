import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ne felejtsd el beimportálni!

const API_URL = "http://gamfbead969.nhely.hu/api.php";

const MoziApp = () => {
  const [mozik, setMozik] = useState([]);
  const [form, setForm] = useState({ id: '', nev: '', varos: '', ferohely: '' });
  const [szerkesztesAlatt, setSzerkesztesAlatt] = useState(false);

  const getMozik = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && response.data.data) {
        setMozik(response.data.data);
      }
    } catch (error) {
      console.error("Hiba a letöltéskor:", error);
    }
  };

  useEffect(() => {
    getMozik();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = (name === 'id' || name === 'ferohely') ? (value === '' ? '' : Number(value)) : value;
    setForm({ ...form, [name]: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (szerkesztesAlatt) {
        await axios.put(API_URL, form);
        setSzerkesztesAlatt(false);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ id: '', nev: '', varos: '', ferohely: '' });
      getMozik();
    } catch (error) {
      console.error("Hiba a mentéskor:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törlöd ezt a mozit?")) {
      try {
        await axios.delete(API_URL, { data: { id: id } });
        getMozik();
      } catch (error) {
        console.error("Hiba a törléskor:", error);
      }
    }
  };

  const handleEdit = (mozi) => {
    setForm(mozi);
    setSzerkesztesAlatt(true);
  };

  return (
    <div className="container">
      <h1 style={{ color: '#333' }}>Helyi Mozi Kezelő (AXIOS API)</h1>

      <div className="form-box">
        <h3 style={{ marginTop: 0 }}>{szerkesztesAlatt ? "Adatok szerkesztése" : "Új mozi hozzáadása"}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label className="label">Mozi ID (Szám):</label>
              <input 
                className="input" 
                name="id" 
                type="number" 
                value={form.id} 
                onChange={handleInputChange} 
                disabled={szerkesztesAlatt} 
                required 
              />
            </div>
            <div style={{ flex: '2', minWidth: '200px' }}>
              <label className="label">Mozi Neve:</label>
              <input className="input" name="nev" value={form.nev} onChange={handleInputChange} required />
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label className="label">Város:</label>
              <input className="input" name="varos" value={form.varos} onChange={handleInputChange} required />
            </div>
            <div style={{ flex: '1', minWidth: '120px' }}>
              <label className="label">Férőhely:</label>
              <input className="input" name="ferohely" type="number" value={form.ferohely} onChange={handleInputChange} required />
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <button type="submit" className="button save-btn">
              {szerkesztesAlatt ? "Változtatások mentése" : "Mozi mentése"}
            </button>
            {szerkesztesAlatt && (
              <button 
                type="button" 
                className="button cancel-btn"
                onClick={() => {setSzerkesztesAlatt(false); setForm({id:'', nev:'', varos:'', ferohely:''})}}
              >
                Mégse
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th className="th">ID</th>
              <th className="th">Mozi Név</th>
              <th className="th">Város</th>
              <th className="th">Férőhely</th>
              <th className="th">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {mozik.map(mozi => (
              <tr key={mozi.id}>
                <td className="td"><strong>{mozi.id}</strong></td>
                <td className="td">{mozi.nev}</td>
                <td className="td">{mozi.varos}</td>
                <td className="td">{mozi.ferohely} fő</td>
                <td className="td">
                  <button className="action-btn" onClick={() => handleEdit(mozi)}>Szerkeszt</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(mozi.id)}>
                    Töröl
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoziApp;