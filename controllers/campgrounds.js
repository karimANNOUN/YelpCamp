const Campground=require('../models/campground');
const {cloudinary}=require('../cloudinary/index');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken= `${process.env.MAPBOX_TOKEN}`;   // hadou fi 3 tab3in map kifeh ndirouha f website ti3na
const geocoder= mbxGeocoding({ accessToken:mapBoxToken});


module.exports.index= async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
 };

 module.exports.renderNewForm= (req,res)=>{
    res.render('campgrounds/new')  
  };

  module.exports.createCampground=async (req,res,next)=>{
    //if(!req.body.campground) throw new ExpressError('Invalid campground data',400)
     const campground = new Campground(req.body.campground);
     const geoData= await geocoder.forwardGeocode({
      query:req.body.campground.location,
      limit:1
    }).send() ;
   
 
  campground.geometry= await geoData.body.features[0].geometry; //hadi tab3a map bah ndiroha 
  campground.images=req.files.map(f=>({url: f.path , filename: f.filename})); //adi tab3a ta upload image 
  campground.author=req.user._id // hna bah ndirou beli ay we7ed ydir modification wela tji b ismou houwa beli houwa li bedel wela posta 
  await campground.save();
  req.flash('success','Successefuly made new campground');
  res.redirect(`/campgrounds/${campground._id}`)
    
 }

 module.exports.showCampground=async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
      path:'reviews',populate:{
         path:'author' // hadi dernaha bah noslou lel author li dekhel reviewsschema
      }}).populate('author');
    if(!campground){
      req.flash('error','this campground is not found');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
 }

 module.exports.renderEditForm=async (req,res)=>{
    const{id}= req.params;
    const campground = await Campground.findById(id);
    if(!campground){
      req.flash('error','not have a permission');
      return res.redirect(`/campgrounds`)
    }
   
    res.render('campgrounds/edit',{campground})
 
 }
 module.exports.updateCampground=async (req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs=req.files.map(f=>({url: f.path , filename: f.filename}));
    campground.images.push(...imgs);
    //hna ki n7ebou nzidou image w tt 
    await campground.save();

    if(req.body.deleteImages){
      for(let filename of req.body.deleteImages ){
        await cloudinary.uploader.destroy(filename); // hadi drnaha bah hata la photo tetna7a m cloudinary
      }
      await campground.updateOne( {$pull:{images:{filename:{$in:req.body.deleteImages}}}})
      // hadi ki n7ebou na7iw image f update
      }
    req.flash('success','Successfuly update campground');
    res.redirect(`/campgrounds/${campground._id}`)
 }
 module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','successfully delete campground');
    res.redirect('/campgrounds');
 }