import React, {Fragment, useState} from "react";

const AddProduct = () => {

    const[newProd, setnewProd] = useState("Hello");

    return (
        <Fragment>
            <h1 className="text-center  mt-5" > PERN Add New Product:</h1>
            <form className="d-flexx mt-5">
                <input type="text" className="form-control" />
                    <button className="btn btn-success">Add</button>
                
            </form>
        </Fragment>
    )
}

export default AddProduct;