const express = require('express')
const session = require('express-session')
const apiRoute = require('./routes/apiRoute')
const methodOverride = require('method-override')
const hbs = require('hbs')
// const dotenv = require('dotenv')
// const morgan = require('morgan')

//init
const app = express()


//Port env var
const PORT = process.env.PORT || 5050
const path = require('path')
require('./db')

//session 
app.use(express.urlencoded({extended:false}))
app.use(session({
    name:'Company',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: 
    { 
    maxAge: 1000*60*60*24
    }
  }
  ))
app.use(methodOverride('_method'))
app.use(apiRoute)

//hbs as template engine
app.set('view engine','hbs')
app.set('view options','layout')
app.set("views", path.join(__dirname, "views", "pages"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));


// app.use(userNormalRoutes);
// app.use(userApiRoutes);


app.listen(PORT,()=>{
    console.log(`Server is Running @ ${PORT}`)
})