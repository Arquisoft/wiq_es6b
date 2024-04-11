import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RankingList = () => {
  const [listUsers, setListUsers] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [topThreeUsers, setTopThreeUsers] = useState([]);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/obtainRank`);

        if (response.status === 200) {
          const uList = response.data.map(record => ({
            ...record,
            createdAt: new Date(record.createdAt).toLocaleString(),
          }));
          setListUsers(uList);
          const sortedUsers = [...uList].sort((a, b) => b.porcentajeAciertos - a.porcentajeAciertos);
          setTopThreeUsers(sortedUsers.slice(0, 3));
        } else {
          console.error('Error obteniendo la lista de usuarios');
        }
      } catch (error) {
        console.error('Error obteniendo la lista de usuarios:', error);
      }
    };

    fetchUsers();
  }, [apiEndpoint]);

  const sortedUsers = [...listUsers].sort((a, b) => {
    if (sortColumn === 'username') {
      return sortOrder === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
    } else if (sortColumn === 'porcentajeAciertos') {
      return sortOrder === 'asc' ? a.porcentajeAciertos - b.porcentajeAciertos : b.porcentajeAciertos - a.porcentajeAciertos;
    } else if (sortColumn === 'preguntasCorrectas') {
      return sortOrder === 'asc' ? a.preguntasCorrectas - b.preguntasCorrectas : b.preguntasCorrectas - a.preguntasCorrectas;
    } else if (sortColumn === 'preguntasFalladas') {
      return sortOrder === 'asc' ? a.preguntasFalladas - b.preguntasFalladas : b.preguntasFalladas - a.preguntasFalladas;
    } else if (sortColumn === 'numPartidas') {
      return sortOrder === 'asc' ? a.numPartidas - b.numPartidas : b.numPartidas - a.numPartidas;
    } else {
      // Ordenar por defecto por _id si no se especifica ninguna columna de ordenamiento específica
      return sortOrder === 'asc' ? a._id - b._id : b._id - a._id;
    }
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };  

  return (
    <div>
      <h2>Top 3 usurios con mejor porcentaje de aciertos</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        {topThreeUsers.map((user, index) => (
          <div key={index} style={{ width: '30%', padding: '20px', backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32', color: 'white', textAlign: 'center', borderRadius: '10px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s', border: '1px solid #ddd' }}>
            <h3 style={{ margin: '0' }}>{index + 1}</h3>
            <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{user.username}</p>
            <p style={{ marginBottom: '5px' }}>{user.porcentajeAciertos}% Aciertos</p>
          </div>
        ))}
      </div>
      
      <h2>Ranking</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
            <th onClick={() => handleSort('username')}>Nombre de Usuario {sortColumn === 'username' && sortOrder === 'asc' ? '▲' : '▼'}</th>
            <th onClick={() => handleSort('porcentajeAciertos')}>Porcentaje de Aciertos {sortColumn === 'porcentajeAciertos' && sortOrder === 'asc' ? '▲' : '▼'}</th>
            <th onClick={() => handleSort('preguntasCorrectas')}>Preguntas Correctas {sortColumn === 'preguntasCorrectas' && sortOrder === 'asc' ? '▲' : '▼'}</th>
            <th onClick={() => handleSort('preguntasFalladas')}>Preguntas Falladas {sortColumn === 'preguntasFalladas' && sortOrder === 'asc' ? '▲' : '▼'}</th>
            <th onClick={() => handleSort('numPartidas')}>Número de Partidas {sortColumn === 'numPartidas' && sortOrder === 'asc' ? '▲' : '▼'}</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.porcentajeAciertos}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.preguntasCorrectas}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.preguntasFalladas}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.numPartidas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingList;
