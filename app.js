const express = require('express')
const app = express()
const logger = require('morgan')
const db = require('./config/connection')
const port = 5000
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const adminRouter = require('./routes/admin')
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.use(express.urlencoded({extended:true}))
app.use(logger('dev'))
app.use(expressLayout)

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.set('layout','./layout/layout')
app.use(cookieParser())
app.use(session({secret:'thisismysecretecode',saveUninitialized:true,cookie:{maxAge:60000},resave:false}))


app.use(function (req, res, next) {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});



db.connect((err)=>{
    if(err){
        console.log("Database not Connected");
    }
    else{
        console.log(" Database Conected");
    }
})
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))




app.use('/admin',adminRouter)





app.listen(port)