const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000
const mongoose = require("mongoose")
const hbs = require("hbs")
const session = require('express-session')
const flash = require('connect-flash');
const passport =require("passport")
const User = require('./model/User')
const MongoStore = require('connect-mongo');


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/subscription' })
}))


app.use(flash());

app.use((req, res, next) => {
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) { });
app.use(express.static(path.join(__dirname, 'public')))

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes')

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/',subscriptionRoutes);

app.get('*', (req, res) => {
    res.send('Page not found');
});

mongoose.connect('mongodb://127.0.0.1:27017/subscription')
    .then(() => {
        app.listen(PORT, () => {
            console.log('http://localhost:' + PORT)
        })
    })
