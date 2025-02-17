import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato";
import '../../static/css/font.css';
import AuthContext from '../../authorization/AuthContext';

const AddInvoice = () => {
    const { id } = useParams();

    const [clientId, setClientId] = useState("")
    const [companyName, setCompanyName] = useState("");
    const [contract, setContract] = useState({});
    const [productBundleLineList, setProductBundleLineList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    let authTokens;
    try {
        authTokens = JSON.parse(localStorage.getItem('authTokens'));
    } catch (e) {
        // Handle the error
        console.log(e)
    }
    const accessToken = authTokens ? authTokens.access : null;
    const url = 'http://localhost:8000';

    const fetchData = async () => {
        const response = await fetch(`${url}/api/contract/${id}/detail/product`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        });
        const data = await response.json();
        setContract(data);
        setClientId(data.client?.id);
        setCompanyName(data.client?.company_name)
    }

    const handleCheckboxChange = (event, productBundleLineId, productLinePrice) => {
        const checked = event.target.checked;
        const price = parseInt(productLinePrice)
        if (checked) {
          // Add the product bundle line to the list
          setProductBundleLineList([...productBundleLineList, productBundleLineId]);
          setTotalPrice(totalPrice + price);
        } else {
          // Remove the product bundle line from the list
          setProductBundleLineList(productBundleLineList.filter(id => id !== productBundleLineId));
          setTotalPrice(totalPrice - price);
        }
    };

    
    const addInvoice = async(e) => {
        e.preventDefault();

        await fetch(`${url}/api/invoice/`, {
            method: "POST",
            body: JSON.stringify({"client":clientId, "contract":id, "product_bundle_line":productBundleLineList, "total_price":totalPrice}),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
        console.log(data);
        })
        .catch((error) => {
        console.error(error);
        });
        navigate(`/contract/contract-detail/${id}`)
    }

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      });

    return (
        <div>
            <div id='main-card'>
            <h1>Create Invoice</h1>
            <div className="row">
                <div className="col-md-6">
                    <label className="label">Client</label>
                    <input type="text" className="form-control" value={companyName} disabled/>
                </div>
            </div>

            <div className="field">
            {contract?.contracts && contract.contracts.map((contract) => (
                <div key={contract.product.id}>
                    <h3>{contract.product.title}</h3>

                    <table className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                        <th>No</th>
                        <th>Product Line</th>
                        <th>Unit Price</th>
                        <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contract.product.product_bundles.map((productBundle) =>
                        productBundle.product_bundle_lines.map((productBundleLine, index) => (
                            <tr key={productBundleLine.id}>
                            <td>{ index + 1 }</td>
                            <td>{productBundleLine.product_line.title}</td>
                            <td>{formatter.format(productBundleLine.product_line.unit_price)}</td>
                            <td>
                                <div className="form-check" key={index}>
                                <input 
                                    type="checkbox"
                                    onChange={(e) => handleCheckboxChange(e, productBundleLine.id, productBundleLine.product_line.unit_price)}
                                />
                                </div>
                            </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                    </table>
                </div>
             ))}
            </div>

            <div className="field">
                <div className="control">
                    <button className="button is-primary" onClick={addInvoice}>Add</button>
                </div>
            </div>
        </div>
        </div>
    );
}

export default AddInvoice