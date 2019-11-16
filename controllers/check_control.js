const Web3=require('web3');
const http = require('http');
const Tx = require('ethereumjs-tx').Transaction;
const web3js = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7386bdf0b20e48db9a9d4eb445bb1803"));
const contractABI=[{"constant":false,"inputs":[{"name":"newMessage","type":"string"}],"name":"setMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"message","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialMessage","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var contractAddress='0xb56F06043cc06c93BFBcD03E16a4e2C5b2595a0C';
var contract=new web3js.eth.Contract(contractABI,contractAddress);
module.exports={

    changeData(req,res,next){
        var count;
        web3js.eth.getTransactionCount('0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259').then(function(v){
        count=v;
        var name=req.body.name;
        var privateKey = Buffer.from('ba69725568ff6674053b638b5a964ada3e7c5e0ef7d26f3b751d7faf9d5f9898', 'hex');
        var rawT={"from":0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259,"to":contractAddress,"value":"0x0","gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(210000),"data":contract.methods.setMessage(name).encodeABI(),"nonce":web3js.utils.toHex(count)};
        var transaction = new Tx(rawT,{chain:'rinkeby', hardfork: 'petersburg'});            
        transaction.sign(privateKey);
        web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
                    .on('transactionHash',console.log)
                    .then(()=>{
                        res.send('Success');
                    });
        });
    },

    getData(req,res,next){
        contract.methods.message().call({from:'0xb9bEb78AFD25A0a26E1fc6501e23E70F1B010259'}).then(function(data){
            res.send(data);
        }).catch(function(err) {
            console.log(err);
        });
    }
}