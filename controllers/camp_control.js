const Web3=require('web3');
const http = require('http');
const Tx = require('ethereumjs-tx');
const web3js = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7386bdf0b20e48db9a9d4eb445bb1803"));
const compiledCamp=require('../build/Campaign.json');
const contractABIc=JSON.parse(compiledCamp.interface);
var contractAddress='0x6eBb10Dda93790b0D5d5703e84288A7728a9C2Fc';
module.exports={    
    getDeployedCampaignd(req,res,next){
        var address=req.params.address;
        var obj={};
        var func=async()=>{
            var contracti =await new web3js.eth.Contract(contractABIc, address);
            obj.name = await contracti.methods.namec().call()
            obj.min=await contracti.methods.minimumContribution().call()/Math.pow(10,18);
            obj.idea = await contracti.methods.ideac().call()
            obj.balance = await web3js.eth.getBalance(address)/Math.pow(10,18);
            obj.goal = await contracti.methods.goalc().call()/Math.pow(10,18);
            obj.manager=await contracti.methods.manager().call();
            obj.proj_type = await contracti.methods.proj_typec().call();
            obj.address=address;
            return obj;
        }
        func().then(function(data){
            res.send(data);
        })
    },

    contributeC(req,res,next){
        var count;
        var address=req.params.address;
        var value=(req.body.value*Math.pow(10,18)).toString();
        var contract=new web3js.eth.Contract(contractABIc,address)
        var func=async()=>{
            var min=await contract.methods.minimumContribution().call();
            return min;
        }
        func().then(function(min){
            if(value>=min){
                    web3js.eth.getTransactionCount(process.env.acaddress).then(function(v){
                        count=v;
                        var privateKey = Buffer.from(process.env.pk, 'hex');
                        var rawT={"from":process.env.acaddress,"to":address,"value":web3js.utils.toHex(value),"gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(4100000),"data":contract.methods.contribute().encodeABI(),"nonce":web3js.utils.toHex(count)};
                        var transaction = new Tx(rawT,{chain:'rinkeby', hardfork: 'petersburg'});            
                        transaction.sign(privateKey);
                        web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
                                    .then(function(transactionHash){
                                        res.send(transactionHash);
                                    });
                });
            }
            else{
                res.send('value is too low');
            }
        })
    },

    createRequest(req,res,next){
        var count;
        web3js.eth.getTransactionCount(process.env.acaddress).then(function(v){
        count=v;
        var description=req.body.description;
        var addressc=req.params.address;
        var recipient=req.body.recipient;
        var value=(req.body.value*Math.pow(10,18)).toString();
        var contract=new web3js.eth.Contract(contractABIc,addressc);
        var privateKey = Buffer.from(process.env.pk, 'hex');
        var rawT={"from":process.env.acaddress,"to":addressc,"value":"0x0","gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(3100000),"data":contract.methods.createRequest(description,value,recipient).encodeABI(),"nonce":web3js.utils.toHex(count)};
        var transaction = new Tx(rawT,{chain:'rinkeby', hardfork: 'petersburg'});            
        transaction.sign(privateKey);
        web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
                    .then(function(transactionHash){
                        res.send(transactionHash);
                    });
        });
    },

    getAllRequest(req,res,next){
        var address=req.params.address;
        var contract=new web3js.eth.Contract(contractABIc,address);
        var arr=[];
        var i;
        contract.methods.getRequestsCount().call()
            .then(function(length){    
                var func=async()=>{
                    for(i=0;i<length;i++){
                        var data=await contract.methods.requests(i).call()
                        arr.push(data);
                    }
                    return arr;
                }
                func().then((arrd)=>{
                    res.send(arrd);
                });
            })
            .catch(function(err){
                res.send(err);
        })
    },

    count(req,res,next){
        var address=req.params.address;
        var contract=new web3js.eth.Contract(contractABIc,address);
        contract.methods.getRequestsCount().call()
            .then(function(data){
                res.send(data);
            })
            .catch(function(err){
                res.send(err);
            })
    },
    
    approveRequest(req,res,next){
        var count;
        var data = req.params.addressi.split("_");
        var index=data[1];
        var addressc=data[0];
        var contract=new web3js.eth.Contract(contractABIc,addressc);
        var func=async()=>{
            var aprv=await contract.methods.checkApprover().call({from:process.env.acaddress});
            return aprv;
        }
        func().then(function(apr){
            if(apr==1){
                web3js.eth.getTransactionCount(process.env.acaddress).then(function(v){
                    count=v;
                    var privateKey = Buffer.from(process.env.pk, 'hex');
                    var rawT={"from":process.env.acaddress,"to":addressc,"value":"0x0","gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(3100000),"data":contract.methods.approveRequest(index).encodeABI(),"nonce":web3js.utils.toHex(count)};
                    var transaction = new Tx(rawT,{chain:'rinkeby', hardfork: 'petersburg'});            
                    transaction.sign(privateKey);
                    web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
                                .then(function(transactionHash){
                                    res.send(transactionHash);
                                });
                    });
            }
            else{
                res.send('Invalid User');
            }
        })
        
    },

    finializeRequests(req,res,next){
        var count;
        var data = req.params.addressi.split("_");
        var index=data[1];
        var addressc=data[0];
        var contract=new web3js.eth.Contract(contractABIc,addressc);
        var mgr=process.env.acaddress
        var func=async()=>{
            var manager=await contract.methods.manager().call();
            return manager;
        }
        func().then(function(manager){
            
            if(manager==mgr){
                web3js.eth.getTransactionCount(process.env.acaddress).then(function(v){
                    count=v;
                    var privateKey = Buffer.from(process.env.pk, 'hex');
                    var rawT={"from":process.env.acaddress,"to":addressc,"value":"0x0","gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(3100000),"data":contract.methods.finalizeRequest(index).encodeABI(),"nonce":web3js.utils.toHex(count)};
                    var transaction = new Tx(rawT,{chain:'rinkeby', hardfork: 'petersburg'});            
                    transaction.sign(privateKey);
                    web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
                                .then(function(transactionHash){
                                    res.send(transactionHash);
                                });
                    });
            }
            else{
                res.send('Invalid user');
            }
        })
    }
}