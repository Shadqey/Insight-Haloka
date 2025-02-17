import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato"
import '../../static/css/font.css';
import '../../static/css/Button.css';
import '../../static/css/card.css';
import '../../static/css/DetailInvoice.css';
import AuthContext from '../../authorization/AuthContext';
import CancelConfirmation from "../../components/Confirmation/CancelConfirmation";

const DetailInvoice = () => {
    let {user} = useContext(AuthContext)
    const [companyName, setCompanyName] = useState("");
    const [invoice, setInvoice] = useState({});
    const [contract, setContract] = useState(null);
    const [is_cancelled, setIsCancelled] = useState()
    const [cancelled_by, setCancelledBy] = useState()
    const navigate = useNavigate()
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [cancelMessage, setCancelMessage] = useState(null);
    const [message, setMessage] = useState(null);
    const { id } = useParams();

    let authTokens;
    try {
        authTokens = JSON.parse(localStorage.getItem('authTokens'));
    } catch (e) {
    // Handle the error
    console.log(e)
    }
    const accessToken = authTokens ? authTokens.access : null;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`http://localhost:8000/api/invoice/detail/${id}/`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        });
        const data = await response.json();
        setInvoice(data);
        setCompanyName(data.client.company_name)
        setContract(data.contract)
        setIsCancelled(data.is_cancelled)
        setCancelledBy(data.cancelled_by)
        console.log(cancelled_by)
        console.log(user.user_id)
    }

    const handleDownload = async () => {
        const response = await fetch(`http://localhost:8000/api/invoice/downloadPDF/${id}/`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${accessToken}`
            }
        });
        console.log(response);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    const showCancelModal = (id) => {
        setMessage(null);
        setCancelledBy(user.user_id);
        setCancelMessage(`Are you sure you want to cancel this invoice?`);
        setDisplayConfirmationModal(true);
    };

    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    const submitCancel = async (id) => {
        setMessage(`This invoice was cancelled succesfully.`);
        await fetch(`http://localhost:8000/api/invoice/cancel/${id}/`, {
        method: "PUT",
        body: JSON.stringify({"is_cancelled":true, "cancelled_by":cancelled_by}),
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
        navigate(`/invoice/detail/${id}`)
    };

    const handleCancel = async (e) => {
        e.preventDefault();
        setIsCancelled(true)
        setCancelledBy(user)

        const invoice = { is_cancelled, cancelled_by }
        await fetch(`http://localhost:8000/api/invoice/cancel/${id}/${user.id}`, {
            method: "PUT",
            body: JSON.stringify(invoice),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        navigate(`/detail/${id}`)
    }

    const invoiceIds = invoice?.invoices?.map((invoice) => invoice.product_bundle_line.id) || [];

    const invoicess = invoice?.invoices || [];
    const totalPrice = invoicess.reduce((acc, curr) => {
    const unitPrice = parseFloat(curr.product_bundle_line.product_line.unit_price);
    return acc + unitPrice;
    }, 0);

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      });

    return (
        <div>
        <div id='main-card'>
            <div>
                <h1>Detail Invoice</h1>
                <h4 className="id">{invoice.number}</h4>
                {(is_cancelled) ? (
                <h4 className="id">Cancelled By: {cancelled_by.name}</h4>
            ) : (
                null
            )}
            </div>
            
            <div class="info">
                <table class="info">
                    <tbody>
                    <tr><td className="info">Date</td><td className="info">:</td><td className="info">{invoice.created_date}</td></tr>
                    <tr><td className="info">Client</td><td className="info">:</td><td className="info">{companyName}</td></tr>
                    </tbody>
                </table>
            </div>

            <div>
                <table className="table is-striped is-fullwidth" style={{marginBottom:0}}>
                    {contract?.contracts && contract.contracts.map((contract) => (
                        <tbody>
                            <tr key={contract.id}>
                                <td className="product">{contract.product.title}</td>
                                <td></td>
                                <td></td>
                            </tr>
                            {invoiceIds && contract.product.product_bundles.map((productBundle) =>
                                productBundle.product_bundle_lines.map((productBundleLine, index) => {
                                    if (invoiceIds.includes(productBundleLine.id)) {
                                        return (
                                            <tr key={productBundleLine.product_line.id}>
                                                <td className="listProduct">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{productBundleLine.product_line.title}</td>
                                                <td>{productBundleLine.product_line.description}</td>
                                                <td className="price">{formatter.format(productBundleLine.product_line.unit_price)}</td>
                                            </tr>
                                        );
                                    } else {
                                        return null;
                                    }
                                })
                            )}
                        </tbody>
                    ))}
                </table>
                
                <table className="table is-fullwidth" style={{marginBottom:"1rem"}}>
                    <tbody>
                        <tr>
                            <td className="total">T O T A L</td>
                            <td className="price is-total">{formatter.format(totalPrice)}</td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <div className="d-flex justify-content-center">
                <button class="button is-small is-danger" onClick={handleDownload}>Generate PDF</button>
                {(is_cancelled) ? (
                    null
                ) : (
                    <button onClick={() => showCancelModal(invoice.id)} className="button is-small is-danger">Cancel Invoice</button>
                )}
            </div>
            <CancelConfirmation showModal={displayConfirmationModal} confirmModal={submitCancel} hideModal={hideConfirmationModal} id={invoice.id} message={cancelMessage}/>
            
        </div>
        </div>
    );
};

export default DetailInvoice;