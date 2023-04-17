const { Pool } = require('pg');
const express = require('express');

const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  

// Set up database connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '',
  port: 5432
});

// Middleware to parse incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Route to handle CSV file uploads and create new segments
app.post('/api/segments', async (req, res) => {
  
  const {segmentName} = req.body;
  const {csvFile} = req.body;
  console.log(req.body);
  console.log (segmentName);
  console.log("data:" + csvFile);

  try {
    // Insert a new row into the segments table with the given client IDs
    const { rows } = await pool.query(`
      INSERT INTO segments (segment_name, people_ids)
      VALUES ($1, $2)
      RETURNING id
    `, [segmentName, csvFile]);

    const newSegmentId = rows[0].id;
    console.log(newSegmentId);
    res.json({ id: newSegmentId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Route handler to retrieve all segments
app.get('/api/segments', async (req, res) => {
    try {
      // Query the database for all segments
      const { rows: segments } = await pool.query(`
        SELECT id, segment_name, people_ids
        FROM segments
      `);

      res.json(segments);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

// Route handler to retrieve transactions for a given segment
app.get('/api/segments/:segmentId/transactions', async (req, res) => {
    const segmentId = req.params.segmentId;
  
    try {
      // Get the people IDs for the segment
      const { rows: segmentRows } = await pool.query(`
        SELECT people_ids
        FROM segments
        WHERE id = $1
      `, [segmentId]);
  
      const peopleIds = segmentRows[0].people_ids;
  
      // Create a temporary table for the transactions - note, currently bugged if you try and go back to a previously selected temp table.
      // Need to look into another naming convention for temp table to avoid collisions?
      await pool.query(`
        CREATE TEMP TABLE temp_transactions_${segmentId} AS
        SELECT t.*, p.name as person_name
        FROM transactions t
        JOIN people p ON p.id = t.people_id
        WHERE t.people_id = ANY($1)
      `, [peopleIds]);
  
      // Select from the temporary table and return the results
      const { rows: transactionRows } = await pool.query(`
        SELECT * FROM temp_transactions_${segmentId}
      `);

      console.log(transactionRows);
  
      res.json(transactionRows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });


// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});