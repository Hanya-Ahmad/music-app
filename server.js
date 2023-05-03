const express= require('express');

const app= express();

const bodyParser= require('body-parser');

const path = require('path');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors= require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static(path.join(__dirname, 'app')));

const port= 3000;
app.listen(port, ()=> console.log(`running on localhost: ${port}`));

// Initialize all route with an arrow callback function
app.get('/',(req,res)=>{
 res.sendFile(path.join(__dirname+'/app/index.html'));
  
})