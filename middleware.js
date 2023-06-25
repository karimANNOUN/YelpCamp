// hadi middleware okhra ndirou baha authentification ta3 login f campgrounds/news 
const {campgroundSchema, reviewSchema } =require('./schemas');
const Campground=require('./models/campground');
const ExpressError=require('./utils/ExpressError');
const Review = require('./models/review');




module.exports.isLogedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl; //adi zednaha bah nediw path ta ay req derha user w ndiroha f session
        req.flash('error','you must singin');
        return res.redirect('/login');
        //hadi ma3naha 9bel matet7al la page adi lezem  y3adi lel login
     }
     next()

} 

module.exports.validateCampground = (req,res,next)=>{
  
    const {error}= campgroundSchema.validate(req.body);
    if(error) {
       const msg =error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
       next()
    }  
 };

module.exports.isAuthor=async(req,res,next)=>{
   const {id}=req.params;
    const campground= await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
      req.flash('error','not have a permission');
      return res.redirect(`/campgrounds/${id}`)
    }
   next()

};
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
     const review= await Review.findById(reviewId);
     if(!review.author.equals(req.user._id)){
       req.flash('error','not have a permission');
       return res.redirect(`/campgrounds/${id}`)
     }
    next()
 
 };

module.exports.validateReview =(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
 
    if(error) {
       const msg =error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
       next()
    }  
 };

