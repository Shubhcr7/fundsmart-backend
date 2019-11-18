const Web3 = require('web3');
const http = require('http');
const _=require('lodash');
const Tx = require('ethereumjs-tx').Transaction;
const web3js = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7386bdf0b20e48db9a9d4eb445bb1803"));
const compiledCampf = require('../build/CampaignFactory.json');
const contractABI = JSON.parse(compiledCampf.interface);
const compiledCamp = require('../build/Campaign.json');
const contractABIc = JSON.parse(compiledCamp.interface);
var contractAddress = '0xb5CB8947e5C05c3250324401F1769552d37Ad539';
var contract = new web3js.eth.Contract(contractABI, contractAddress);
module.exports = {

    createCamp(req, res, next) {
        var count;
        web3js.eth.getTransactionCount('0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259').then(function (v) {
            count = v;
            var goal = req.body.goal;
            var minimum = req.body.funds;
            var name = req.body.name;
            var about = req.body.about;
            var idea = req.body.idea;
            var prod_desc = req.body.prod_desc;
            var proj_type = req.body.proj_type;
            var privateKey = Buffer.from('ba69725568ff6674053b638b5a964ada3e7c5e0ef7d26f3b751d7faf9d5f9898', 'hex');
            var rawT = { "from": 0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259, "to": contractAddress, "value": "0x0", "gasPrice": web3js.utils.toHex(20 * 1e9), "gasLimit": web3js.utils.toHex(2100000), "data": contract.methods.createCampaign(goal, minimum, name, about, idea, prod_desc, proj_type).encodeABI(), "nonce": web3js.utils.toHex(count) };
            var transaction = new Tx(rawT, { chain: 'rinkeby', hardfork: 'petersburg' });
            transaction.sign(privateKey);
            web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
                .then(function (transactionHash) {
                    res.send(transactionHash);
                });
        });
    },

    getDeployedCampaignf(req, res, next) {
        var arr = [];
        var obj = {};
        contract.methods.getDeployedCampaigns().call()
            .then(function (adata) {
                var func = async () => {
                    for (i = 0; i < adata.length && i < 12; i++) {
                        var contracti = await new web3js.eth.Contract(contractABIc, adata[i]);
                        obj.name = await contracti.methods.namec().call()
                        obj.idea = await contracti.methods.ideac().call()
                        obj.balance = await web3js.eth.getBalance(adata[i]);
                        obj.goal = await contracti.methods.goalc().call();
                        obj.manager=await contracti.methods.manager().call();
                        obj.proj_type = await contracti.methods.proj_typec().call();
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

    getDeployedCampaignCat(req, res, next) {
        var arr = [];
        var obj = {};
        var i;
        var title=req.params.name;
        contract.methods.getDeployedCampaigns().call()
            .then(function (adata) {
                var func = async () => {
                    console.log(adata.length);
                    for (i = 0; i < adata.length && i < 12; i++) {
                        var contracti = await new web3js.eth.Contract(contractABIc, adata[i]);
                        obj.name = await contracti.methods.namec().call()
                        obj.idea = await contracti.methods.ideac().call()
                        obj.balance = await web3js.eth.getBalance(adata[i]);
                        obj.goal = await contracti.methods.goalc().call();
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
                        obj.name = await contracti.methods.namec().call()
                        obj.idea = await contracti.methods.ideac().call()
                        obj.balance = await web3js.eth.getBalance(arr[i]);
                        obj.goal = await contracti.methods.goalc().call();
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
                    for(k=0;k<5;k++){
                        arrk.push(arrd[k]);
                    }
                    res.send(arrk);
                })
            })
            .catch(function(err){
                res.send(err);
            })
    }
}