var dbop = require('./dboperations');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router(); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api',router);

router.route('/TestVerisiOlustur/:musterAdet/:sepetAdet').get((req,res)=>{
    dbop.TestVerisiOlustur(req.params.musterAdet,req.params.sepetAdet).then(result=>{
        res.status(201).json(result);
    })
})
router.route('/SehirBazliAnalizYap').get((req,res)=>{
    dbop.SehirBazliAnalizYap().then(result=>{
        res.status(201).json(result);
    })
})

router.route('/get/:Name').get((req, res)=>{
    dbop.getSelectTable(req.params.Name).then(result =>{
        res.json(result[0]);
    })
})

router.route('/get/:Name/:Param').get((req, res)=>{
    dbop.getSelectTableOneRow(req.params.Name.split(':')[0],req.params.Name.split(':')[1],req.params.Param).then(result =>{
        res.json(result[0]);
    })
})

router.route('/post/:Name/:Param').post((req, res)=>{
    dbop.postRow(req.params.Name, req.params.Param).then(result=>{
        res.status(201).json(result);
    })
})

router.route('/musteri').post((req, res)=>{
    let param = {...req.body}
    dbop.postJson(param).then(result=>{
        res.status(201).json(result);
    })
})

var PORT = process.env.PORT;
app.listen(PORT);
console.log(`Live on port http://${process.env.DB_HOST}:${process.env.PORT}/`);
