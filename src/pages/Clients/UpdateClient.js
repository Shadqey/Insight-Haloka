import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from '../../authorization/AuthContext'

const UpdateClient = () => {

    let {user} = useContext(AuthContext)
    const [company_name, setCompanyName] = useState('');
    const [type, setType] = useState('Individual');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    let authTokens;
    try {
        authTokens = JSON.parse(localStorage.getItem('authTokens'));
    } catch (e) {
    // Handle the error
    console.log(e)
    }
    const accessToken = authTokens ? authTokens.access : null;
    const url = 'http://localhost:8000';

    useEffect(() => {
        getClientById();
    }, []);

    const getClientById = async() => {
        const response = await fetch(`${url}/api/client/detailClient/${id}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        });
        const data = await response.json();
        setCompanyName(data.company_name);
        setType(data.type);
        setPhone(data.phone)
    }
    
    const updateClient = async(e) => {
        e.preventDefault();
        const client = { company_name, type, phone };
        await fetch(`${url}/api/client/${id}/update`, {
            method: "PUT",
            body: JSON.stringify(client),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        });
        navigate("/client")
    }

    return (
        <div>
            <div id='main-card'>
                <div id="title">
                <h1 class="title"> Update Client</h1>
                </div>
                <div class='container' id="sub-card">
                <form onSubmit={updateClient}>
                    <div className="row">
                        <div className="col-md-6">
                            <label className="label">Company Name</label>
                            <div className="control">
                                <input className="form-control" value={company_name} onChange={(e) => setCompanyName(e.target.value)} type="text" placeholder="Company Name" />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="label">Type</label>
                            <div className="control">
                                <select className="form-control" id="type" value={type} onChange={(e) => setType(e.target.value)} style={{height:44}}>
                                    <option selected value="Individual">Individual</option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                    <label className="label">Phone</label>
                    <div className="control">
                        <input style={{width:322}} className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder="Phone" />
                    </div>
                    </div>

                    <div className="field">
                    <div className="d-flex justify-content-center">
                        <button className="button is-primary" style={{borderRadius: 13, height:43}}>Update</button>
                    </div>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateClient