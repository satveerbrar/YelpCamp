const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

try {
    mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log("Connection OPEN")
  } catch (error) {
    handleError(error);
}

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price =  Math.floor(Math.random() * 20)+10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            price: price
        });
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})