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


const ListClient = () => {
  
  let {user} = useContext(AuthContext)
  const [clients, setClients] = useState([]);
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [clientId, setClientId] = useState(null)
  let authTokens;

  try {
    authTokens = JSON.parse(localStorage.getItem('authTokens'));
  } catch (e) {
    console.log(e)
  }
  const accessToken = authTokens ? authTokens.access : null;

  const url = 'http://localhost:8000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(`${url}/api/client/`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${accessToken}`
        }
    });
    const data = await response.json();
    setClients(data);
  }

  const deleteClient = async(id) => {
    await fetch(`${url}/api/client/${id}/delete`, {
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
    setClientId(id);
    setMessage(null);
    setDeleteMessage(`Are you sure you want to delete this client?`);
    setDisplayConfirmationModal(true);
  };

  // Hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

    return (
    <div style={{width: "90%", margin:"auto"}} className="content">
        <section>
        <h1 style={{marginBottom:25}}>Client</h1>
        <table className="table is-striped is-fullwidth">
            <thead>
                <tr>
                    <th style={{width: "5%"}}>No</th>
                    <th style={{width: "40%"}}>Company Name</th>
                    <th style={{width: "15%"}}>Type</th>
                    <th style={{width: "20%"}}>Phone</th>
                    <th colSpan={2} style={{width: "10%"}}>Action</th>
                    {/* <th>Delete</th> */}
                </tr>
            </thead>
            <tbody>
                {clients.map((client, index) => (
                    <tr key={client.id}>
                    <td style={{textAlign:"center"}}>{ index + 1 }</td>
                    <td style={{textAlign:"center"}}>{ client.company_name }</td>
                    <td style={{textAlign:"center"}}>{ client.type }</td>
                    <td style={{textAlign:"center"}}>{ client.phone }</td>
                    <td style={{textAlign:"center"}}>
                        <Link to={`/client/detailClient/${client.id}`} className="link-button">Detail</Link>
                    </td>
                    {user.group.find(role=>['Executive', 'Manager', 'Partnership'].includes(role)) ?
                    <td style={{textAlign:"center"}}>
                        <button onClick={() => showDeleteModal(client.id)} className="button is-small is-danger">Delete</button>
                        {/* <button onClick={() => deleteClient(client.id)} className="button is-small is-danger">Delete</button> */}
                    </td>
                    : null}
                </tr>
                ))}

            </tbody>
        </table>
        </section>
        <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={deleteClient} hideModal={hideConfirmationModal} id={clientId} message={deleteMessage}/>
    </div>
    )
};

export default ListClient;