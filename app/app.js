const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//documentation
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = 3000;

//array dove salvare le case, si deve sostituire con il db
let houses = [];

/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * Serve front-end static files
 */
//app.use('/', express.static('static')); //use serve qualsiasi tipo di request (get/put/..)


//HOMEPAGE -- express.static mostra i file nella cartella static -- single page app
app.use('/', express.static('static'));




//endpoints
//ADD NEW HOUSE
app.post('/house', (req, res) => {
    const house = req.body;


    //console.log(house);
    houses.push(house);

    res.send('House added to the database');
    res.status(201);
    
    res.location("/houses/" + house.id);
});

//HOUSE LIST
app.get('/houses', (req, res) => {
    res.json(houses);
});

//HOUSE BY ISBN
app.get('/house/:id', (req, res) => {

    const id = req.params.id;


    for (let house of houses) {
        if (house.id === id) {
            res.json(house);
            return;
        }
    }


    res.status(404).send('House not found');

});

//DELETE
app.delete('/house/:id', (req, res) => {

    const id = req.params.id;


    houses = houses.filter(i => {
        if (i.id !== id) {
            return true;
        }
        return false;
    });

    res.send('House deleted');
});

//EDIT HOUSE --POST OR PUT
app.post('/house/:id', (req, res) => {

    const id = req.params.id;
    const newHouse = req.body;

    for (let i = 0; i < houses.length; i++) {
        let house = houses[i]
        if (house.id === id) {
            houses[i] = newHouse;
        }
    }

    res.send('House edited');
});

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;