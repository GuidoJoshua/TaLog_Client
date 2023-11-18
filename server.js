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



const dailyRouter = require("./router/daily");
const diaryRouter = require("./router/diary");
const tarotRouter = require("./router/tarot");
const usersRouter = require("./router/users");

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use("/daily", dailyRouter(db));
app.use("/diary", diaryRouter(db));
app.use("/tarot", tarotRouter(db));
app.use("/users", usersRouter(db));
