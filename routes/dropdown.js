const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { dbconfig } = require('../config');

router.get('/light', async (req, res) => {
    try{
        let pool = await sql.connect(dbconfig);
        let SelectLight = `Select * FROM MasterCode WHERE CodeType = N'Light' order by CodeId`;
        let Light = await pool.request().query(SelectLight);
        res.status(200).send(JSON.stringify(Light.recordset));
    }catch(err){
        console.log(`${err}`)
        res.status(500).send({message: `${err}`})
    }
})
router.get('/buzzer', async (req, res) => {
    try{
        let pool = await sql.connect(dbconfig);
        let SelectBuzzer = `Select * FROM MasterCode WHERE CodeType = N'Buzzer' order by CodeId`;
        let Buzzer = await pool.request().query(SelectBuzzer);
        res.status(200).send(JSON.stringify(Buzzer.recordset));
    }catch(err){
        res.status(500).send({message: `${err}`})
    }
})
router.get('/flash', async (req, res) => {
    try{
        let pool = await sql.connect(dbconfig);
        let SelectFlash = `Select * FROM MasterCode WHERE CodeType = N'Flash' order by CodeId`;
        let Flash = await pool.request().query(SelectFlash);
        res.status(200).send(JSON.stringify(Flash.recordset));
    }catch(err){
        res.status(500).send({message: `${err}`})
    }
})

router.get('/patlite', async (req, res) => {
    try{
        let pool = await sql.connect(dbconfig);
        let SelectPatlite = `Select * FROM MasterPatlite order by PatliteName`;
        let Patlite = await pool.request().query(SelectPatlite);
        res.status(200).send(JSON.stringify(Patlite.recordset));
    }catch(err){
        res.status(500).send({message: `${err}`})
    }
})

router.get('/status', async (req, res) => {
    try{
        let pool = await sql.connect(dbconfig);
        let SelectStatus = `Select * FROM MasterStatus order by Status`;
        let Status = await pool.request().query(SelectStatus);
        res.status(200).send(JSON.stringify(Status.recordset));
    }catch(err){
        res.status(500).send({message: `${err}`})
    }
})

router.get('/light/:LightId', async (req, res) => {
    try{
        let LightId = req.params.LightId;
        let pool = await sql.connect(dbconfig);
        let SelectLight = `Select *
        FROM MasterLight
        WHERE LightId = ${LightId}`;
        let Light = await pool.request().query(SelectLight);
        res.status(200).send(JSON.stringify(Light.recordset[0]));
    }catch(err){
        res.status(500).send({message: `${err}`});
    }
})

module.exports = router