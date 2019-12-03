const Web3 = require('web3');
const http = require('http');
const _=require('lodash');
const Tx = require('ethereumjs-tx');
const fs = require('fs-extra');
const formidable = require('formidable');
const fileUpload = require('express-fileupload');
const web3js = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7386bdf0b20e48db9a9d4eb445bb1803"));
const compiledCampf = require('../build/CampaignFactory.json');
const contractABI = JSON.parse(compiledCampf.interface);
const compiledCamp = require('../build/Campaign.json');
const contractABIc = JSON.parse(compiledCamp.interface);
var contractAddress = '0x6B78Fb399616d5404c37aB9650377226f534ab29';
var contract = new web3js.eth.Contract(contractABI, contractAddress);
const moveFile=require('move-file');
module.exports = {
    
    setDetails(req,res,next){
        process.env.acaddress = req.body.acaddress;
        process.env.pk=req.body.pk;
        res.send('success');
    },

    unsetDetails(req,res,next){
        process.env.acaddress ="";
        process.env.pk="";
        res.send('success');
    },

    createCamp(req,res,next){
        var i;
        var k;
        var arrk=[];
        var arri = [];
        var obj = {};
        contract.methods.getDeployedCampaigns().call()
            .then(function(arr){
                var func=async()=>{
                    for(i=0;i<arr.length;i++){
                        var contracti = await new web3js.eth.Contract(contractABIc, arr[i]);
                        obj.name = await contracti.methods.namec().call()
                        obj.address=arr[i];
                        arri.push(obj);
                        obj = {};   
                    }
                    return arri;
                }
                func().then((arrd) => {
                    var namec=req.body.name;
                    arrd = _.find(arrd,{name:namec});
                    if(arrd==undefined){
                        var count;
                        web3js.eth.getTransactionCount(process.env.acaddress).then(function (v) {
                            count = v;
                            var details=JSON.parse(req.body.details);
                            var goal = details.goal;
                            var minimum =details.funds;
                            var name = namec;
                            var about = details.about;
                            var idea = details.idea;
                            var prod_desc = details.prod_desc;
                            var proj_type = details.proj_type;
                            var file=req.files.image;
                            var filename=file.name;
                            const buildPath = '../PROJECT/src/assets/images/'+name;
                            fs.ensureDirSync(buildPath);
                            const fl=buildPath+'/'+filename
                            var privateKey = Buffer.from(process.env.pk, 'hex');
                            var rawT = { "from":process.env.acaddress, "to": contractAddress, "value": "0x0", "gasPrice": web3js.utils.toHex(20 * 1e9), "gasLimit": web3js.utils.toHex(2100000), "data": contract.methods.createCampaign(goal,minimum, name, about, idea, prod_desc, proj_type , fl).encodeABI(), "nonce": web3js.utils.toHex(count) };
                            var transaction = new Tx(rawT, { chain: 'rinkeby', hardfork: 'petersburg' });
                            transaction.sign(privateKey);
                            web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
                                .then(function (transactionHash) {
                                    if(transactionHash.status==true){
                                        
                                        file.mv(fl,function(err){
                                            if(!err){
                                                console.log('success');
                                            }
                                        })
                                    }
                                    res.send(transactionHash);
                                });
                        });
                    }
                    else{
                        res.send('Already Exist');
                    }
                })
            })
            .catch(function(err){
                res.send(err);
            })
    },

    getDeployedCampaignf(req, res, next) {
        var arr = [];
        var obj = {};
        contract.methods.getDeployedCampaigns().call()
            .then(function (adata) {
                var func = async () => {
                    for (i = 0; i < adata.length && i < 12; i++) {
                        var contracti = await new web3js.eth.Contract(contractABIc, adata[i]);
                        obj.name = await contracti.methods.namec().call();
                        obj.idea = await contracti.methods.ideac().call();
                        obj.fl=await contracti.methods.fl().call();
                        obj.balance = await web3js.eth.getBalance(adata[i])/Math.pow(10,18);
                        obj.goal = await contracti.methods.goalc().call()/Math.pow(10,18);
                        obj.manager=await contracti.methods.manager().call();
                        obj.proj_type = await contracti.methods.proj_typec().call();
                        obj.minimum=await contracti.methods.minimumContribution().call()/Math.pow(10,18);
                        obj.address=adata[i];
                        arr.push(obj);
                        obj = {};
                    }
                    return arr;
                }
                func().then((arrd) => {
                    res.send(arrd);
                });
            })
            .catch(function (err) {
                res.send(err);
            })
    },

    getManagerCampaign(req,res,next){
        var arr = [];
        var obj = {};
        var i;
        var address=req.params.address;
        contract.methods.getDeployedCampaigns().call()
            .then(function (adata) {
                var func = async () => {
                    for (i = 0; i < adata.length && i < 12; i++) {
                        var contracti = await new web3js.eth.Contract(contractABIc, adata[i]);
                        obj.name = await contracti.methods.namec().call();
                        obj.idea = await contracti.methods.ideac().call();
                        obj.fl=await contracti.methods.fl().call();
                        obj.balance = await web3js.eth.getBalance(adata[i])/Math.pow(10,18);
                        obj.goal = await contracti.methods.goalc().call()/Math.pow(10,18);
                        obj.manager=await contracti.methods.manager().call();
                        obj.proj_type = await contracti.methods.proj_typec().call();
                        obj.address=adata[i];
                        arr.push(obj);
                        obj = {};
                    }
                    return arr;
                }
                func().then((arrd) => {
                    arrd=_.filter(arrd, function(o) {
                        return o.manager === address;
                    })
                    res.send(arrd);
                })
            })
            .catch(function (err) {
                res.send(err);
            })
    },

    getDeployedCampaignCat(req, res, next) {
        var arr = [];
        var obj = {};
        var i;
        var title=req.params.name;
        contract.methods.getDeployedCampaigns().call()
            .then(function (adata) {
                var func = async () => {
                    for (i = 0; i < adata.length && i < 12; i++) {
                        var contracti = await new web3js.eth.Contract(contractABIc, adata[i]);
                        obj.name = await contracti.methods.namec().call();
                        obj.idea = await contracti.methods.ideac().call();
                        obj.fl=await contracti.methods.fl().call();
                        obj.balance = await web3js.eth.getBalance(adata[i])/Math.pow(10,18);
                        obj.goal = await contracti.methods.goalc().call()/Math.pow(10,18);
                        obj.manager=await contracti.methods.manager().call();
                        obj.proj_type = await contracti.methods.proj_typec().call();
                        obj.address=adata[i];
                        arr.push(obj);
                        obj = {};
                    }
                    return arr;
                }
                func().then((arrd) => {
                    arrd=_.filter(arrd, function(o) {
                        return o.proj_type === title;
                    })
                    res.send(arrd);
                })
            })
            .catch(function (err) {
                res.send(err);
            })
    },

    getPopular(req,res,next){
        var i;
        var k;
        var arrk=[];
        var arri = [];
        var obj = {};
        contract.methods.getDeployedCampaigns().call()
            .then(function(arr){
                var func=async()=>{
                    for(i=0;i<arr.length;i++){
                        var contracti = await new web3js.eth.Contract(contractABIc, arr[i]);
                        obj.name = await contracti.methods.namec().call();
                        obj.idea = await contracti.methods.ideac().call();
                        obj.fl=await contracti.methods.fl().call();
                        obj.balance = await web3js.eth.getBalance(arr[i])/Math.pow(10,18);
                        obj.goal = await contracti.methods.goalc().call()/Math.pow(10,18);
                        obj.manager=await contracti.methods.manager().call();
                        obj.proj_type = await contracti.methods.proj_typec().call();
                        obj.address=arr[i];
                        arri.push(obj);
                        obj = {};   
                    }
                    return arri;
                }
                func().then((arrd) => {
                    arrd = _.orderBy(arrd, ['balance'],['desc']);
                    return arrd;
                }).then((arrd)=>{
                    for(k=0;k<5 && k<arrd.length;k++){
                        arrk.push(arrd[k]);
                    }
                    res.send(arrk);
                })
            })
            .catch(function(err){
                res.send(err);
            })
    },

    searchCamp(req,res,next){
        var namec=req.params.name;
        var i;
        var k;
        var arrk=[];
        var arri = [];
        var obj = {};
        contract.methods.getDeployedCampaigns().call()
            .then(function(arr){
                var func=async()=>{
                    for(i=0;i<arr.length;i++){
                        var contracti = await new web3js.eth.Contract(contractABIc, arr[i]);
                        obj.name = await contracti.methods.namec().call();
                        obj.idea = await contracti.methods.ideac().call();
                        obj.fl=await contracti.methods.fl().call();
                        obj.balance = await web3js.eth.getBalance(arr[i])/Math.pow(10,18);
                        obj.goal = await contracti.methods.goalc().call()/Math.pow(10,18);
                        obj.manager=await contracti.methods.manager().call();
                        obj.proj_type = await contracti.methods.proj_typec().call();
                        obj.address=arr[i];
                        arri.push(obj);
                        obj = {};   
                    }
                    return arri;
                }
                func().then((arrd) => {
                    arrd = _.find(arrd,{name:namec});
                    if(arrd==undefined){
                        res.send('error');
                    }
                    res.send(arrd);
                })
            })
            .catch(function(err){
                res.send(err);
            })
    }
}