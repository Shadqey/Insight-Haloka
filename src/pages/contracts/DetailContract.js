import react,{ useState, useEffect, useContext } from "react";
import { useParams, Link,useNavigate} from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato";
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css';
import '../../static/css/DetailContract.css';
import AuthContext from '../../authorization/AuthContext';
import { FaArrowCircleRight, FaArrowCircleDown } from 'react-icons/fa';
import EmailConfirmation from "../../components/Confirmation/EmailConfirmation";

const url = 'http://127.0.0.1:8000';

function ProductBundle({ productId,index,key }) {
  let {user} = useContext(AuthContext)
  const [title, setTitle] = useState('');
  const [productBundleId, setProductBundleId] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  let authTokens;
  try {
    authTokens = JSON.parse(localStorage.getItem('authTokens'));
  } catch (e) {
    console.log(e)
  }
  const accessToken = authTokens ? authTokens.access : null;

  useEffect(() => {
    getProductBundle();
  },[]);

  const getProductBundle = async () => {
    if (user.group.find(role=>['Manager','Partnership'].includes(role))){
      const response = await fetch(`${url}/api/product/product-bundle/product-id/${productId}/`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${accessToken}`
        }
      });
      const data = await response.json();
      setTitle(data.title);
      setProductBundleId(data.id)
      setUnitPrice(data.unit_price)
    }
  };

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  return (
  
    <tr key={key}>
      <td style={{textAlign:"center"}}>{index+1}</td>
      <td style={{textAlign:"center"}}>{title}</td>
      <td style={{textAlign:"center"}}>{formatter.format(unitPrice)}</td>
      <td style={{textAlign:"center"}}>
        <Link to={`/product/product-detail/${productBundleId}`} className="link-button" style={{padding:"0.1rem 1rem"}}>View</Link>
      </td>
    </tr>
 
     
  );
}

const DetailContract = () => {
  
  let {user} = useContext(AuthContext)
  const [company_name, setCompany_name] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status,setStatus]=useState("")
  const [number,setNumber]=useState("")
  const [link_mou,setLinkMoU]=useState("")
  const [productList,SetProductList]= useState([])
  const [invoiceList,SetInvoiceList]= useState([])
  const [isUpProduct, setIsUpProduct] = useState(false);
  const [isUpInvoice, setIsUpInvoice] = useState(false);
  const [lastEmail,setLastEmail]= useState("");
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [displayMoUConfirmationModal, setDisplayMoUConfirmationModal] = useState(false);
  const [sendMessage, setSendMessage] = useState('');
  const [sendDocumentMessage, setDocumentMessage] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  let authTokens;
  try {
      authTokens = JSON.parse(localStorage.getItem('authTokens'));
  } catch (e) {
  // Handle the error
  console.log(e)
  }
  const accessToken = authTokens ? authTokens.access : null;

  const { id } = useParams();

  useEffect(() => {
    getContractById();getLastEmailByContractId();
  },[]);

  function toggleUpProduct() {
    console.log(productList);
    console.log(productsList2);
    setIsUpProduct(!isUpProduct);
  }
  function toggleUpInvoice() {
    setIsUpInvoice(!isUpInvoice);
  }

  const getLastEmailByContractId = async () => {
    const response = await fetch(`${url}/api/contract/send/email/${id}/`,{
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    setLastEmail(data.last_email)
  };

  const getContractById = async () => {
    const response = await fetch(`${url}/api/contract/contract-detail/${id}/`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessToken}`
      }
    });
    const data = await response.json();
    setCompany_name(data.client?.company_name);
    setStartDate(data.start_date)
    setEndDate(data.end_date);
    setStatus(data.status);
    SetProductList(data.contracts);
    setLastEmail(data.last_email);
    setLinkMoU(data.link_mou);
    setNumber(data.number);
    getInvoiceList();
  };

  const getInvoiceList = async () => {
    if (user.group.find(role=>['Finance'].includes(role))){
      const response = await fetch(`${url}/api/invoice/contract/${id}`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${accessToken}`
        }
      });
      const data = await response.json();
      SetInvoiceList(data);
    }
  }

  const handleDownload = async () => {
    const response = await fetch(`http://localhost:8000/api/contract/downloadDocumentPDF/${id}/`);
    // const response = await fetch(`${url}/api/contract/downloadDocumentPDF/${id}/`);
    console.log(response);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MoU-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  const SendMouModal = () => {
    setMessage(null);
    setDocumentMessage(`Send the MoU Document to client?`);
    setDisplayMoUConfirmationModal(true);
  };

  const submitMouSend = async (id) => {
    setMessage(`MoU Document has been sent`);
    await fetch(`${url}/api/contract/sendDocumentPDF/${id}/`, {
    method: "POST",
    body: JSON.stringify({"id":id}),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessToken}`
        }
    })
    .then(response => {
        if (response.ok) {
            getContractById();
            setDisplayMoUConfirmationModal(false);
        } else {
            throw new Error('Something went wrong');
        }
    })
    .catch(error => {
        console.error('Error:', error)
    })
    navigate(`/contract/contract-detail/${id}`)
};

  const showSendModal = () => {
    setMessage(null);
    setSendMessage(`Would you like an email update on this contract's status?  \nLast message: ${lastEmail}`);
    setDisplayConfirmationModal(true);
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const hideMoUConfirmationModal = () => {
    setDisplayMoUConfirmationModal(false);
  };

  const submitSend = async (id) => {
    setMessage(`Notification has been sent`);
    console.log("check")
    await fetch(`${url}/api/contract/send/email/${id}/`, {
    method: "POST",
    body: JSON.stringify({"id":id}),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessToken}`
        }
    })
    .then(response => {
        if (response.ok) {
          console.log("masuk sini woi");
            getContractById();
            setDisplayConfirmationModal(false);
        } else {
            throw new Error('Something went wrong');
        }
    })
    .catch(error => {
        console.error('Error:', error)
    })
    navigate(`/contract/contract-detail/${id}`)
};


  const productsList2 = productList.map((contract) => contract.product);

  return (
    <div>
      <div id='main-card'>
        <div id="title">
          <h1 class="title"> Detail Contract</h1>
          <h3 class="title" style={{fontSize:"20px"}}> {number} </h3>
        </div>
        {/* <div class='container' id="sub-card"> */}
          <div class='row justify-content-md-center'>
            <div class="mini-card col col-lg-5">
              <h3 class="attribute">Client:</h3>
              <p>{company_name}</p>
            </div>
            <div class="col-md-auto"> {/* dikosongin saja */} </div>
            <div class="mini-card col-lg-5 ">
              <h3 class="attribute">Start Date:</h3>
              <p>{startDate}</p>
            </div>
          </div>
          <div class='row justify-content-md-center'>
            <div class="mini-card col col-lg-5">
              <h3 class="attribute">End Date:</h3>
              <p>{endDate}</p>
            </div>
            <div class="col-md-auto"> {/* dikosongin saja */} </div>
            <div class="mini-card col col-lg-5">
              <h3 class="attribute">Status:</h3>
              <p style={{textTransform: "capitalize"}}>{ status.replace(/_/g, " ") }</p>
            </div>
          </div> 
          {user.group.find(role=>['Manager','Partnership'].includes(role))?
          <div>
            <h1 className='heading-h1 text-left text-header ' onClick={toggleUpProduct} style={{marginTop:25}}> {isUpProduct ?
              <FaArrowCircleRight size={25} /> :
              <FaArrowCircleDown size={25} />} Product
            </h1> 
            { !isUpProduct ?
            <div class='container' id="sub-card" style={{width:"85%", margin:"auto"}}>
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th style={{width: "5%"}}>No</th>
                  <th style={{width: "55%"}}>Name</th>
                  <th style={{width: "30%"}}>Price</th>
                  <th style={{width: "10%"}}>Action</th>
                </tr>
              </thead>
              <tbody> {productsList2.map((c, index) => ( <ProductBundle productId={c} index={index} key={c}></ProductBundle> ))} </tbody>
            </table>
            </div> :null }  
          </div>
          :null}
          
          
          {status === 'approved' && user.group.find(role=>['Finance'].includes(role))?
            <div>
              <h1 className='heading-h1 text-left text-header ' onClick={toggleUpInvoice}> {isUpInvoice ?
                <FaArrowCircleRight size={25} /> :
                <FaArrowCircleDown size={25} />} Invoice
              </h1>
              {!isUpInvoice ? (
                <div>
                  <div className="add-invoice">
                  <Link to={`/invoice/add/${id}`} className="link-button">+ Generate New Invoice</Link>
                  </div>
                <div class='container' id="sub-card" style={{width:"85%", margin:"auto"}}>
                <table className="table is-striped is-fullwidth">
                  <thead>
                    <tr>
                      <th style={{width: "5%"}}>No</th>
                      <th style={{width: "35%"}}>Code</th>
                      <th style={{width: "30%"}}>Status</th>
                      <th style={{width: "20%"}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceList &&
                      invoiceList.map((i, index) => (
                        <tr key={i.id}>
                          <td style={{textAlign:"center"}}>{index + 1}</td>
                          <td style={{textAlign:"center"}}>{i.number}</td>
                          {(i.is_cancelled) ? (
                            <td style={{textAlign:"center", color:"gray"}}>Cancelled</td>
                          ) : (
                            <td style={{textAlign:"center", fontWeight:"bold"}}>Active</td>
                          )}
                          <td style={{textAlign:"center"}}>
                            <Link to={`/invoice/detail/${i.id}`} className="link-button" style={{padding:"0.1rem 1rem"}}>
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                </div>
              </div>
            ) : null}
            </div>
          :null }
          <div className="d-flex justify-content-center">
          {
            status === 'approved' && user.group.find(role=>['Manager', 'Partnership'].includes(role))?
            <div className="d-flex justify-content-center">
              <button class="button is-small is-danger" style={{marginTop:30}} onClick={handleDownload}>Generate MoU</button>
              {
                link_mou !== 'unknown' ?
                <button onClick={() => SendMouModal()} className="button is-small is-danger" style={{marginTop:30}}>Send MoU</button>
                : null
              }
            </div>
            : null
          }
          
          {
            status !== 'approved' && !user.group.find(role=>['Finance'].includes(role)) ?
            <div className="d-flex justify-content-center">
              <Link to={`/contract/update/${id}/`} >
                <button className="button is-small is-danger" style={{marginTop:30}}>Update</button>
              </Link>
            </div>
            
            : null
          }

          {user.group.find(role=>['Executive','Manager','Partnership'].includes(role)) ?
            <button onClick={() => showSendModal()} className="button is-small is-danger" style={{marginTop:30}}>Notify Client</button>
          :null}
          
          </div>
          
          
        </div>
        { /* Send Email */ }
        <EmailConfirmation showModal={displayConfirmationModal} confirmModal={submitSend} hideModal={hideConfirmationModal} id={id} message={sendMessage}/>
        {/* Send Document MoU */}
        <EmailConfirmation showModal={displayMoUConfirmationModal} confirmModal={submitMouSend} hideModal={hideMoUConfirmationModal} id={id} message={sendDocumentMessage}/>
      </div>
      
    // </div>
  );
};

export default DetailContract;