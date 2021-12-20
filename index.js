const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

try {
    mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log("Connection OPEN")
  } catch (error) {
    handleError(error);
}

app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'))

app.get('/', (req, res) => {
    res.render('home')
})

// info about all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});

})

// add new campground

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
})

// detail info about single campground

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground});
})

// edit the campground

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground});
})

app.put('/campgrounds/:id', async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete the campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen('3000', () => {
    console.log("Serving on port 3000");
})