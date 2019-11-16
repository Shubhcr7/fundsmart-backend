const {app}=require('../admin.js');
const control=require('../controllers/camp_control.js');
module.exports=(app)=>{
    app.get('/getd/:address',control.getDeployedCampaignd);
    app.post('/contribute',control.contributeC);
    app.post('/createrequest',control.createRequest);
}