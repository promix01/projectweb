const   express = require("express"),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        passport = require('passport'),
        passportLocal = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        jobseekersignup = require('./models/jobseeksignup'),
        companysignup = require('./models/companysignup'),
        JobseekerRoutes = require('./routes/jobseeker'),
        indexRoutes = require('./routes/index'),
        CompanyRoutes = require('./routes/company');
        


const  app = express();




const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: false
}
mongoose.connect('mongodb+srv://promix:promix01@cluster0-hirrk.mongodb.net/test?retryWrites=true&w=majority', config);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(require('express-session')({
    secret: 'job',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.get('*',(req,res,next)=>{
    res.locals.currentUser = req.user || null
    next();
})

passport.use('joblocal', new passportLocal(jobseekersignup.authenticate()));
passport.use('companylocal', new passportLocal(companysignup.authenticate()));
passport.serializeUser(function(user, done) { 
    done(null, user);
  });
passport.deserializeUser(function(user, done) {
    if(user!=null)
      done(null,user);
      
  });

app.use('/',indexRoutes);
app.use('/jobseeker',JobseekerRoutes);
app.use('/company',CompanyRoutes);

app.listen(3000,function(req,res){
    console.log('Server has started');
});