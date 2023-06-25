const express=require('express');
const router= express.Router({mergeParams: true});
//option ta merge params mlaha tkhalina na9drou na9raw koulch mknch yt9a khasatan constant
const { campgroundSchema ,reviewSchema} =require('../schemas.js');
const catchAsync=require('../utils/CatchAsync');
const {validateReview,isLogedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews');

const Review= require('../models/review');
const Campground=require('../models/campground');
const ExpressError=require('../utils/ExpressError');


router.post('/',isLogedIn,validateReview,catchAsync(reviews.creatReview));



 router.delete('/:reviewId',isLogedIn,catchAsync(reviews.deleteReview));

 module.exports=router;