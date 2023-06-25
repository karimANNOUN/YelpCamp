const express=require('express');
const router= express.Router();
const catchAsync=require('../utils/CatchAsync');
const campgrounds=require('../controllers/campgrounds');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground');
const {isLogedIn,validateCampground,isAuthor}=require('../middleware');
const multer  = require('multer');
const {storage}= require('../cloudinary/index')
const upload = multer({ storage }); //hada package manager li ra7 ndirou bih upload ta3 image 


router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLogedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground))
//.post(upload.array('image'),(req,res)=>{ //n7ebou nglbou single multuple bah tweli tdir import l 7wayj ysr ndirou array
  //  console.log(req.body, req.files)// hna dernaha files ki welet array ki tkoun single ndirou file bla s
 //   res.send('it worked')
//})  hadi ra7 ndirouha forma ta middleware tab3a l route ta post li fougha 

router.route('/new')
.get(isLogedIn ,campgrounds.renderNewForm)


router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isLogedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(campgrounds.updateCampground))
// drnaha bah n7ebou nzidou photo nzidou nrml upload image
.delete(isLogedIn, catchAsync(campgrounds.deleteCampground))


router.route('/:id/edit')
.get(isLogedIn,isAuthor, catchAsync(campgrounds.renderEditForm))



 module.exports=router


// router.get('/',catchAsync(campgrounds.index));


//router.get('/new',isLogedIn ,campgrounds.renderNewForm);
 
 //router.post('/', isLogedIn,validateCampground, catchAsync(campgrounds.createCampground));

 
 //router.get('/:id',catchAsync(campgrounds.showCampground));

// router.get('/:id/edit',isLogedIn,isAuthor, catchAsync(campgrounds.renderEditForm));

 //router.put('/:id',isLogedIn,isAuthor,validateCampground, catchAsync(campgrounds.updateCampground));
 

// router.delete('/:id',isLogedIn, catchAsync(campgrounds.deleteCampground));

//adouma route ti3na kifeh kenou 9bl