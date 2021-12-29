const express = require ("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const pool = require("./db"); //using a pool allows to query in postgres


//middleware - aka 'software glue'
app.use(cors());
app.use(express.json());

//*************ROUTES******************

//CREATE A PRODUCT

//GET ALL PRODUCTS

//UPDATE PRODUCTS



app.listen(PORT, ()=>{
    console.log(`server has started on port:${PORT}`)
});
