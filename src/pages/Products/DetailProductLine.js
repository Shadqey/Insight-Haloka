import { useState, useEffect, useContext } from "react";

import { useParams, Link } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato"
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css';
import '../../static/css/DetailClient.css';
import AuthContext from '../../authorization/AuthContext'


const DetailProductLine = () => {
  
  let {user} = useContext(AuthContext)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unit_price, setUnitPrice] = useState("");
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
  });

  const getProductById = async () => {
    const response = await fetch(`${url}/api/product/product-line-detail/${id}/`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessToken}`
      }
    });
    const data = await response.json();
    setTitle(data.title);
    setDescription(data.description);
    setUnitPrice(data.unit_price);
  };

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  return (
    <div>
      <div id='main-card'>
        <div id="title">
          <h1 class="title"> Detail Product Line </h1>
        </div>
        {/* <div class='container' id="sub-card"> */}
          <div class='row justify-content-md-center'>
            <div class="mini-card col col-lg-5">
              <h3 class="attribute">Name:</h3>
              <p>{title}</p>
            </div>
            <div class="col-md-auto"> {/* dikosongin saja */} </div>
            <div class="mini-card col col-lg-5">
              <h3 class="attribute">Unit Price:</h3>
              <p>{formatter.format(unit_price)}</p>
            </div>
            <div class="mini-card col-lg-10">
              <h3 class="attribute">Description:</h3>
              <p>{description}</p>
            </div>
            
          </div>
          <div className="d-flex justify-content-center">
            <Link to={`/product/product-line-update/${id}/`}>
            <button className="button is-small is-danger" style={{fontSize:"medium", marginTop:"2rem"}}>Update</button>
            </Link>
          </div>
        </div>
        
      </div>
    // </div>
  );
};

export default DetailProductLine;