const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log(process.env.DATABASE_URL);
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/times2', (req, res) => res.send(showTimes2()))
  .get('/multiple', function(req, res) {
    res.json({
      number: 1,
      name: 'John',
      gender: 'male'
    });
  })
  .get('/array', function(req, res) {
    res.json([{
        number: 1,
        name: 'John',
        gender: 'male'
      },
      {
        number: 2,
        name: 'Ashley',
        gender: 'female'
      }
    ]);
  })
  .get('/hello', (req, res) => res.send('Hello World'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


  showTimes = () => {
    let result = '';
    const times = process.env.TIMES || 5;
    for (i = 0; i < times; i++) {
      result += i + ' ';
    }
    return result + 12;
  }
  showMultiple = () => {
     res.json([{
      number: 1,
      name: 'John',
      gender: 'male'
    },
    {
      number: 2,
      name: 'Ashley',
      gender: 'female'
    }
  ]);
  }

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      // tslint:disable-next-line: no-bitwise
      const r =
        (window.crypto.getRandomValues(new Uint32Array(1))[0] *
          Math.pow(2, -32) * 16) |
        0;
      // tslint:disable-next-line: no-bitwise
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      console.log("Guid: " + v.toString(16));
      return v.toString(16);
    });
  }

