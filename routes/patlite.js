const express = require("express");
const router = express.Router();
const sql = require("mssql");
const { dbconfig } = require("../config");

const sendData = require("../libs/tcp-client");
const { AsciitoHex, BitoHex } = require("../libs/utils");

// router.post('/connect', (req, res) => {
//     req.flash('page', 'home')
//     res.render('index.ejs')
// })

router.post("/set_light/:PatliteId", async (req, res) => {
  try {
    let PatliteId = req.params.PatliteId;
    if (PatliteId == 0) {
      return res.status(400).send({ message: "Please select Patlight" });
    }
    let { LightCode, BuzzerCode, FlashCode } = req.body;
    let pool = await sql.connect(dbconfig);
    let checkId = await pool.request().query(`SELECT CASE
        WHEN EXISTS(
            SELECT *
            FROM MasterPatlite
            WHERE PatliteId = ${PatliteId}
        )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`);
    if (!checkId.recordset[0].check) {
      return res.status(400).send({ message: "Patlight not found" });
    }
    let Patlite = await pool
      .request()
      .query(
        `SELECT PatliteIp, PatlitePort FROM MasterPatlite WHERE PatliteId = ${PatliteId}`
      );
    let { PatliteIp, PatlitePort } = Patlite.recordset[0];
    let Code = BitoHex(FlashCode + BuzzerCode + LightCode);
    if (Code.length === 1) {
      Code = "0" + Code;
    }
    let data = Buffer.from(AsciitoHex("W") + Code, "hex");
    sendData(PatliteIp, PatlitePort, data);
    setTimeout(() => {
      sendData(PatliteIp, PatlitePort, `R`);
    }, 500);
    res
      .status(200)
      .send({ message: `Command send to ${PatliteIp}:${PatlitePort}` });
  } catch (err) {
    console.log(`${err}`);
    res.status(500).send({ message: `${err}` });
  }
});

module.exports = router;
