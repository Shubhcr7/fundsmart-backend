const {app}=require('../admin.js');
const control=require('../controllers/factory_control.js');
module.exports=(app)=>{
    app.post('/createcampaign',control.createCamp);
    app.get('/getall',control.getDeployedCampaignf);
}