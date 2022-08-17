require("dotenv").config();
require("mathjs").config();
var config = require('./dbconfig');
const sql = require('mssql');

const Cities = [ 'Ankara', 'İstanbul', 'İzmir', 'Bursa', 'Edirne', 'Konya', 'Antalya', 'Diyarbakır', 'Van', 'Rize']

function randomAd(param1){
    var rndName = ''
    var char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    for (var i = 0; i < param1; i++){
        rndName += char.charAt(Math.floor(Math.random() * char.length ))
    }
    return rndName.toString()
};

async function insertandEndId_DBQuery(param1,param2){
    try {
        var pool = await sql.connect(config)
        var results = await pool.request().query(param1)
        return console.log('Insert yapıldı [TRUE], [SQL]:' + param1)
    
    } catch (error) {
        return console.log('Insert Yapılamadı [FALSE] [hata]:' +error)
    }
}

async function TestVerisiOlustur(param1,param2){
    const musteriIds = [] 
    const sepetIds = []
    var rndUserName,rndUserSurname,rndCity = ''
    try {
        var strSql = `SELECT MAX(Id) as id FROM musteri`
        let pool1 = await sql.connect(config);
        let results1 = await pool1.request().query(strSql); 
        if(!results1.recordset[0].id){
            var MAXMUSTERIID = 0
        }else{
            var MAXMUSTERIID = results1.recordset[0].id
        }
        for(var rndUserCount = 0; rndUserCount < parseInt(param1); rndUserCount++){
            rndUserName = randomAd(5)
            rndUserSurname = randomAd(5)
            musteriIds.push(MAXMUSTERIID += 1)
            rndCity = Cities[Math.floor(Math.random() * Cities.length)]
            var sqlStr = `INSERT INTO musteri (Ad, Soyad, Sehir) VALUES('${rndUserName}', '${rndUserSurname}', '${rndCity}')`
            insertandEndId_DBQuery(sqlStr,'0')
        }
        var strSql = `SELECT MAX(Id) as id FROM sepet`
        let pool2 = await sql.connect(config);
        let results2 = await pool2.request().query(strSql); 
        if(!results2.recordset[0].id){
            var MAXSEPETID = 0
        }else{
            var MAXSEPETID = results2.recordset[0].id
        }
        for(var rndSepetCount = 0; rndSepetCount < parseInt(param2); rndSepetCount++) {
            sepetIds.push(MAXSEPETID +=1)
            var rndMusteriId = musteriIds[Math.floor(Math.random() * musteriIds.length)]
            var sqlStr = `INSERT INTO sepet (MusteriId) VALUES(${rndMusteriId})`
            insertandEndId_DBQuery(sqlStr,'0')
            rndSepetUrun = Math.floor(Math.random() * 5)+1;
            for(var rndSepetUrunCount = 0; rndSepetUrunCount < rndSepetUrun; rndSepetUrunCount++){
                var tutar = Math.floor(Math.random() * 1000)+100
                var sqlStr = `INSERT INTO sepeturun (SepetId, Tutar, Aciklama) VALUES('${MAXSEPETID}', '${tutar}', 'asdc')`
                insertandEndId_DBQuery(sqlStr,'0')
            }
        }        
    } catch (error) {
        console.log(error);
    }
}

async function SehirBazliAnalizYap(){
    try {
        var strSql = `SELECT t1.Sehir as SehirAdi, Count(t3.Id) as SepetAdet, SUM(t3.Tutar) as ToplamTutar FROM satmodul.dbo.musteri t1, satmodul.dbo.sepet t2, satmodul.dbo.sepeturun t3 WHERE t1.Id = t2.MusteriId AND t2.Id = t3.SepetId GROUP BY t1.Sehir`
        let pool = await sql.connect(config);
        let results = await pool.request().query(strSql); 
        return results.recordsets;
    } catch (error) {
        console.log(error);
    }
}



//####################################################################################
async function getSelectTable(strPath) {
    try {
        var strSql = `SELECT * FROM ${strPath}`
        let pool = await sql.connect(config);
        let results = await pool.request().query(strSql); 
        return results.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getSelectTableOneRow(strPath, strControl, param1){
    try {
        var strSql = ''
        if(strControl==='id'){
            strSql = `SELECT * FROM ${strPath} WHERE Id = '${param1}'`
        }else if(strControl==='str'){
            if(strPath === 'musteri'){
                strSql = `SELECT * FROM ${strPath} WHERE Ad LIKE '%${param1}%' OR Soyad LIKE '%${param1}%' OR Sehir LIKE '%${param1}%'`
            }else if(strPath === 'sepeturun'){
                strSql = `SELECT * FROM ${strPath} WHERE Aciklama LIKE '%${param1}%'`
            }
        }else{
            strSql = `SELECT * FROM ${strPath} WHERE Id = '${param1}'`
        }
        let pool = await sql.connect(config);
        let results = await pool.request().query(strSql);
        return results.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function postRow(strPath, param1){
    try {
        var strSql = ''
        if(strPath === 'musteri'){
            strSql = `INSERT INTO ${strPath}(Ad, Soyad, Sehir) VALUES('${param1.split(':')[0]}', '${param1.split(':')[1]}', '${param1.split(':')[2]}')`
        }else if(strPath === 'sepeturun'){
            strSql = `INSERT INTO ${strPath}(SepedId, Tutar, Aciklama) VALUES('${param1.split(':')[0]}', '${param1.split(':')[1]}', '${param1.split(':')[2]}')`
        }
        let pool = await sql.connect(config);
        let results = await pool.request().query(strSql);

        return results.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function postJson(param){
    try {
        let pool = await sql.connect(config);
        let results = await pool.request()
            .input('input_Ad', sql.NVarChar, param.Ad)
            .input('input_Soyad', sql.NVarChar, param.Soyad)
            .input('input_Sehir', sql.NVarChar, param.Sehir)
            .query("INSERT INTO musteri(Ad, Soyad, Sehir) VALUES(@input_Ad, @input_Soyad, @input_Sehir)");
        return results.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getSelectTable:getSelectTable,
    getSelectTableOneRow:getSelectTableOneRow,
    postRow:postRow,
    postJson:postJson,
    TestVerisiOlustur:TestVerisiOlustur,
    SehirBazliAnalizYap:SehirBazliAnalizYap
}