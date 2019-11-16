const Web3=require('web3');
const http = require('http');
const Tx = require('ethereumjs-tx').Transaction;
const web3js = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7386bdf0b20e48db9a9d4eb445bb1803"));
const compiledCamp=require('../build/Campaign.json');
const contractABIc=JSON.parse(compiledCamp.interface);
var contractAddress='0xFC7f44bCBd0381A524f3Bd839E5dAc4aDf80D589';
module.exports={    
    getDeployedCampaignd(req,res,next){
        var address=req.params.address;
        var contract=new web3js.eth.Contract(contractABIc,address);
        var name;
        var minimum;
        contract.methods.namec().call()
            .then(function(data){
                name=data;
                contract.methods.minimumContribution().call()
                .then(function(rest){
                    minimum=rest;
                    res.send(minimum);
                })    
            })
            .catch(function(err){
                res.send(err);
            })
    },

    contributeC(req,res,next){
        var count;
        web3js.eth.getTransactionCount('0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259').then(function(v){
        count=v;
        var value=req.body.value;
        var address=req.body.address;
        var contract=new web3js.eth.Contract(contractABIc,address);
        var privateKey = Buffer.from('ba69725568ff6674053b638b5a964ada3e7c5e0ef7d26f3b751d7faf9d5f9898', 'hex');
        var rawT={"from":0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259,"to":address,"value":web3js.utils.toHex(value),"gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(3100000),"data":contract.methods.contribute().encodeABI(),"nonce":web3js.utils.toHex(count)};
        var transaction = new Tx(rawT,{chain:'rinkeby', hardfork: 'petersburg'});            
        transaction.sign(privateKey);
        web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
                    .then(function(transactionHash){
                        res.send(transactionHash);
                    });
        });
    },

    createRequest(req,res,next){
        var count;
        web3js.eth.getTransactionCount('0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259').then(function(v){
        count=v;
        var description=req.body.description;
        var addressc=req.body.address;
        var recipient=req.body.recipient;
        var value=req.body.value;
        var privateKey = Buffer.from('ba69725568ff6674053b638b5a964ada3e7c5e0ef7d26f3b751d7faf9d5f9898', 'hex');
        var rawT={"from":0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259,"to":address,"value":web3js.utils.toHex(value),"gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(3100000),"data":contract.methods.contribute(createRequest(description,value,recipient)).encodeABI(),"nonce":web3js.utils.toHex(count)};
        var transaction = new Tx(rawT,{chain:'rinkeby', hardfork: 'petersburg'});            
        transaction.sign(privateKey);
        web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
                    .then(function(transactionHash){
                        res.send(transactionHash);
                    });
        });
    }
}