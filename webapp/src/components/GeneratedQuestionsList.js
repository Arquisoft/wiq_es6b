
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GeneratedQuestionsList = ({setError}) => {
 
  const [listquestions, setListquestions] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';



  useEffect(() => {
    const fetchQuestions = async () => {
      try {
       
        const response = await axios.get(`${apiEndpoint}/getAllGeneratedQuestions`);
        if (response.status === 200)  {

            const qList = response.data;
            setListquestions(qList);

        } else {
          setError('Error obteniendo la lista de preguntas generadas');
        }
      } catch (error) {
        setError('Error obteniendo la lista de preguntas generadas:', error);
      }
    };

    fetchQuestions();
  }, [apiEndpoint]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedQuestions = [...listquestions].sort((a, b) => {
    if (sortColumn === 'generatedQuestionBody') {
      return sortOrder === 'asc' ? a.generatedQuestionBody.localeCompare(b.generatedQuestionBody) : b.generatedQuestionBody.localeCompare(a.generatedQuestionBody);
    } else if (sortColumn === 'correctAnswer') {
      return sortOrder === 'asc' ? a.correctAnswer.localeCompare(b.correctAnswer) : b.correctAnswer.localeCompare(a.correctAnswer);
    } else {
      return 0;
    }
  });

  return (
    <div>
    <h2>Lista de preguntas</h2>
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
          <th onClick={() => handleSort('generatedQuestionBody')}>Pregunta {sortColumn === 'generatedQuestionBody' && sortOrder === 'asc' ? '▲' : '▼'}</th>
          <th onClick={() => handleSort('correctAnswer')}>Respuesta Correcta {sortColumn === 'correctAnswer' && sortOrder === 'asc' ? '▲' : '▼'}</th>
        </tr>
      </thead>
      <tbody>
        {sortedQuestions.map((question, index) => (
          <tr key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{question.generatedQuestionBody}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{question.correctAnswer}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>


  );
};

GeneratedQuestionsList.propTypes = {
  setError: PropTypes.func.isRequired,
};

export default GeneratedQuestionsList;
