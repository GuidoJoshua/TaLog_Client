const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({
	apiKey: process.env.OPENAI_SECRET_KEY,
});

async function APIcall(name, tid, tarot_question, card1, card2, card3) {
  const threadMessage = await openai.beta.threads.messages.create(tid,
    {
      role: "User", content: `Interpret tarot cards in the following order.
    1. Understand the [question] at the bottom
    2. Based on the [card names] and [descriptions] below, interpret the cards you chose according to the question in order, considering the nature of the ${name} you know from the [diaries] you have received so far.
    3. Write about overall interpretation in depth and with care.
    
    [question] = ${tarot_question}
    
    [card names] : { card1 = ${card1}, card2 = ${card2}, card3 = ${card3}}`
    })

    const run = await openai.beta.threads.runs.create(
      tid,
      { assistant_id: process.env.ASSISTANT_ID }
    );

    const answers = await openai.beta.threads.messages.list(
      tid
    );
  
    console.log(answers.data[-1].content.value);
    return answers.data[-1].content.value;
}

const Router = (db) => {
router.get('/:usr_ID/:date', (req, res) => {
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
  
  router.get('/:trt_ID', (req, res) => {
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
  
  router.post('/', (req, res) => {
    const usr_ID = req.body.usr_ID;
    const date = req.body.date;
    const trt_question = req.body.trt_question;
    const {card1, card2, card3} = req.body.cards;
    let nickname;
    let tid;

    db.query('SELECT * FROM User WHERE usr_ID = ?', usr_ID, (err, result) => {
      if (err) {
        console.error("Failed to fetch user from MySQL:", err);
        res.status(500).json({ error: "Failed to fetch user" });
        return;
      }
      if (result.length === 0) {
        console.error("No such user");
        res.status(500).json({ error: "No such user" });
        return;
      }
      nickname = result[0].usr_nickname;
    });

    db.query('SELECT * FROM diary WHERE usr_ID = ? AND dry_date = ?', [usr_ID, date], (err, result) => {
      if (!err) {
        console.error("Failed to fetch diary from MySQL:", err);
        res.status(500).json({ error: "Failed to fetch diary" });
        return;
      } 
      else if (result.length === 0) {
        console.error("No such diary");
        res.status(500).json({ error: "No such diary" });
        return;
      }
      tid = result[0].dry_tid;
    });

    const answer = APIcall(nickname, tid, trt_question, card1, card2, card3)
    /*gpt api: trt question, card로 해석 후 trt answer가져오기*/
    db.query('INSERT INTO Tarot (usr_ID, trt_date, trt_question, trt_answer, trt_card1, trt_card2, trt_card3) VALUES (?, ?)', [usr_ID, date, trt_question, answer, card1, card2, card3], (err, result) => {
      if (err) {
        console.error("Failed to insert tarot to MySQL:", err);
        res.status(500).json({ error: "Failed to insert tarot" });
        return;
      }
      res.status(201).send(result);
    });
  });
  return router;
};

module.exports = Router;