import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato";
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css'; 
import '../../static/css/HomeProduct.css';
import AuthContext from '../../authorization/AuthContext';
import DeleteConfirmation from "../../components/Confirmation/DeleteConfirmation";

const HomeProduct = () => {
  let {user} = useContext(AuthContext)
  const [products, setProducts] = useState([]);
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [productId, setProductId] = useState(null)

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
    const response = await fetch(`${url}/api/product/product-bundle`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessToken}`
      }
    });
    const data = await response.json();
    setProducts(data);
  }

  const deleteProducts = async(id) => {
    setMessage(`The product was deleted successfully.`);

    await fetch(`${url}/api/product/product-delete/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${accessToken}`
        }
    })
    .then(response => {
      if (response.ok) {
          setDisplayConfirmationModal(false);
      } else {
          throw new Error('Something went wrong');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
    fetchData();
  }

  // Handle the displaying of the modal based on type and id
  const showDeleteModal = (id) => {
    setProductId(id);
    setMessage(null);
    setDeleteMessage(`Are you sure you want to delete this product?`);
    setDisplayConfirmationModal(true);
  };

  // Hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  return (
    <div className="content">
        <section>
          <div className="container">
            <h1>Our Products</h1>
            <div className="link-container">
              <Link to='add/' className="link">+ Add Product</Link>
              <Link to='product-line/' className="link">View Product Line</Link>
            </div>
            <br></br>
            <div className="cards">
              {products.map((product, i) => (
                <div key={i} className="card">
                  <h3>{product.title}</h3>
                  <p>Price : {formatter.format(product.unit_price)}</p>
                  <div className="d-flex justify-content-center product-button">
                  <Link to={`/product/product-detail/${product.id}`} className="link-button" style={{textAlign:"center"}}>View More</Link>
                  <button onClick={() => showDeleteModal(product.id)} className="button is-small is-danger">Delete</button>
                  {/* <button onClick={() => deleteProducts(product.id)} className="button is-small is-danger">Delete</button> */}
                  
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={deleteProducts} hideModal={hideConfirmationModal} id={productId} message={deleteMessage}/>
      </div>
  );
};

export default HomeProduct;