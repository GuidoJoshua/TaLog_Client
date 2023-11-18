const express = require("express");
const router = express.Router();

const Router = (db) => {
  router.get('/:usr_ID/:date', (req, res) => {
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
  return router;
};

module.exports = Router;