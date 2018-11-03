const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use('/public', express.static('public')); // expose public
app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));

app.get('/', async (req, res) => {
  res.sendFile('index.html', {root: __dirname}, (err) => {
    if (err) {
      res.send(`ERROR: ${err}`);
    }
  });
});

app.post('/gcode', (request, response) => {
  console.log('Got post request');
  let fileType;
  switch (request.body.type) {
    case 'image/jpeg':
      fileType = '.jpeg';
      break;
    case 'image/png':
      fileType = '.png';
      break;
    default:
      response.status(400).send('Unrecognized file type');
      return;
  }

  const filePath = require('path').resolve(`./temp/${Date.now()}${fileType}`);
  fs.writeFile(filePath, request.body.data, 'binary', (err) => {
    if (err) {
      response.status(400).send(`error: ${err}`);
    } else {
      response.send(`File written at: ${filePath}`);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
