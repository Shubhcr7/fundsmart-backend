const {app}=require('../admin.js');
const control=require('../controllers/camp_control.js');
module.exports=(app)=>{
    app.get('/getd/:address',control.getDeployedCampaignd);
    app.get('/getallr/:address',control.getAllRequest);
    app.post('/contribute/:address',control.contributeC);
    app.post('/createrequest/:address',control.createRequest);
}