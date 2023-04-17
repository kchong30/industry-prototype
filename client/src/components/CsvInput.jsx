import React, { useState } from 'react';
import axios from 'axios';
import { parse } from 'papaparse';

function CsvInput() {
  const [csvFile, setCsvFile] = useState(null);
  const [segmentName, setSegmentName] = useState('');


  function handleCsvUpload(event) {
    const file = event.target.files[0];
    setCsvFile(file);
  }

  function handleSegmentNameChange(event) {
    const name = event.target.value;
    setSegmentName(name);
  }

  function handleSubmit() {
    console.log(segmentName);
    console.log (csvFile);

    //parse the CSV file, convert the results into an array of ID's only - not objects containing IDs

    parse(csvFile, {
      header: true,
      complete: function(results) {
        console.log(results.data);
        const idArray = results.data.map(obj => obj.id);
        console.log (idArray);
        axios.post('http://localhost:3000/api/segments', {
          segmentName: segmentName,
          csvFile: idArray,
        })
        .then(response => console.log(response.data))
        .catch(error => console.error(error));
      }
    });
  }

  return (
    <div>
      <h2>Upload CSV</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Segment Name:
          <input type="text" value={segmentName} onChange={handleSegmentNameChange} />
        </label>
        <br />
        <input type="file" accept=".csv" onChange={handleCsvUpload} />
        {csvFile && <p>Selected file: {csvFile.name}</p>}
        <br />
        <button type="submit" disabled={!csvFile || !segmentName}>Submit</button>
      </form>
    </div>
  );
}

export default CsvInput;