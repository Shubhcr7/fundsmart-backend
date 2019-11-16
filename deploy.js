const HDWalletProvider=require('truffle-hdwallet-provider');
const Web3=require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const provider=new HDWalletProvider('nurse congress disorder escape canoe vibrant lawn piece penalty fold prepare race',
'https://rinkeby.infura.io/v3/7386bdf0b20e48db9a9d4eb445bb1803'
);

const web3=new Web3(provider);

const deploy=async()=>{
    const accounts=await web3.eth.getAccounts();
    console.log(accounts[0]);

const CampaignFactory=await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
.deploy({data:compiledFactory.bytecode})
.send({from:accounts[0],gas:'5000000'});
    console.log(CampaignFactory.options.address);
};

deploy();