const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
// models
const Campground = require('./models/campground');
const {
    syncIndexes
} = require('./models/campground');

// connect to db
mongoose.connect('mongodb://localhost:27017/yelpcamp');
const db = mongoose.connection;
db.on('error', console.log.bind(console, "Connection error"));
db.once('open', () => {
    console.log("Database Connected");
})


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));

// telling express to parse the data coming from forms
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', {
        campgrounds
    });
});

// Adding campground
app.post('/campground', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campground/new');
});


app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campground/show', {
        campground
    });
});

app.put('/campgrounds/edit/:id', async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit', {
        campground
    });
});

app.delete('/campgrounds/:id', async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    console.log("ajdfadkfsja");
    res.redirect("/campgrounds");
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})