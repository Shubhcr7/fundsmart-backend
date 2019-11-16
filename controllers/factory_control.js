const Web3=require('web3');
const http = require('http');
const Tx = require('ethereumjs-tx').Transaction;
const web3js = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7386bdf0b20e48db9a9d4eb445bb1803"));
const compiledCampf=require('../build/CampaignFactory.json');
const contractABI=JSON.parse(compiledCampf.interface);
const compiledCamp=require('../build/Campaign.json');
const contractABIc=JSON.parse(compiledCamp.interface);
var contractAddress='0x6E5cc6982127216143cCae41c85fA7644394c6D1';
var contract=new web3js.eth.Contract(contractABI,contractAddress);
module.exports={

    createCamp(req,res,next){
        var count;
        web3js.eth.getTransactionCount('0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259').then(function(v){
        count=v;
        var minimum=req.body.funds;
        var name=req.body.name;
        var about=req.body.about;
        var idea=req.body.idea;
        var prod_desc=req.body.prod_desc;
        var proj_type=req.body.proj_type;
        var privateKey = Buffer.from('ba69725568ff6674053b638b5a964ada3e7c5e0ef7d26f3b751d7faf9d5f9898', 'hex');
        var rawT={"from":0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259,"to":contractAddress,"value":"0x0","gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(2100000),"data":contract.methods.createCampaign(minimum,name,about,idea,prod_desc,proj_type).encodeABI(),"nonce":web3js.utils.toHex(count)};
        var transaction = new Tx(rawT,{chain:'rinkeby', hardfork: 'petersburg'});            
        transaction.sign(privateKey);
        web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
                    .then(function(transactionHash){
                        res.send(transactionHash);
                    });
        });
    },
    
    getDeployedCampaignf(req,res,next){
        contract.methods.getDeployedCampaigns().call()
                .then(function(data){
                    res.send(data);
                })
                .catch(function(err){
                    res.send(err);
                })
    }
}