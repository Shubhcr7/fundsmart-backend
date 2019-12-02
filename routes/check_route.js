const {app}=require('../admin.js');
const control=require('../controllers/check_control.js');
module.exports=(app)=>{
    app.post('/change',control.changeData);
    app.get('/getdata',control.getData);
    app.post('/iupload',control.uploadI);
}