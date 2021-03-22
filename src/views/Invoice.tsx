import {useState} from "react";
import {useParams} from "react-router-dom";
import {Link} from "react-router-dom";

import backarrow from "../assets/icon-arrow-left.svg";
import icondelete from "../assets/icon-delete.svg"

import InvoiceStatus from "../components/InvoiceStatus";
import EditInvoice from "../components/buttons/EditInvoice";
import DeleteInvoice from "../components/buttons/DeleteInvoice";
import MarkPaid from "../components/buttons/MarkPaid";
import {deepClone} from "../components/Functionality";

function Invoice(props: any){
    interface ParamTypes {
        invoiceid: string
    }
    let grabbedID = useParams<ParamTypes>();

    let itemStyleFirst = {
        borderRadius: "8px 8px 0 0"
    }
    
    let itemStyleFirstMulti = {
        borderRadius: "8px 8px 0 0",
        paddingBottom: "0"
    }

    let invoiceData = props.lookupInvoice(grabbedID.invoiceid);
    
    const [invoiceStatus, setInvoiceStatus] = useState(invoiceData.status);
    const [editedInvoice, setEditedInvoice] = useState({...invoiceData});
    const [editOpen, setEditOpen] = useState(true);
    const [deleteOpen, setDeleteOpen] = useState(false);

    function handleFormChange(event: any){
        const propName = event.target.name;
        const value = event.target.value;

        if (event.target.tagName == "SELECT"){
            console.log(propName + " " + value);
            console.log(typeof value)
        }

        setEditedInvoice((prevState: any) => {
            return {...prevState, [propName]: value}
        })
    }

    function handleFormChange_sender(event: any){
        const propName = event.target.name;
        const value = event.target.value;
        let sender = {...editedInvoice.senderAddress};
        sender[propName] = value;
        setEditedInvoice((prevState: any) => {
            return {...prevState, senderAddress: sender}
        })
    }

    function handleFormChange_client(event: any){
        const propName = event.target.name;
        const value = event.target.value;
        let client = {...editedInvoice.clientAddress};
        client[propName] = value;
        setEditedInvoice((prevState: any) => {
            return {...prevState, clientAddress: client}
        })
    }

    function handleFormChange_items(event: any){
        // if(event.target.tagName != "INPUT"){
        //     return;
        // }
        const propName = event.target.name;
        const value = event.target.value;
        if (propName === "price"){
            //let reg = /^\d*\.?\d*$/;
            let reg = /^(\d+(?:.\d{1,2})?).*/;
            if (!reg.test(value.toString())){
                return;
            }
        }
        let key: any = event.target.getAttribute("data-key");
        let items: any = [];

        for (let i=0;i<editedInvoice.items.length; i++){
            items.push({...editedInvoice.items[i]});
        }

        items[key][propName] = value;
        items[key].total = (items[key].quantity * items[key].price);
        setEditedInvoice((prevState: any) => {
            return {...prevState, items: items}
        })
    }

    function submitForm(){
        console.log("egg");
    }

    function validateForm(){
        console.log("Form Validated Successfully");
    }

    function updateInvoiceStatus(newStatus: string){
        setInvoiceStatus(newStatus)
        invoiceData.status = newStatus;
        props.updateInvoice(invoiceData);
    }

    function addInvoiceItem(event: any){
        event.preventDefault();
        let items = editedInvoice.items;
        items.push({
            "name": "",
            "quantity": 0,
            "price": 0.00,
            "total": 0.00
        })

        setEditedInvoice((prevState: any) => {
            return{...prevState, [items]: items}
        })
    }

    function deleteInvoiceItem(event: any){
        let key: any = event.target.getAttribute("data-key");
        let items: any = [];
        for (let i=0;i<editedInvoice.items.length;i++){
            if (key!=i){
                items.push(editedInvoice.items[i])
            }
        }
        console.log(items);
        setEditedInvoice((prevState: any) => {
            return{...prevState, items: items}
        })
    }

    function deleteInvoicePrompt(){

    }

    function openEditModal(){
        props.setModalOpen(true);
        setEditOpen(true);
    }

    function closeEditModal(){
        setEditedInvoice({...invoiceData});
        console.log(JSON.stringify(editedInvoice));
        setEditOpen(false);
        props.setModalOpen(false);
    }

    if (invoiceData!==null){
        return(
            <div>
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
                                        <p>{`${invoiceData.items[index].quantity} x $ ${invoiceData.items[index].price}`}</p>
                                    </div>
                                    <div>
                                        $ {invoiceData.items[index].total.toFixed(2)}
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
                    <DeleteInvoice style={invoiceData.status === "pending" ? {margin: "0px 8px"} : {marginLeft: "8px"}} />
                    {invoiceData.status === "pending" && <MarkPaid updateInvoiceStatus={updateInvoiceStatus}/>}
                </div>

                {/* EDIT INVOICE VIEW */}
                <div className="edit-invoice-container" style={editOpen ? {display: "block"} : {display: "none"}}>
                    <div className="edit-invoice-modal">
                        <div className="invoice-goback" onClick={closeEditModal}>
                            <img src={backarrow} alt="" style={{marginRight: "24px"}}></img>Go Back
                        </div>
                        <p>Edit <span>#</span>{invoiceData.id}</p>
                        <form>
                            <p>Bill From</p>
                                <div className="form-flexbox">
                                    <label htmlFor="sender-address">Street Address</label>
                                    <input type="text" name="street" id="sender-address" value={editedInvoice.senderAddress.street} onChange={handleFormChange_sender}></input>

                                    <div className="form-flexbox--row">
                                        <div>
                                            <label htmlFor="sender-city">City</label>
                                            <input type="text" name="city" id="sender-city" value={editedInvoice.senderAddress.city} onChange={handleFormChange_sender}></input>
                                        </div>
                                        <div style={{minWidth: "24px", maxWidth: "24px"}}></div>
                                        <div>
                                            <label htmlFor="sender-postcode">Post Code</label>
                                            <input type="text" name="postCode" id="sender-postcode" value={editedInvoice.senderAddress.postCode} onChange={handleFormChange_sender}></input>
                                        </div>
                                    </div>

                                    <label htmlFor="sender-country">Country</label>
                                    <input type="text" name="country" id="sender-country" value={editedInvoice.senderAddress.country} onChange={handleFormChange_sender}></input>
                                </div>
                                

                            <p>Bill To</p>
                            <div className="form-flexbox">
                                <label htmlFor="client-name">Client's Name</label>
                                <input type="text" name="clientName" id="client-name" value={editedInvoice.clientName} onChange={handleFormChange}></input>

                                <label htmlFor="client-email">Client's Email</label>
                                <input type="text" name="clientEmail" id="client-email" value={editedInvoice.clientEmail} onChange={handleFormChange}></input>

                                <label htmlFor="client-address">Street Address</label>
                                <input type="text" name="street" id="client-address" value={editedInvoice.clientAddress.street} onChange={handleFormChange_client}></input>

                                <div className="form-flexbox--row">
                                    <div>
                                        <label htmlFor="client-city">City</label>
                                        <input type="text" name="city" id="client-city" value={editedInvoice.clientAddress.city} onChange={handleFormChange_client}></input>
                                    </div>
                                    <div style={{minWidth: "24px", maxWidth: "24px"}}></div>
                                    <div>
                                        <label htmlFor="client-postcode">Post Code</label>
                                        <input type="text" name="postCode" id="client-postcode" value={editedInvoice.clientAddress.postCode} onChange={handleFormChange_client}></input>
                                    </div>
                                </div>
                                                           
                                <label htmlFor="client-country">Country</label>
                                <input type="text" name="country" id="client-country" value={editedInvoice.clientAddress.country} onChange={handleFormChange_client}></input>
                            </div>
                                
                            <div className="form-flexbox">
                                <label htmlFor="invoice-duedate">Invoice Date</label>
                                <input type="date" name="createdAt" id="invoice-duedate" value={editedInvoice.createdAt} onChange={handleFormChange}></input>

                                <label htmlFor="payment-terms">Payment Terms</label>
                                <select name="paymentTerms" id="payment-terms" value={editedInvoice.paymentTerms} onChange={handleFormChange}>
                                    <option value={1}>Net 1 Days</option>
                                    <option value={7}>Net 7 Days</option>
                                    <option value={14}>Net 14 Days</option>
                                    <option value={30}>Net 30 Days</option>
                                </select>

                                <label htmlFor="project-description">Project Description</label>
                                <input type="text" name="description" id="project-description" value={editedInvoice.description} onChange={handleFormChange}></input>
                            </div>
                            
                            <p>Item List</p>
                            <div className="form-flexbox">
                                {editedInvoice.items.map((item: any, key: any) => (
                                    <div key={key} style={{width: "100%"}}>
                                        <label htmlFor={`invoice-item-${item.name}`}>Item Name</label>
                                        <input type="text" name="name" id={`invoice-item-${item.name}`} data-key={key} value={item.name} onChange={handleFormChange_items}></input>

                                        <div className="form-flexbox--invoiceitems">
                                            <div>
                                                <label htmlFor={`quantity-${key+1}`}>Qty.</label>
                                                <input type="text" name="quantity" id={`quantity-${key+1}`} data-key={key} value={item.quantity} maxLength={2} size={1} onChange={handleFormChange_items}></input>
                                            </div>
                                            <div>
                                                <label htmlFor={`price-${key+1}`}>Price</label>
                                                <input type="text" name="price" id={`price-${key+1}`} data-key={key} value={item.price} maxLength={8} size={4} onChange={handleFormChange_items}></input>
                                            </div>
                                            <div>
                                                <label htmlFor={`total-${key+1}`}>Total</label>
                                                <input type="text" name="total" id={`total-${key+1}`} data-key={key} value={item.total.toFixed(2)} size={4} onChange={handleFormChange} disabled></input>
                                            </div>
                                                                                      
                                            <button type="button" style={{marginTop: "12px", marginLeft: "auto"}} data-key={key} onClick={deleteInvoiceItem}>
                                                <img src={icondelete} alt="" style={{pointerEvents: "none"}}></img>
                                            </button>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                            
                            <div className="form-newitem">
                                <button type="button" onClick={addInvoiceItem}>+ Add New Item</button> 
                            </div>
                            
                            <div className="edit-modal-buttons">
                                <button type="button">Cancel</button>
                                <button type="button">Save Changes</button>
                            </div>
                        </form>
                        
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