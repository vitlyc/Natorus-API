const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
require('dotenv');
const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
console.log(process.env.YYY);

app.use((req, res, next) => {
  console.log(req.body.name);
  next();
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.use(morgan('dev'));

app.get('/api/v1/tours', (req, res) => {
  console.log(tours);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((elem) => elem.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      results: tours.length,
      data: {
        tour: newTour,
      },
    });
  });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
