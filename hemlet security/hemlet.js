
//const helmet =require('helmet');// ada package okher nakhdmou bih securité ti3na l xss
// Sets all of the defaults, but overrides `script-src` and disables the default `style-src`
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "script-src": ["'self'", "example.com"],
        "style-src": null, // hna par exemple ndirou url ti3na koul ta style li khdemna bihm 
      },
    })
  );
  
  // Sets "Content-Security-Policy: default-src 'self';script-src 'self' example.com;object-src 'none';upgrade-insecure-requests"
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'",...connectSrcUrls],
        scriptSrc: ["'self'",...scriptSrcUrls],
        styleSrc:["'self'","'unsafe-inline'",...styleSrcUrls],
        workSrc:["'self'","blob:"],
        objectSrc: ["'none'"],
        imageSrc:[
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com/YOURNAME/",
          

        ]
        upgradeInsecureRequests: [],
      },
    })
  );
  
  // Sets the "Content-Security-Policy-Report-Only" header instead
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        /* ... */
      },
      reportOnly: true,
    })
  );
  
  // Sets the `script-src` directive to "'self' 'nonce-e33ccde670f149c1789b1e1e113b0916'" (or similar)
  app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
    next();
  });
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
      },
    })
  );
  
  // Sets "Content-Security-Policy: script-src 'self'"
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      directives: {
        "default-src": helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
        "script-src": ["'self'"],
      },
    })
  );
  
  // Sets the `frame-ancestors` directive to "'none'"
  // See also: `helmet.frameguard`
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        frameAncestors: ["'none'"],
      },
    })
  );


  // adi 


  const sanitizeHtml= require('sanitize-html'); // adi tab3a  xss bah n7miw website ti3na ml hackers ki yb3etlna kach script wela f commentaire wela ay blasa faha ktiba maya9derch 
  // hadi wra mandirou installation l npm i sanitize-html

  const extension=(joi)=>({
    type:'string',
    base:joi.string(),
    message:{
       'string.escapeHTML' : '{{#label}} must not include html'
    },
    rules:{
       escapeHTML:{
          validate(value,helpers){
             const clean = sanitizeHtml(value,{
                allowedTags:[],
                allowedAttributes:{},
             });
             if(clean !== value) return helpers.error('string.escapeHTML',{value})
             return clean;
          }
       }
    }
 });
 
 const Joi = baseJoi.extend(extension)





 const scriptSrcUrls=[
  "https://stackpath.bootstrapcdn.com/",
  "https://api.titles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://code.jquery.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net"
];
const styleSrcUrls=[
  "https://kit-free.fontawesome.com/",
  "https://fonts.googleapis.com/",
  "https://api.titles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://use.fontawesome.com/"

];
const connectSrcUrls=[
  "https://api.mapbox.com/",
  "https://a.titles.mapbox.com/",
  "https://ab.titles.mapbox.com/",
  "https://events.titles.mapbox.com/",

]
const fontSrcUrls=[];

app.use( helmet.contentSecurityPolicy({
  directives: {
  defaultSrc:[],
   
      connectSrc: ["'self'",...connectSrcUrls],
      scriptSrc: ["'self'",...scriptSrcUrls],
      styleSrc:["'self'","'unsafe-inline'",...styleSrcUrls],
      workSrc:["'self'","blob:"],
      objectSrc: ["'none'"],
      imageSrc:[
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/YOURNAME/",
        "https://images.unsplash.com/"

      ],
      fontSrc: ["'self'",...fontSrcUrls],
     }
  })
)
 