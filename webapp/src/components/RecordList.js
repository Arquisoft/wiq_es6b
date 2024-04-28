import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { userInfo } from 'os';

const RecordList = ({ username }) => {
  const [listRecords, setListRecords] = useState([]);
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/getRecords/${username}`);

        if (response.status === 200) {
          const userRecords = response.data.map(record => ({
            ...record,
            date: new Date(record.date).toLocaleString(),
          }));
          setListRecords(userRecords);
        } else {
          console.error('Error obtaining the user records list');
        }
      } catch (error) {
        console.error('Error obtaining the user records list:', error);
      }
    };

    fetchRecords();
  }, [apiEndpoint, username]);

  return (
    <div>
      <h2>Tu historial de jugadas</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
            <th>Fecha</th>
            <th>Tiempo (segundos)</th>
            <th>Dinero conseguido</th>
            <th>Respuestas correctas</th>
            <th>Respuestas falladas</th>
          </tr>
        </thead>
        <tbody>
          {listRecords.map((record, index) => (
            <tr key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.date}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.time}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.money}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.correctQuestions}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.failedQuestions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

RecordList.propTypes = {
  username: PropTypes.string.isRequired,
};

export default RecordList;
