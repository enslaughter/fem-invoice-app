import {useState, useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import {Link} from "react-router-dom";

import backarrow from "../assets/icon-arrow-left.svg";

import InvoiceStatus from "../components/InvoiceStatus";
import MarkPaid from "../components/buttons/MarkPaid";
import {deepClone, useWindowSize} from "../components/Functionality";
import InvoiceForm from "../components/InvoiceForm";

function Invoice(props: any){
    const windowSize = useWindowSize();
    const history = useHistory();

    interface ParamTypes {
        invoiceid: string
    }
    let grabbedID = useParams<ParamTypes>();

    let itemStyleFirst = {
        borderRadius: "8px 8px 0 0"
    }
    
    let itemStyleFirstMulti = {
        borderRadius: "8px 8px 0 0"
    }
    
    const [invoiceData, setInvoiceData] = useState(props.lookupInvoice(grabbedID.invoiceid));
    const [invoiceStatus, setInvoiceStatus] = useState(invoiceData.status);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    function updateInvoiceStatus(newStatus: string){
        setInvoiceStatus(newStatus)
        let statInvoice = deepClone(invoiceData);
        statInvoice.status = newStatus;
        setInvoiceData(statInvoice)
        props.updateInvoice(statInvoice.id, statInvoice);
    }

    function updateInvoiceFull(newInvoice: any){
        setInvoiceData(deepClone(newInvoice));
        props.updateInvoice(newInvoice.id, newInvoice);
        setEditOpen(false);
        props.setModalOpen(false);
    }

    function openEditModal(){
        props.setModalOpen(true);
        setEditOpen(true);
    }

    //This function should only be called if the user is closing the modal WITHOUT submitting the form
    function closeEditModal(){
        setEditOpen(false);
        props.setModalOpen(false);
    }

    function deleteInvoiceModal(){
        props.deleteInvoice(invoiceData.id);
        history.push("/");
    }

    if (invoiceData!==null){
        return(
            <div style={{minHeight: "100%"}}>
                <Link to="/">
                    <div className="invoice-goback">
                        <img src={backarrow} alt="" style={{marginRight: "24px"}}></img>Go Back
                    </div>
                </Link>
                <div className="invoice-main-status">
                    Status
                    <InvoiceStatus status={invoiceStatus}/>
                </div>
    
                <div className="invoice-info">
                    <span className="invoice-card--id"><span>#</span><span style={{color: "black", fontWeight: "bold"}}>{invoiceData.id}</span></span>
                    <p className="invoice-info--descripton">{invoiceData.description}</p>
                    <div className="invoice-info--senderaddress">  
                        <p>{invoiceData.senderAddress.street}</p>
                        <p>{invoiceData.senderAddress.city}</p>
                        <p>{invoiceData.senderAddress.postCode}</p>
                        <p>{invoiceData.senderAddress.country}</p>
                    </div>
                    
                    <div className="invoice-info--dates-billto-container">
                        <div className="invoice-info--dates">
                            <div>
                                <p>Invoice Date</p>
                                <p className="invoice-info--dates-billto-subheader" style={invoiceData.clientAddress.street !== "" ? {} : {marginBottom: "24px"}}>{invoiceData.createdAt}</p>
                            </div>
                            <div>
                                <p>Payment Due</p>
                                <p className="invoice-info--dates-billto-subheader">{invoiceData.paymentDue}</p>
                            </div>
                        </div>
                        <div className="invoice-info--billto">
                            <div>
                                <p>Bill To</p>
                                <p className="invoice-info--dates-billto-subheader">{invoiceData.clientName}</p>
                                <div className="invoice-info--clientaddress">
                                    <p>{invoiceData.clientAddress.street}</p>
                                    <p>{invoiceData.clientAddress.city}</p>
                                    <p>{invoiceData.clientAddress.postCode}</p>
                                    <p>{invoiceData.clientAddress.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p style={invoiceData.clientEmail !== "" ? {} : {display: "none"}}>Sent to</p>
                    <p className="invoice-info--dates-billto-subheader">{invoiceData.clientEmail}</p>

                    <div className="invoice-info--items">
                        <div className="invoice-info--items">
                            {invoiceData.items.map((item: any, index: any) => (
                                <div className="invoice-item--container" key={index} style={index===0 ? (invoiceData.items.length > 1 ? itemStyleFirstMulti : itemStyleFirst) : {}}>
                                    <div>
                                        <p>{invoiceData.items[index].name}</p>
                                        <p>{`${invoiceData.items[index].quantity} x $ ${typeof invoiceData.items[index].price === "number" ? invoiceData.items[index].price.toFixed(2) : invoiceData.items[index].price}`}</p>
                                    </div>
                                    <div>
                                        $ {typeof invoiceData.items[index].total === "number" ?  invoiceData.items[index].total.toFixed(2) : invoiceData.items[index].total}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="invoice-info--total">
                            <p>Grand Total</p>
                            <p>$ {invoiceData.total.toFixed(2)}</p>
                        </div>
                    </div>

                </div>
                
                <div className="invoice-edit">
                    <button className="invoice-app--button edit" onClick={openEditModal}>
                        Edit
                    </button>
                    <button className="invoice-app--button delete" style={invoiceData.status === "pending" ? {margin: "0px 8px"} : {marginLeft: "8px"}} onClick={() => setDeleteOpen(true)}>
                        Delete
                    </button>
                    {invoiceData.status === "pending" && <MarkPaid updateInvoiceStatus={updateInvoiceStatus}/>}
                </div>

                {/* Component for the form for editing the invoice. It shaves off a LOT of code */}
                <InvoiceForm editOpen={editOpen} closeEditModal={closeEditModal} invoiceData={invoiceData} updateInvoiceFull={updateInvoiceFull}/>

                {/* CANCEL CONFIRMATION MODAL SECTION */}
                <div className="invoice-delete-modal-container" style={deleteOpen ? {width: `${windowSize.width}`,height: `${windowSize.height}px`, visibility: "visible"} : {width: `${windowSize.width}`, height: `${windowSize.pageHeight}px`,visibility: "hidden"}}>
                    <div className="invoice-delete-modal">
                        <p className="invoice-delete-header">Confirm Deletion</p>
                        <p>{`Are you sure you want to delete invoice #${invoiceData.id}? This action cannot be undone.`}</p>
                        <div className="invoice-delete-buttons">
                            <button className = "invoice-app--button button-edit-cancel" onClick={() => setDeleteOpen(false)}>
                                Cancel
                            </button>
                            <button className = "invoice-app--button delete" style={{marginLeft: "8px"}} onClick={deleteInvoiceModal}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                Error! This invoice doesn't seem to exist!
            </div>
        )
    }
    
}

export default Invoice;