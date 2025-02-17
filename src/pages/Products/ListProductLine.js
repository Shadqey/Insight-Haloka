import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato"
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css';
import '../../static/css/ListClient.css';
import AuthContext from '../../authorization/AuthContext';
import DeleteConfirmation from "../../components/Confirmation/DeleteConfirmation";


const ListProductLine = () => {
  
    let {user} = useContext(AuthContext)
    const [products, setProducts] = useState([]);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [productLineId, setProductLineId] = useState(null)

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
    setProducts(data);
  }

  const deleteProductLine = async(id) => {
    await fetch(`${url}/api/product/product-line-delete/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${accessToken}`
        }
    })
    .then(response => {
        if (response.ok) {
            fetchData();
            setDisplayConfirmationModal(false);
        } else {
            throw new Error('Something went wrong');
        }
    })
    .catch(error => {
        console.error('Error:', error)
    })
  }

    const showDeleteModal = (id) => {
        setProductLineId(id);
        setDeleteMessage(`Are you sure want to delete this Product Line?`);
        setDisplayConfirmationModal(true);
    };

    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    return (
    <div style={{width: "90%", margin:"auto"}} className="content">
        <section>
        <h1 style={{marginBottom:5}}>Product Line</h1>
        <Link to='add/' className="link" style={{marginBottom:30}}>+ Add Product Line</Link>
        <table className="table is-striped is-fullwidth">
            <thead>
                <tr>
                    <th style={{width: "5%"}}>No</th>
                    <th style={{width: "40%"}}>Services</th>
                    <th style={{width: "30%"}}>UnitPrice</th>
                    <th colSpan={2} style={{width: "20%"}}>Action</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={product.id}>
                    <td style={{textAlign:"center"}}>{ index + 1 }</td>
                    <td style={{textAlign:"center"}}>{ product.title }</td>
                    <td style={{textAlign:"center"}}>{ formatter.format(product.unit_price) }</td>
                    <td style={{textAlign:"center"}}>
                        <Link to={`/product/product-line-detail/${product.id}/`} className="link-button" style={{padding:"0.1rem 1rem"}}>Detail</Link>
                    </td>
                    <td>
                        <button onClick={() => showDeleteModal(product.id)} className="link-button" style={{padding:"0.1rem 1rem"}}>Delete</button>
                    </td>
                </tr>
                ))}

            </tbody>
        </table>
        </section>
        <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={deleteProductLine} hideModal={hideConfirmationModal} id={productLineId} message={deleteMessage}/>
    </div>
    )
};

export default ListProductLine;