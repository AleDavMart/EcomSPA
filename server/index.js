const express = require ("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const pool = require("./db"); //using a pool allows to query in postgres


//middleware - aka 'software glue'
app.use(cors());
app.use(express.json()); //req.body

//*************ROUTES******************

//CREATE A PRODUCT
app.post("/products", async(req, res) =>{
    try{
        console.log(req.body);
    }catch(err){
        console.error(err.message); //returns an error
    }

});
//GET ALL PRODUCTS

//UPDATE PRODUCTS



app.listen(PORT, ()=>{
    console.log(`server has started on port:${PORT}`)
});
