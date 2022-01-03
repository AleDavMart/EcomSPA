const express = require ("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
const pool = require("./db"); //using a pool allows to query in postgres


//middleware - aka 'software glue'
app.use(cors());
app.use(express.json()); //req.body

//*************ROUTES******************

//CREATE A PRODUCT
app.post("/products", async(req, res) =>{
    try{
        const {pname} = req.body; //client side input being stored into req.body
        const newProduct = await pool.query("INSERT INTO products(pname) VALUES ($1) RETURNING *", [pname]
        );//
       
        res.json(newProduct.rows[0]);// the .rows[0] selects the specific row data input so it can be returned to user. 
     

    }catch(err){
        console.error(err.message); //returns an error
    }

});
//GET ALL PRODUCTS

app.get("/products", async(req, res) =>{
    try {
        const allProducts = await pool.query("SELECT * FROM products");
        res.json(allProducts.rows);
    } catch (error) {
        console.error(err.message);
    }
});

//GET A SPECIFIC PRODUCT
app.get("/products/:id", async(req,res) =>{
    try {
        const {id} = req.params; //using the PK id to select a specific product.
        const product = await pool.query( "SELECT * FROM products WHERE product_id = $1", [id]); //$1 can be anything since it dynamic and we are specifying in []

        res.json(product.rows[0]);// getting only the first row

        
    } catch (error) {
        console.error(err.message);
    }
});

//UPDATE PRODUCTS
app.put("/products/:id", async(req, res) =>{
    try {
        const {id} = req.params;
        const {pname} = req.body; 

        const updateProduct = await pool.query("UPDATE products SET pname = $1 WHERE product_id= $2", [pname,id]);
        
        res.json("Product was updated" );

    } catch (error) {
        console.error(err.message);
    }
});

// DELETE A PRODUCT 
app.delete("/products/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const deleteProduct = await pool.query("DELETE FROM products WHERE product_id = $1", [id]);

        res.json("Product was deleted !!");
    } catch (error) {
        console.error(err.message)
    }
});

app.listen(PORT, ()=>{
    console.log(`server has started on port:${PORT}`)
});
