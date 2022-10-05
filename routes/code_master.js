const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { dbconfig } = require('../config')

router.get('/list', async (req, res) => {
    try{
        let SelectLight = `SELECT row_number() over(order by CodeId) as 'index', *
            FROM MasterCode`
        let pool = await sql.connect(dbconfig);
        let Light = await pool.request().query(SelectLight);
        res.status(200).send(JSON.stringify(Light.recordset));
    }catch(err){
        res.status(500).send({message: `${err}`});
    }
})

router.post('/add', async (req, res, next) => {
    try{
        let { CodeId, CodeName, CodeType, Code } = req.body
        if (CodeId == '' || CodeName == '' || CodeType == '' || Code == '') {
            res.status(400).send({message: "Please enter every field"});
            return;
        }
        let pool = await sql.connect(dbconfig);
        let CheckCode = await pool.request().query(`SELECT CASE
        WHEN EXISTS(
            SELECT *
            FROM MasterCode
            WHERE CodeId = ${CodeId} OR ((CodeName = N'${CodeName}' OR Code = N'${Code}') AND CodeType = N'${CodeId}')
        )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`);
        if(CheckCode.recordset[0].check){
            res.status(400).send({message: 'Duplicate Id, Name or Code in same Type'});
        } else {
            let InsertCode = `INSERT INTO MasterCode(CodeId, CodeName, CodeType, Code)
                VALUES(${CodeId}, N'${CodeName}', N'${CodeType}', N'${Code}')`;
            await pool.request().query(InsertCode);
            res.status(201).send({message: 'Successfully add Code'});
        }
    } catch(err){
        console.log(`${err}`)
        res.status(500).send({message: `${err}`});
    }
})

router.put('/edit/:OldCodeId', async (req, res) => {
    try{
        let OldCodeId = req.params.OldCodeId;
        let { CodeId, CodeName, CodeType, Code } = req.body
        if (CodeId == '' || CodeName == '' || CodeType == '' || Code == '') {
            res.status(400).send({message: "Please enter every field"});
            return;
        }
        let pool = await sql.connect(dbconfig);
        let CheckCode = await pool.request().query(`SELECT CASE
            WHEN EXISTS(
                SELECT *
                FROM MasterCode
                WHERE NOT CodeId = ${OldCodeId} AND ((CodeId = ${CodeId} OR CodeName = N'${CodeName}' OR Code = N'${Code}') AND CodeType = N'${CodeType}')
            )
            THEN CAST (1 AS BIT)
            ELSE CAST (0 AS BIT) END AS 'check'`);
        if(CheckCode.recordset[0].check){
            res.status(400).send({message: 'Duplicate Id, Name or Code in same Type'});
        } else{
            let UpdateCode = `UPDATE MasterCode
                SET CodeId = ${CodeId}, CodeName = N'${CodeName}', CodeType = N'${CodeType}', Code = N'${Code}'
                WHERE CodeId = ${OldCodeId}`;
            await pool.request().query(UpdateCode);
            res.status(200).send({message: `Successfully edit Code`});
        }
    } catch(err){
        res.status(500).send({message: `${err}`});
    }
})

router.delete('/delete/:CodeId', async (req, res) => {
    try{
        let CodeId = req.params.CodeId;
        let DeleteCode = `DELETE FROM MasterCode
        WHERE CodeId = ${CodeId}`;
        let pool = await sql.connect(dbconfig);
        await pool.request().query(DeleteCode);
        res.status(200).send({message: `Successfully delete Code`});
    } catch(err){
        res.status(500).send({message: `${err}`});
    }
})

module.exports = router