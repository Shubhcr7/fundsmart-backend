const {app}=require('../admin.js');
const control=require('../controllers/factory_control.js');
module.exports=(app)=>{
    app.post('/upload',control.fileUploadi);
    app.post('/createcampaign',control.createCamp);
    app.get('/getall',control.getDeployedCampaignf);
    app.get('/getall/:name',control.getDeployedCampaignCat);
    app.get('/getpop',control.getPopular);
    app.get('/search/:name',control.searchCamp);
}