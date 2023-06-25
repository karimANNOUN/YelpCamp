const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET

});
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'yelp-camp',
        allowedFormats: ['jpeg','png','jpg'], 
    }
    
  });
  module.exports={
    cloudinary,
    storage
  }
  // hadi khedmtha instalina package manager ismou cloudinary multer w houwa ytal3elna les photos wela files f 
  //website ta cloudinary