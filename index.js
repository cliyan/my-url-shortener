const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Shorten = require ("./public/models/shorten.js");

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: true}));

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://my-url-shortener:123@ds119078.mlab.com:19078/my-url-shortener');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.on('open', () => {
  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
});

app.get('/', (req, res) => {
    res.render('index');
});



app.get('/:inputurl', (req, res) => {
    let inputurl = req.params.inputurl;
    Shorten.findOne({shorten: inputurl}, (err, collection) => {
        if (collection) {
            res.redirect(collection.url);
        } else {
            res.render('index', {invalidurl: inputurl});
        }
    });
});

app.post('/shortenurl', (req, res) => {
    Shorten.findOne({url: req.body.url}, (err, collection) => {
        if (collection) {
            res.render('displayurl', {shorten: collection.shorten});
        } else {
            Shorten.create({
                url: req.body.url,
                shorten: shortURL(),
            }, (err, collection) => {
                if(err) {
                    return console.log(err)
                }
                res.render('displayurl', {shorten: collection.shorten})
            });
        }
    })
});

function shortURL() {
    let char = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"
    shortLength = 6;
    randomUrl = "";
    for (let i = 0; i < shortLength; i++) {
        let random = Math.floor(Math.random() * char.length);
        randomUrl += char.substring(random, random + 1);
    }
    return randomUrl
}