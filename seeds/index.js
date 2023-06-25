const mongoose=require('mongoose');
const Campground=require('../models/campground')
const cities = require('./cities');
const {places , descriptors}=require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{useNewUrlParser:true ,useUnifiedTopology:true})
.then(()=>{
   console.log("that's run good")

   
   

})
.catch((err)=>{
   console.log('its error ')
   console.log(err)
});

const sample = array => array[Math.floor( Math.random() * array.length)] 


const seedDb = async ()=>{
    await Campground.deleteMany({});
    for (let i=0 ; i<50 ;i++){
        const random1000 =Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10 ;
    const camp= new Campground({
        //your user id
        author:'64205e26350ece07b4fafb5c',
        location:`${cities[random1000].city},${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        description:'my name is announ karim hey hey hey bro',
        price,
        geometry: {
            type: 'Point', 
            coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
        ] 
        },
        images:[{
            url: 'https://res.cloudinary.com/dv1y2f23o/image/upload/v1679988996/yelp-camp/cxxndzdbz51ksq4adhh3.webp',
            filename: 'yelp-camp/cxxndzdbz51ksq4adhh3',
           
          },
          {
            url: 'https://res.cloudinary.com/dv1y2f23o/image/upload/v1679988997/yelp-camp/sk0xgtlifwkujmurha7t.jpg',
            filename: 'yelp-camp/sk0xgtlifwkujmurha7t',
           
          }
        ]
    })
    await camp.save();
}
    

}
seedDb().then(()=>{
    mongoose.connection.close();
})