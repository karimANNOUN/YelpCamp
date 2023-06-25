const mongoose = require('mongoose');
const Review=require('./review')
const Schema = mongoose.Schema;

const ImageSchema=new Schema({
   url:String,
   filename:String
});
// hna kharejna schema wa7dou bah na9drou nmodifiw fih mch kima ykoun ldekhel


ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_200')
});

const opts={toJSON:{virtuals:true}} // adi teb3a popup matkup lezmna ndiroha
// adi tab3a delete ta les photo bah na9soulhm size ti3hm pasque jaw kbar ysr glbna size 200 
//seba li derna virtual pasque we don't need store this in our model or data base

const campGroundSchema= new Schema({
 title:String,
 images:[ImageSchema],
 geometry:{
     type:{
      type:String,
      enum:['Point'],
      required:true
     },
     coordinates:{
      type:[Number],
      required:true
     }
 },
 price: Number,
 description:String,
 location:String,
 author:{
    type: Schema.Types.ObjectId,
    ref:'User'
 },
 reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:'Review' //ism folder li rbatneh bih 
    }
 ] ,// ki n7ebou ndirou relation bin 2 7wayj 

},opts); // opts adi tab3a l popupmarkup adika bah ki nrdkou tweli tjina haja mafhouma tb3tna lblasa

campGroundSchema.virtual('properties.popUpMarkup').get(function(){
   return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description}</p>` // kifkif adi aussi tab3a popupmarkup 
});



campGroundSchema.post('findOneAndDelete',async function(doc){
   if(doc){
    await Review.deleteMany({
        _id:{
            $in: doc.reviews 
        }
    })
   }
});







module.exports=mongoose.model('campground',campGroundSchema)