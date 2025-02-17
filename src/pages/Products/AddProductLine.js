import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato"
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css';
import AuthContext from '../../authorization/AuthContext';
import '../../static/css/AddProductLine.css'

const AddProductLine = () => {
    let {user} = useContext(AuthContext)
    const[title, setTitle] = useState("");
    const[description, setDescription] = useState("");
    const[unit_price, setUnitPrice] = useState("");
    const navigate = useNavigate();

    let authTokens;
    try {
        authTokens = JSON.parse(localStorage.getItem('authTokens'));
    } catch (e) {
    // Handle the error
    console.log(e)
    }
    const accessToken = authTokens ? authTokens.access : null;
    const url = 'http://localhost:8000';

    const addProductLine = async(e) => {
        e.preventDefault();
        const product_line = { title, description, unit_price };
        await fetch(`${url}/api/product/product-line/`, {
            method: "POST",
            body: JSON.stringify(product_line),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        });
        navigate("/product/product-line/")
    }

    return (
        <div>
            <div id='main-card'>
                <div id="title">
                <h1 className="title"> Create Product Line</h1>
                </div>
                {/* <div class='container' id="sub-card"> */}
                <form onSubmit={addProductLine}>
                    <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input className="form-control" onChange={(e) => setTitle(e.target.value)} type="text" placeholder="input title" />
                    </div>
                    </div>

                    <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                        <textarea className="form-control" onChange={(e) => setDescription(e.target.value)} placeholder="input description"></textarea>
                    </div>
                    </div>

                    <div className="field">
                    <label className="label">Unit Price</label>
                    <div className="control">
                        <input className="form-control" onChange={(e) => setUnitPrice(e.target.value)} type='number' placeholder="input unit price" />
                    </div>
                    </div>

                    <div className="field">
                    <div className="d-flex justify-content-center">
                        <button className="button is-primary" style={{fontSize:"medium"}}>Add</button>
                    </div>
                    </div>
                </form>
                </div>
            </div>
        // </div>
    );
}


export default AddProductLine;