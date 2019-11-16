const {app}=require('../admin.js');
const control=require('../controllers/camp_control.js');
module.exports=(app)=>{
    app.get('/getd/:address',control.getDeployedCampaignd);
    app.get('/getallr/:address',control.getAllRequest);
    app.post('/contribute/:address',control.contributeC);
    app.post('/createrequest/:address',control.createRequest);
    app.post('/approverequest/:addressi',control.approveRequest);
    app.post('/finalrequest/:addressi',control.finializeRequests);
    app.get('/count/:address',control.count);
}