const express = require ("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
const pool = require("./db"); //using a pool allows to query in postgres
const dotenv = require("dotenv");
const hbs = require("express-handlebars");
const { v4: uuidv4 } = require('uuid');
const {Client, Config, CheckoutAPI} = require( "@adyen/api-library"); //importing the Adyen API library
const { default: Checkout } = require("@adyen/api-library/lib/src/services/checkout");

//middleware - aka 'software glue'
app.use(cors());
app.use(express.json()); //req.body - parsing JSON bodies
app.use(morgan("dev")); // set up request logging
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
// app.use(express.static(path.join(__dirname, "/public"))); - dont need this as I have not created this folder with the info needed. 

//Enables environment variables by parsing the .env file and assigning it to process env
dotenv.config({
    path: "./.env"
});

const config = new Config();
config.apiKey = process.env.API_Key; //adding API Key from .env file to our config file
const client = new Client({config}); // new client object
client.setEnvironment("Test"); //setting the environment to TEST 
const checkout = new CheckoutAPI(client); //instantiating checkout and passing in the client

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

//PAYMENT ROUTES (ADYEN)

const paymentDataStore = {} // storing the payment data here until I can connect it to the database !!! 

//Get payment methods available to the Merchant
app.get("/", async(req,res) => {
    try {
        const response = await checkout.paymentMethods({ //making a payment methods call with our two parameters
            channel: "Web",
            merchantAccount: process.env.MERCHANT_ACCOUNT //our own merchant account
        });
        res.render("payment", {
            clientKey: process.env.CLIENT_KEY,
            response: JSON.stringify(response)
        });
    } catch (error) {
        console.error(error);
    }
});
 
//Initiating a payment
app.post("/api/initiatePayment", async(req, res) => {
    try {
        const orderRef = uuid(); //creating unique order ID 

        const response = await checkout.payments({ //hard coding some payment data information -- fix this !!!
            amount: { currency: "EUR", value: 3456},
            reference: orderRef,
            merchantAccount: process.env.MERCHANT_ACCOUNT,
            channel: "Web",
            additionalData: {
                allow3DS2: true
            },
            returnUrl: `http:localhost:8080/api/handleShopperRedirect?orderRef=${orderRef}`, //URL shopper will be redirected to after payment is processed
            browserInfo: req.body.browserInfo,
            paymentMethod: req.body.paymentMethod



        })

        let resultCode = response.resultCode; //pulling this info from the request result
        let action = null; // no additional action are required for some transactions 

        if(response.action){ //if there is additional action required this will handle 
            action = response.action;
            paymentDataStore[orderRef] = action.paymentData;
        }

        res.json({resultCode, action }); //info being sent back to the client
    } catch (error) {
        console.error(error);
    }
})

//Handle shopper redirect
app.all('/api/handleShopperRedirect', async(req, res)=>{ 
    const payload = {};
    payload["details"] = req.method === "GET" ? req.query : req.body;
     
})

app.listen(PORT, ()=>{
    console.log(`server has started on port:${PORT}`)
});
