require('dotenv').config();

const express = require('express');
const path = require('path');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const Blog = require('./models/blog');
const {connectDB} = require('./connect');
const cookieParser = require('cookie-parser');
const {checkForAuthenticationCookie} = require('./middlewares/authentication');
const app = express();
const PORT = process.env.PORT || 8000;


//database connection local
    // connectDB('mongodb://127.0.0.1:27017/blog-site')
    // .then(()=> console.log("DB connected"));

//production
connectDB(process.env.MONGO_URL)
.then(()=> console.log("DB connected"));

//EJS
app.set('view engine', 'ejs');
app.set('views',path.resolve("./views"));

//parsing data from body/cookie
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));

//middleware that check for Cookie in every request
app.use(checkForAuthenticationCookie('token'));

//Routes
app.get("/",async (req,res)=>{ //HOME PAGE
    const allBlog = await Blog.find({});
    res.render('home',{
        user: req.user,
        blogs: allBlog,
    });
});

app.use('/user',userRoute);
app.use('/blog',blogRoute);


//Server Connection
app.listen(PORT,()=>console.log(`Server started at PORT: ${PORT}`));