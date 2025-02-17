import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../static/css/HomeProduct.css';
import AuthContext from '../../authorization/AuthContext'

const UpdateProductLine = () => {

    let {user} = useContext(AuthContext)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [unit_price, setUnitPrice] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const url = 'http://localhost:8000';

    let authTokens;
    try {
        authTokens = JSON.parse(localStorage.getItem('authTokens'));
    } catch (e) {
    // Handle the error
    console.log(e)
    }
    const accessToken = authTokens ? authTokens.access : null;

    useEffect(() => {
        getProductById();
    }, []);

    const getProductById = async() => {
        const response = await fetch(`${url}/api/product/product-line-detail/${id}/`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        });
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setUnitPrice(data.unit_price)
    }
    
    const updateProduct = async(e) => {
        e.preventDefault();
        const product = { title, description, unit_price };
        await fetch(`${url}/api/product/product-line-update/${id}/`, {
            method: "PUT",
            body: JSON.stringify(product),
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
                <h1 class="title"> Update Product Line</h1>
                </div>
                <div class='container' id="sub-card">
                    <form onSubmit={updateProduct}>
                        <div className="field">
                        <label className="label">Title</label>
                        <div className="control">
                            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="title" />
                        </div>
                        </div>

                        <div className="field">
                        <label className="label">Description</label>
                        <div className="control">
                            <input className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Description" />
                        </div>
                        </div>

                        <div className="field">
                        <label className="label">Unit Price</label>
                        <div className="control">
                            <input className="form-control" value={unit_price} onChange={(e) => setUnitPrice(e.target.value)} type="text" placeholder="Unit Price" />
                        </div>
                        </div>

                        <div className="d-flex justify-content-center">
                            <div className="control">
                                <button  style={{borderRadius: 13, height:43}} className="button is-primary">Update</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateProductLine;