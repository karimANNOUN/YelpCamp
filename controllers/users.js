const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register')
}

module.exports.register=async(req,res,next)=>{
    try{
        const {email,username,password} = req.body;
        const user=new User({email,username});
        const registeredUser= await User.register(user,password);
        req.login(registeredUser, err=>{ //hadi methode dernaha bah user ti3na ki ydire register f site youdkhel direct may3awdch ykteb mtp w adress bah youdkhel
            if(err) return next(err)
            req.flash('success','welcom to yelp camp');
            res.redirect('/campgrounds'); 
        })
        
    }catch(e){
     req.flash('error',e.message)
     res.redirect('/register')
    } //derna try and catch bah n7eelou error ta3 ki njiw nsejlou nlgew we7ed msejel fi déja b nafs el ism   
    }

module.exports.renderLogin=(req,res)=>{
    res.render('users/login')
}

module.exports.login=(req,res)=>{
    req.flash('success','welcom back');
    const redirectUrl=req.session.returnTo || '/campgrounds'; 
    delete req.session.returnTo; // hadi dernaha bah na7iw returnTo 
    res.redirect(redirectUrl);
    //local adika ta3 naw3 password package manager li derneh li houwa local
    //failure flash adika khasa b flash ti3na ida yafficih ou nn
    
}
module.exports.logout=(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/campgrounds');
      });
    req.flash('success','good logout')
    //res.redirect('/campgrounds');
    //adia kifeh ndirou logout b package manager ta local 
}