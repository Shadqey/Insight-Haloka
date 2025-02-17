// import 'antd/dist/reset.css';
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker } from 'antd';
import "@fontsource/aileron";
import "@fontsource/lato";
import '../../static/css/font.css';
import moment from 'moment';
import '../../static/css/AddProduct.css';
import AuthContext from '../../authorization/AuthContext';

const UpdateContract = () => {

    const [clientId, setClientId] = useState("")
    const [company_name, setCompany_name] = useState("");
    const [productList, setProductList] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([])

    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

    const [status, setStatus] = useState('draft');
    const navigate = useNavigate();

    let authTokens;
    try {
        authTokens = JSON.parse(localStorage.getItem('authTokens'));
    } catch (e) {
    // Handle the error
    console.log(e)
    }
    const accessToken = authTokens ? authTokens.access : null;

    const { id } = useParams(); 
    const url = 'http://localhost:8000';

    useEffect(() => {
        const fetchContract = async () => {
          const response = await fetch(`${url}/api/contract/contract-detail/${id}/`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
          });
          const data = await response.json();
        
          setClientId(data.client?.id)
          setCompany_name(data.client?.company_name);
          setStatus(data.status);
          setSelectedProduct(data.contracts.map((contract) => contract.product));
    
          setStartDate(data.start_date);
          setEndDate(data.end_date);
        };
        fetchContract();
    }, [id]);
    
    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch(`${url}/api/product/`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${accessToken}`
                }
            });
            const data = await response.json();
            const tmp = data.map(item => {
                if (selectedProduct.includes(item.id)) {
                    return { ...item, isChecked: true };
                }
                return { ...item, isChecked: false };
            });
            setProductList(tmp);
        };
        fetchProduct();
    }, [selectedProduct]);    

    const handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        if (name === "allSelect"){
            let tmpProdLines = productList.map((pl) => {
                return {...pl, isChecked: checked};
            });
            setProductList(tmpProdLines)
        }else{
            let tmpProdLines = productList.map((pl) => 
                pl.id === name ? {...pl, isChecked: checked} : pl
            );
            setProductList(tmpProdLines);
        }
    }
    
    const updateContract = async(e) => {
        e.preventDefault();

        const checkedArray = [];
        let counter = 0;
        for (const item of productList){
            if (("isChecked" in item) && (item.isChecked)){
                counter++;
                checkedArray.push(item.id);
            }
        }

        let authTokens;
        try {
            authTokens = JSON.parse(localStorage.getItem('authTokens'));
        } catch (e) {
            // Handle the error
            console.log(e)
        }
        const accessToken = authTokens ? authTokens.access : null;

        if (startDate === '' || endDate === '' || counter === 0){
            alert("Please fill in all the required fields");
            return;
        } else {
            if (new Date(startDate) > new Date(endDate)) {
                alert('Start date must be before end date');
                return;
            }
            await fetch(`${url}/api/contract/update/${id}/`, {
                method: "PUT",
                body: JSON.stringify({"contract":id, "client": clientId, "start_date":startDate, "end_date":endDate, "status":status, "product":checkedArray}),
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

            console.log(company_name)
            console.log(status)
            navigate(`/contract/contract-detail/${id}`)
        }
    }

    return (
        <div>
            <div id='main-card'>
                <div id="title">
                    <h1 class="title"> Update Contract </h1>
                </div>

                <div className="form-add-product">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="label">Client</label>
                            <input type="text" className="form-control" value={company_name} disabled/>
                        </div>

                        <div className="col-md-6">
                            <label className="label">Status</label>
                            <div className="control">
                                <select className="form-control" id="type" value={status} onChange={(e) => setStatus(e.target.value)} style={{height:44}}>
                                    <option selected value="draft">Draft</option>
                                    <option value="in_review">In Review</option>
                                    <option value="approved">Approved</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label className="label">Start Date</label>
                            <input className="form-control" type="date" id="startDate" value={moment(startDate).format('YYYY-MM-DD')} onChange={(event) => setStartDate(event.target.value)} />
                        </div>

                        <div className="col-md-6">
                            <label className="label">End Date</label>
                            <input className="form-control" type="date" id="endDate" value={moment(endDate).format('YYYY-MM-DD')} onChange={(event) => setEndDate(event.target.value)} />                
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Product</label>
                        <table className="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Title</th>
                                    <th>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="allSelect"
                                                checked={!productList.some((pl) => pl?.isChecked !== true)}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label ms-2">Select All</label>
                                        </div>   
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList.map((prod, index) => (
                                    <tr key={prod.id}>
                                    <td>{ index + 1 }</td>
                                    <td>{ prod.title }</td>
                                    <td>
                                        <div className="form-check" key={index}>
                                            <input 
                                                type="checkbox" 
                                                className="form-check-input" 
                                                checked={prod.isChecked}
                                                name={prod.id}
                                                onChange={handleCheckboxChange}
                                            />
                                        </div>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="field">
                        <div className="control" style={{marginTop:18}}>
                            <button className="button is-primary" onClick={updateContract}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateContract