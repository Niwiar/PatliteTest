const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { dbconfig } = require('../config')

router.get('/list', async (req, res) => {
    try{
        let SelectLight = `SELECT row_number() over(order by PatliteId) as 'index', *
            FROM MasterPatlite`
        let pool = await sql.connect(dbconfig);
        let Light = await pool.request().query(SelectLight);
        res.status(200).send(JSON.stringify(Light.recordset));
    }catch(err){
        res.status(500).send({message: `${err}`});
    }
})

router.post('/add', async (req, res, next) => {
    try{
        let { PatliteName, PatliteIp, PatlitePort } = req.body
        if (PatliteName == '' || PatliteIp == '' || PatlitePort == '') {
            res.status(400).send({message: "Please enter every field"});
            return;
        }
        let pool = await sql.connect(dbconfig);
        let CheckPatlite = await pool.request().query(`SELECT CASE
        WHEN EXISTS(
            SELECT *
            FROM MasterPatlite
            WHERE PatliteName = N'${PatliteName}' OR PatliteIp = N'${PatliteIp}'
        )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`);
        if(CheckPatlite.recordset[0].check){
            res.status(400).send({message: 'Duplicate Name or Ip'});
        } else {
            let InsertPatlite = `INSERT INTO MasterPatlite(PatliteName, PatliteIp, PatlitePort)
                VALUES(N'${PatliteName}', N'${PatliteIp}', N'${PatlitePort}')`;
            await pool.request().query(InsertPatlite);
            res.status(201).send({message: 'Successfully add Patlite'});
        }
    } catch(err){
        console.log(`${err}`)
        res.status(500).send({message: `${err}`});
    }
})

router.put('/edit/:PatliteId', async (req, res) => {
    try{
        let PatliteId = req.params.PatliteId;
        let { PatliteName, PatliteIp, PatlitePort } = req.body
        if (PatliteName == '' || PatliteIp == '' || PatlitePort == '') {
            res.status(400).send({message: "Please enter every field"});
            return;
        }
        let pool = await sql.connect(dbconfig);
        let CheckPatlite = await pool.request().query(`SELECT CASE
            WHEN EXISTS(
                SELECT *
                FROM MasterPatlite
                WHERE NOT PatliteId = ${PatliteId} AND (PatliteName = N'${PatliteName}' OR PatliteIp = N'${PatliteIp}')
            )
            THEN CAST (1 AS BIT)
            ELSE CAST (0 AS BIT) END AS 'check'`);
        if(CheckPatlite.recordset[0].check){
            res.status(400).send({message: 'Duplicate Name or Ip'});
        } else{
            let UpdatePatlite = `UPDATE MasterPatlite
                SET PatliteName = N'${PatliteName}', PatliteIp = N'${PatliteIp}', PatlitePort = N'${PatlitePort}'
                WHERE PatliteId = ${PatliteId}`;
            await pool.request().query(UpdatePatlite);
            res.status(200).send({message: `Successfully edit Patlite`});
        }
    } catch(err){
        res.status(500).send({message: `${err}`});
    }
})

router.delete('/delete/:PatliteId', async (req, res) => {
    try{
        let PatliteId = req.params.PatliteId;
        let DeletePatlite = `DELETE FROM MasterPatlite
        WHERE PatliteId = ${PatliteId}`;
        let pool = await sql.connect(dbconfig);
        await pool.request().query(DeletePatlite);
        res.status(200).send({message: `Successfully delete Patlite`});
    } catch(err){
        res.status(500).send({message: `${err}`});
    }
})

module.exports = router