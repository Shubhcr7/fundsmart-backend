const express=require('express');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser');
const fileUpload = require('express-fileupload');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
const factory_route=require('./routes/factory_route');
factory_route(app);
const camp_route=require('./routes/camp_route');
camp_route(app);
module.exports={
    app:app
};