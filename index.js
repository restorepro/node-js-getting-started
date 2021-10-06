const cool = require('cool-ascii-faces');
const express = require('express');
//const cors = require("cors");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
//var bodyParser = require('body-parser')
var testUUID = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
console.log("test UUID: " + testUUID);
console.log(process.env.DATABASE_URL);

var todos = [{id:1, title:'buy the milk'}, {id:2, title:'rent a car'}, {id:3, title:'feed the cat'}];
var count = todos.length;

express()
  .use(express.static(path.join(__dirname, 'public')))
  //.use(express.urlencoded({extended: true}))
  .use(express.json())
  //.use(cors({origin: new URL('http://localhost:3000'), credentials: true}))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null };
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/times2', (req, res) => res.send(showTimes2()))
  .get('/multiple', function (req, res) {
    res.json({
      number: 1,
      name: 'John',
      gender: 'male'
    });
  })
  .get('/array', function (req, res) {
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
.get('/newuser', (request, response) => {
  var user_name = request.query.my; // works
  console.log("request body: " + request.query);
  //var newTodo = JSON.parse(request.body);
  // insert
  pool.query(
    "INSERT INTO test_table(id, username, password, email, userUUID)" + 
    "VALUES('2', 'smokey', smokey20, 'mroyster@royster.com', '42cf81a9-6f79-413c-aef3-608d18ceea70')",
    (err, res) => {
      console.log(err, res);
      pool.end();
    }
  );
  // insert end
  var newTodo = request.query;
   count = count + 1;
   newTodo.id = count;
   todos.push(newTodo);
  response.status(200).json(user_name);
})
  .get('/hello', (req, res) => res.send('Hello World'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


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


