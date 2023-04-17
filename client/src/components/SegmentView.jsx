import axios from 'axios';
import { useState, useEffect } from 'react';

function SegmentView() {
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Define column names for transactions list
  const transactionColumns = ['Person Name', 'Amount'];

  // Fetch all segments from the server when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3000/api/segments')
      .then(response => {
        console.log(response.data);
        setSegments(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  // Fetch transactions for the selected segment when it changes
  useEffect(() => {
    if (selectedSegment) {
      axios.get(`http://localhost:3000/api/segments/${selectedSegment}/transactions`)
        .then(response => {
          console.log(response.data);
          setTransactions(response.data);
        })
        .catch(error => console.error(error));
    } else {
      setTransactions([]);
    }
  }, [selectedSegment]);

  // Event handler for when the user selects a segment
  function handleSegmentSelect(event) {
    setSelectedSegment(event.target.value);
  }

  return (
    <div>
      <h1>Segments</h1>
      <select value={selectedSegment || ''} onChange={handleSegmentSelect}>
        <option value="">Select a segment</option>
        {segments.map(segment => (
          <option key={segment.id} value={segment.id}>{segment.segment_name}</option>
        ))}
      </select>
      {selectedSegment && (
        <div>
          <h2>Transactions for Segment</h2>
          {transactions.length === 0 ? (
            <p>No transactions found for this segment.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  {transactionColumns.map(column => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.person_name}</td>
                    <td>{transaction.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default SegmentView;