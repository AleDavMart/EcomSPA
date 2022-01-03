import React, {Fragment, useState} from "react";

const AddProduct = () => {

    const[pname, setpname] = useState("");

    const onSubmitForm= async (e) => {
      e.preventDefault();
        try {
           const body = {pname}
           const response = await fetch ("http://localhost:8080/products", {
               method: "POST",
               headers: {"Content-Type":"application/json"},
               body: JSON.stringify(body)
            });

            console.log(response); //
            window.location= "/"; //will refresh the window after submit
        } catch (err) {
            console.error(err.message);
        }
    }
    return (
        <Fragment>
            <h1 className="text-center  mt-5" > PERN Add New Product:</h1>
            <form className="d-flexx mt-5" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={pname} 
                onChange={e => setpname(e.target.value)} />
                    <button className="btn btn-success">Add</button>
                
            </form>
        </Fragment>
    )
}

export default AddProduct;