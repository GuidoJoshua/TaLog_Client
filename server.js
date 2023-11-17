const express = require('express');
const mysql = require('mysql');
require("dotenv").config(); 

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: process.env.MYSQL_PW,
  database: "TaLog"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Error!", err);
    return;
  }
  console.log("Connected to MySQL Server!");
});

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/today/:usr_ID/:date', (req, res) => {
  const usr_ID = req.params.usr_ID;
  const date = req.params.date;
  db.query('SELECT * FROM daily WHERE usr_ID = ? AND dly_date = ?', [usr_ID, date], (err, result) => {
    if (err) {
      console.error("Failed to fetch projs from MySQL:", err);
      res.status(500).json({ error: "Failed to fetch today" });
      return;
    }
    res.send(result);
  });
});

app.get('/token/:usr_ID', (req, res) => {
  const usr_ID = req.params.usr_ID;
  db.query('SELECT usr_tokens FROM User WHERE usr_ID = ?', usr_ID, (err, result) => {
    if (err) {
      console.error("Failed to fetch projs from MySQL:", err);
      res.status(500).json({ error: "Failed to fetch token" });
      return;
    }
    res.send(result);
  });
});

app.get('/diary/:usr_ID', (req, res) => {
  const usr_ID = req.params.usr_ID;
  db.query('SELECT * FROM Diary WHERE usr_ID = ?', [usr_ID, date], (err, result) => {
    if (err) {
      console.error("Failed to fetch diary from MySQL:", err);
      res.status(500).json({ error: "Failed to fetch diary" });
      return;
    }
    res.send(result);
  });
});

app.get('/diary/:usr_ID/:date', (req, res) => {
  const usr_ID = req.params.usr_ID;
  const date = req.params.date;
  db.query('SELECT * FROM Diary WHERE usr_ID = ? AND dry_date = ?', [usr_ID, date], (err, result) => {
    if (err) {
      console.error("Failed to fetch diary from MySQL:", err);
      res.status(500).json({ error: "Failed to fetch diary" });
      return;
    }
    res.send(result);
  });
});

app.post('/diary', (req, res) => {
  const usr_ID = req.body.usr_ID;
  const date = req.body.date;
  const content = req.body.content;
  /*gpt api: user가 해당 diary를 쓴 걸 알려주고 내용 알려주고 해당 내용을 해석에 참고하라고 하기*/
  db.query('INSERT INTO Diary (usr_ID, dry_date, dry_content) VALUES (?, ?, ?)', [usr_ID, date, content], (err, result) => {
    if (err) {
      console.error("Failed to insert diary to MySQL:", err);
      res.status(500).json({ error: "Failed to insert diary" });
      return;
    }
    res.status(201).send(result);
  });
});

app.get('/tarot/:usr_ID/:date', (req, res) => {
  const usr_ID = req.params.usr_ID;
  const date = req.params.date;
  db.query('SELECT * FROM Tarot WHERE usr_ID = ? AND trt_date = ?', [usr_ID, date], (err, result) => {
    if (err) {
      console.error("Failed to fetch tarot from MySQL:", err);
      res.status(500).json({ error: "Failed to fetch tarot" });
      return;
    }
    res.send(result);
  });
});

app.get('/tarot/:trt_ID', (req, res) => {
  const trt_ID = req.params.trt_ID;
  db.query('SELECT * FROM Tarot WHERE trt_ID = ?', trt_ID, (err, result) => {
    if (err) {
      console.error("Failed to fetch tarot from MySQL:", err);
      res.status(500).json({ error: "Failed to fetch tarot" });
      return;
    }
    res.send(result);
  });
});

app.post('/tarot', (req, res) => {
  const usr_ID = req.body.usr_ID;
  const date = req.body.date;
  const trt_question = req.body.trt_question;
  const {card1, card2, card3} = req.body.cards;
  /*gpt api: trt question, card로 해석 후 trt answer가져오기*/
  db.query('INSERT INTO Tarot (usr_ID, trt_date) VALUES (?, ?)', [usr_ID, date], (err, result) => {
    if (err) {
      console.error("Failed to insert tarot to MySQL:", err);
      res.status(500).json({ error: "Failed to insert tarot" });
      return;
    }
    res.status(201).send(result);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});