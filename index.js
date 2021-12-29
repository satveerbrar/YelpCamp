const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

try {
    mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log("Connection OPEN")
} catch (error) {
    handleError(error);
}

const app = express();

app.engine('ejs', ejsMate)  // to use boilerplate for ejs files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '/public'))); // to serve static files from public directories
app.use(express.urlencoded({ extended: true })); // to decode req.body of POST requests
app.use(methodOverride('_method')); // to use PUT PATCH DELETE

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id', reviews);

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something went wrong!"
    res.status(statusCode).render("error", { err });
})

app.listen('3000', () => {
    console.log("Serving on port 3000");
})
