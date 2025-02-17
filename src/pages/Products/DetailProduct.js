import { useState, useEffect, useContext } from "react";

import { useParams, Link } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato"
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css';
import '../../static/css/DetailClient.css';
import AuthContext from '../../authorization/AuthContext'


const DetailProduct = () => {
  
  let {user} = useContext(AuthContext)
  const [title, setTitle] = useState("");
  const [id_product_bundle, setIdProductBundle] = useState("");
  // const [id_product_bundle_line, setIdProductBundleLine] = useState("");
  const [total_price, setTotalPrice] = useState("");
  const [product_lines, setProductLines] = useState([]);
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
    getProductBundleById();
  }, []);

  const getProductBundleById = async () => {
    const response = await fetch(`${url}/api/product/product-detail/${id}`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessToken}`
      }
    })
    const data = await response.json();
    setTitle(data.title);
    setTotalPrice(data.unit_price);
    getProductLines()
  };

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  const getProductLines = async () => {
      const response = await fetch(`${url}/api/product/product-bundle-line-get/${id}`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${accessToken}`
        }
      });
      const data = await response.json();
      setProductLines(data)
  };

  return (
    <div>
        <div>
          <div id='main-card'>
            <div id="title">
              <h1 class="title">Detail Product</h1>
            </div>
            {/* <div class='container' id="sub-card"> */}
              <h5 style={{margin:"2rem 0"}}>Product title: {title}</h5>
              <div class='container' id="sub-card" style={{marginBottom:20}}>
              <table className="table is-striped is-fullwidth">
                  <thead>
                      <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Unit Price</th>
                      </tr>
                  </thead>
                  <tbody>
                      {product_lines.map((pbl, index) => (
                      <tr key={pbl.id}>
                          <td style={{textAlign:"center"}}>{ index + 1 }</td>
                          <td style={{textAlign:"center"}}>{ pbl.title }</td>
                          <td style={{textAlign:"center"}}>{ pbl.description }</td>
                          <td style={{textAlign:"right"}}>{ formatter.format(pbl.unit_price) }</td>
                      </tr>
                      ))}
                  </tbody>
              </table>
              <table className="table is-fullwidth" style={{marginBottom:5}}>
                    <tbody>
                        <tr>
                            <td className="total">T O T A L</td>
                            <td className="price is-total">{formatter.format(total_price)}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
          </div>
        </div>
    // </div>
  );

};

export default DetailProduct;