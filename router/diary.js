const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({
	apiKey: process.env.OPENAI_SECRET_KEY,
});

async function APIcall(name, date, content) {
  const run = await openai.beta.threads.createAndRun({
    assistant_id: process.env.ASSISTANT_ID,
    thread: {
      messages: [
        {
          role: "user",
          content: `The following is a [diary] written on ${date} by ${name}. Analyze the contents of the [diary] to remember how ${name} was feeling and what she or he was going through, which you must then incorporate into your tarot reading.
        [diary] = ${content}`
        },
      ],
      instruction: `Today is ${date}. In tarot readings and diaries, the date is an important element. Always check it.

    When you incorporate your [diary] into a tarot reading, you should do so in date order. The further away from today, the lower the percentage in tarot reading.
    
    When interpreting tarot readings based on a [diary] that yields similar results, it is important not to overlook the events experienced by ${name}.`
    },
  });

  console.log(run);

  return run.thread_id;
}

const Router = (db) => {
router.get('/:usr_ID', (req, res) => {
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
  
  router.get('/:usr_ID/:date', (req, res) => {
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
  
  router.post('/', (req, res) => {
    const usr_ID = req.body.usr_ID;
    const date = req.body.date;
    const content = req.body.content;
    let nickname;

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

    const tid = APIcall(nickname, date, content);


    /*gpt api: user가 해당 diary를 쓴 걸 알려주고 내용 알려주고 해당 내용을 해석에 참고하라고 하기*/
    db.query('INSERT INTO Diary (usr_ID, dry_date, dry_content, dry_tid) VALUES (?, ?, ?)', [usr_ID, date, content, tid], (err, result) => {
      if (err) {
        console.error("Failed to insert diary to MySQL:", err);
        res.status(500).json({ error: "Failed to insert diary" });
        return;
      }
      res.status(201).send(result);
    });
  });
  return router;
};

module.exports = Router;