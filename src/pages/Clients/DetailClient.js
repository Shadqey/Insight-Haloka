import { useState, useEffect, useContext } from "react";

import { useParams, Link } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato"
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css';
import '../../static/css/DetailClient.css';
import AuthContext from '../../authorization/AuthContext';
import DeleteConfirmation from "../../components/Confirmation/DeleteConfirmation";
import { FaArrowCircleRight, FaArrowCircleDown } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

const DetailClient = () => {
  
  let {user} = useContext(AuthContext)
  const [company_name, setCompany_name] = useState("");
  const [type, setType] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contract, setContract] = useState([]);

  const [contractId, setContractId] = useState(null)
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [message, setMessage] = useState(null);

  const [isUpContract, setIsUpContract] = useState(false);
  const url = 'http://localhost:8000'

  let authTokens;
  try {
      authTokens = JSON.parse(localStorage.getItem('authTokens'));
  } catch (e) {
    console.log(e)
  }
  const accessToken = authTokens ? authTokens.access : null;

  const { id } = useParams();

  useEffect(() => {
    getClientById();
    getContract();
  }, []);

  function toggleUpContract() {
    setIsUpContract(!isUpContract);
  }

  const getClientById = async () => {
    const response = await fetch(`${url}/api/client/detailClient/${id}/`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessToken}`
      }
    });
    const data = await response.json();
    setCompany_name(data.company_name);
    setType(data.type);
    setPhone(data.phone);
    setEmail(data.email)
  }

  const getContract = async () => {
      const response = await fetch(`${url}/api/contract/client/${id}/`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${accessToken}`
        }
      });
      const data = await response.json();
      setContract(data);
      console.log(data);
  }

  // Handle the displaying of the modal based on type and id
  const showDeleteModal = (id) => {
    setContractId(id);
    setMessage(null);
    setDeleteMessage(`Are you sure you want to delete the contract?`);
    setDisplayConfirmationModal(true);
  };

  // Hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  // Handle the actual deletion of the item
  const submitDelete = async (id) => {
    setMessage(`The contract was deleted successfully.`);

    await fetch(`${url}/api/contract/${id}/delete`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${accessToken}`
        }
    })
    .then(response => {
        if (response.ok) {
            getContract(); // Call getContract() after the response is available
            setDisplayConfirmationModal(false);
        } else {
            throw new Error('Something went wrong');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  };

  return (
    <div>
        <div id='main-card'>
            <div id="title">
                <h2 class="title"> Company Profile </h2>
            </div>
            {/* <div class='container' id="sub-card"> */}
            {/* <h1 className='heading-h1 text-left text-header'>Profile</h1> */}
            <div class='row justify-content-md-center'>
              <div class="mini-card col col-lg-5">
                <h3 class="attribute">Name:</h3>
                <p>{company_name}</p>
              </div>
              <div class="col-md-auto"> {/* dikosongin saja */} </div>
              <div class="mini-card col col-lg-5">
                <h3 class="attribute">Type:</h3>
                <p>{type}</p>
              </div>            
            </div>
            <div class='row justify-content-md-center'>
              <div class="mini-card col col-lg-5">
                <h3 class="attribute">Email:</h3>
                <p>{email}</p>
              </div>
              <div class="col-md-auto"> {/* dikosongin saja */} </div>
              <div class="mini-card col col-lg-5">
                <h3 class="attribute">Phone:</h3>
                <p>{phone}</p>
              </div>            
            </div>

            {user.group.find(role=>['Manager','Partnership','Finance'].includes(role))
              ? 
              <div>
                <h1 className='heading-h1 text-left text-header' onClick={toggleUpContract} style={{marginTop:25}}>
                  {isUpContract ? <FaArrowCircleRight size={25} /> : <FaArrowCircleDown size={25}/>} Contract
                </h1>
                {
                  !isUpContract ?
                  <div>
                    {!user.group.find(role=>['Finance'].includes(role)) ?
                    <div className="add-contract">
                    <Link to={`/contract/${id}`} className="link-button">+ Add Contract</Link>
                    </div>
                    :null}

                    {contract.length===0 ? <p>No Contract Available</p>:
                    <div class='container' id="sub-card" style={{width:"85%", margin:"auto"}}>
                      <table className="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th style={{width: "5%"}}>No</th>
                                <th style={{width: "20%"}}>Code</th>
                                <th style={{width: "10%"}}>Status</th>
                                <th colSpan={2} style={{width: "10%"}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contract.map((c, index) => (
                                <tr key={c.id}>
                                  <td style={{textAlign:"center"}}>{ index+1 }</td>
                                <td style={{textAlign:"center"}}>{ c.number }</td>
                                {(c.status === "approved") ? (
                                  <td style={{textAlign:"center", fontWeight:"bold"}}>Approved</td>
                                ) : (
                                  <td style={{textAlign:"center", color:"gray", textTransform: "capitalize"}}>{ c.status.replace(/_/g, " ") }</td>
                                )}
                                <td style={{textAlign:"center"}}>
                                  <Link to={`/contract/contract-detail/${c.id}`} className="link-button" style={{padding:"0.1rem 1rem"}}>Detail</Link>
                                </td>
                                {c.status !== 'approved' && !(user.group.find(role=>['Finance'].includes(role))) ?
                                <td>
                                  <button onClick={() => showDeleteModal(c.id)} className="button is-small is-danger" style={{padding:"0.1rem 1rem"}}>Delete</button>
                                </td>
                                : null}
                                
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    }
                  </div>
                  : null
                }
              </div>
              : ""
            }
            <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} id={contractId} message={deleteMessage}/>
            <br></br>
            
            {user.group.find(role=>['Executive', 'Manager','Partnership'].includes(role))
            ?
            <div className="d-flex justify-content-center">
              <Link to={`/client/${id}/update/`}>
                <button className="button is-small is-danger">Update</button>
              </Link>
            </div>
            :null}
            </div>
        </div>
    // </div>
  );
};

export default DetailClient;