const express = require('express');
const mongoose = require('mongoose');
const stockRoutes = require('./routes/stock');
const child_process = require('child_process');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bse_data', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));



function executePythonScript() {
    child_process.execFile('python', ['script.py'], (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            console.error(stderr);
        } else {
            console.log(`Python script executed successfully: ${stdout}`);
        }
    });
}


executePythonScript();

// Endpoint to refresh data
app.get('/refresh', (req, res) => {
    executePythonScript();
    res.send('Data refresh initiated');
});


app.use('/stocks', stockRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
