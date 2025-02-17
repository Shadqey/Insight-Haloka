import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato";
import '../../static/css/font.css';
import '../../static/css/AddProduct.css';

const AddProduct = () => {

    const [product_line, setProductLine] = useState([]);
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
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
        fetchData();
    }, []);
    
    const fetchData = async () => {
        const response = await fetch(`${url}/api/product/product-line/`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        });
        const data = await response.json();
        setProductLine(data);
    }

    const handleChange = (e) => {
        const {name, checked} = e.target;
        if (name === "allSelect"){
            let tmpProdLines = product_line.map((pl) => {
                return {...pl, isChecked: checked};
            });
            setProductLine(tmpProdLines)
        }else{
            let tmpProdLines = product_line.map((pl) => 
                pl.title === name ? {...pl, isChecked: checked} : pl
            );
            setProductLine(tmpProdLines);
        }
    }
    
    const addProduct = async(e) => {
        e.preventDefault();

        const totalPrice = product_line.reduce(
            (sum, pl) => {
                if (pl?.isChecked){
                    return sum + parseInt(pl.unit_price);
                }
                return sum;
            }, 0
        );

        console.log(product_line)

        await fetch(`${url}/api/product/`, {
            method: "POST",
            body: JSON.stringify({"title":title,"unit_price":totalPrice, "product_line":product_line}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        });    

        navigate("/product")
    }

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    return (
        <div>
            <div id='main-card'>
                <div id="title">
                    <h2 class="title"> Create Product </h2>
                </div>
                {/* <div class='container' id="sub-card"> */}
                    <form onSubmit={addProduct}>
                        <div className="field-title">
                            <h4 className="label">Title</h4>
                            <div className="control">
                                <input style={{width:350}} className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" required/>
                            </div>
                        </div>

                        <div className="field-product-line">
                            <h4 className="label">Product Line</h4>
                            <div class='container' id="sub-card">
                            <table className="table is-striped is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="allSelect"
                                                    checked={!product_line.some((pl) => pl?.isChecked !== true)}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label ms-2">Select All</label>
                                            </div>
                                            
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product_line.map((prod, index) => (
                                        <tr key={prod.id}>
                                        <td style={{textAlign:"center"}}>{ index + 1 }</td>
                                        <td style={{textAlign:"center"}}>{ prod.title }</td>
                                        <td style={{textAlign:"center"}}>{ formatter.format(prod.unit_price) }</td>
                                        <td style={{textAlign:"center"}}>
                                            <div className="form-check" key={index}>
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input" 
                                                    checked={prod?.isChecked || false}
                                                    name={prod.title}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                        <div className="field">
                            <div className="d-flex justify-content-center">
                                <button className="button is-primary" style={{fontSize:"medium", marginTop:30}}>Create</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        // </div>
    );
}

export default AddProduct