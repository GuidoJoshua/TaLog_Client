const express = require("express");
const router = express.Router();


const Router = (db) => {
router.get('/:usr_ID/token', (req, res) => {
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
  return router;
};

module.exports = Router;