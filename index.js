if(process.env.NODE_ENV !== "production"){
require('dotenv').config();

};

// lhaja li nktbouha f fichie ta .env ya9rahelna console ti3na nrml b sbeb if adik
// w les condition li dernehm
//hadouma stora li ktebnehm louwlin tab3in l package  dotenv  a fichier li derneh ta env



const express = require('express');
const app = express();

//const serverless = require('serverless-http')
const path =require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash = require('connect-flash');
const methodOverride=require('method-override');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const userRoutes=require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');//mongo ijection 
//const helmet =require('helmet');// ada package okher nakhdmou bih securité ti3na l xss

const ExpressError=require('./utils/ExpressError');
const CampgroundRoutes=require('./routes/campgrounds');
const ReviewRoutes=require('./routes/reviews');
const MongoStore = require('connect-mongo');// using mongo for your session store


mongoose.connect(`${process.env.DB_URL}`,{useNewUrlParser:true , useUnifiedTopology:true})
.then(()=>{
   console.log("that's run good")
})
.catch((err)=>{
   console.log('its error ')
   console.log(err)
});


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
   replaceWith: '_',
 })); //adi tab3a l mongo injection 
app.engine('ejs',ejsMate);



const sessionConfig={
   //name:'blah', // wela nbdlou ism session ti3na ken esmha par default ana glebneh hna blah 
   store: MongoStore.create({ 
      mongoUrl:process.env.DB_URL,
      secret:`${process.env.SECRET_SESSION}`,
      // touchAfter: 24 * 3600 
      // using mongo for your session store
    }),// using mongo for your session store hadi louwla brk 
   secret:`${process.env.SECRET_SESSION}`,
   resave:false,
   saveUninitialized:true,
   cookie:{
     // httpOnly:true,// bah n'evitiw xss nzidou hadi w ta3 secure li lta7t 
     // secure:true,
      expires:Date.now() + 1000 * 60 * 60 * 24 * 7 ,
      maxAge: 1000 * 60 * 60 * 24 * 7 ,
      // hadi la date li tro7lna faha cookiee khlah
   }
}


app.use(session(sessionConfig));//hadi lezem tkoun befor password session
app.use(flash());
//app.use(helmet())


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());//telling  passport how to serializeuser
passport.deserializeUser(User.deserializeUser());// how do get user out of the session


app.use((req,res,next)=>{
   res.locals.currentUser = req.user;// hadi dernaha bah ki tkoun dekhel f la page tjik ghir login w register bah todkhel w ki tsejel tjik lougout brk 
   res.locals.success=req.flash('success');
   res.locals.error=req.flash('error')
   next()
});

//app.get('/fakeUser',async (req,res)=>{
 //  const user = new User({email:'karim@gmail.com',username:'karim'});
 //  const newUser=await User.register(user,'chicken')// 1 user ti3na w 2 éme aw password adeka
 //  res.send(newUser)  
//})


app.use('/',userRoutes)
app.use('/campgrounds',CampgroundRoutes); // hadi khasa b router koul campground ti3i exportithm hna f variable adeka
app.use('/campgrounds/:id/reviews',ReviewRoutes);
app.use(express.static(path.join(__dirname,'public')));
//hadi dernaha pasque f fichier boilerplate script ma7abetch ta9ralna hello.js wa7dha aya 
//lezem ndirou hadi bah tweli nrml ta9raha





app.get('/',(req,res)=>{
   res.render('campgrounds/home')
});


app.all('*',(req,res,next)=>{
   next(new ExpressError('page not found',404))
   
});

app.use((err,req,res,next)=>{
   const {statusCode=500}=err;
   if(!err.message) err.message= 'oh something went wrong'
   
   res.status(statusCode).render('error',{err})
   
});


 
app.listen(3000, ()=>{
    console.log('serving on port 3000')
} )


//module.exports.handler=serverless(app);