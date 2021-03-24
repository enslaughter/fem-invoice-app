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
    
    const [invoiceData, setInvoiceData] = useState(props.lookupInvoice(grabbedID.invoiceid));
    const [invoiceStatus, setInvoiceStatus] = useState(invoiceData.status);
    const [editedInvoice, setEditedInvoice] = useState(deepClone(invoiceData));
    const [editOpen, setEditOpen] = useState(true);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [formErrors, setFormErrors]: any = useState({});

    function handleFormChange(event: any){
        const propName = event.target.name;
        const value = event.target.value;

        setEditedInvoice((prevState: any) => {
            return {...prevState, [propName]: value}
        })
    }

    function handleFormChange_sender(event: any){
        const propName = event.target.name;
        const value = event.target.value;
        let sender = deepClone(editedInvoice.senderAddress);
        sender[propName] = value;
        setEditedInvoice((prevState: any) => {
            return {...prevState, senderAddress: sender}
        })
    }

    function handleFormChange_client(event: any){
        const propName = event.target.name;
        const value = event.target.value;
        let client = deepClone(editedInvoice.clientAddress);
        client[propName] = value;
        setEditedInvoice((prevState: any) => {
            return {...prevState, clientAddress: client}
        })
    }

    function handleFormChange_items(event: any){
        const propName = event.target.name;
        let value = event.target.value;

        if (propName === "quantity"){
            let reg = /^[0-9]*$/
            if (!reg.test(value.toString())){
                return;
            }
        }
        let key: any = event.target.getAttribute("data-key");
        let items: any = deepClone(editedInvoice.items);

        items[key][propName] = value;
        items[key].total = (items[key].quantity * items[key].price);
        setEditedInvoice((prevState: any) => {
            return {...prevState, items: items}
        })
    }

    function handlePriceOut(event: any){
        const propName = event.target.name;
        if (propName !== "price"){
            console.log("Error! Price Management function called on non-price input")
        }
        let value = event.target.value;
        let reg = /\d+\.?\d*/
        //let reg = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/
            if (!reg.test(value.toString())){
                value = parseFloat("0").toFixed(2);
            } else {
                value = parseFloat(value).toFixed(2);
                console.log("updated value " + value)
            }

            let key: any = event.target.getAttribute("data-key");
            let items: any = deepClone(editedInvoice.items);

            items[key][propName] = value;
            items[key].total = (items[key].quantity * items[key].price);
            setEditedInvoice((prevState: any) => {
                return {...prevState, items: items}
            })
    }

    function handleQuantityOut(event: any){
        const propName = event.target.name;
        if (propName !== "quantity"){
            console.log("Error! Quantity check function called on non-price input")
        }
        let value = event.target.value;
        if (value === ""){
            value = 1;
        }

        let key: any = event.target.getAttribute("data-key");
            let items: any = deepClone(editedInvoice.items);

            items[key][propName] = value;
            items[key].total = (items[key].quantity * items[key].price);
            setEditedInvoice((prevState: any) => {
                return {...prevState, items: items}
            })
    }

    function submitForm(){
        let errors = validateForm();
        setFormErrors(deepClone(errors));
        if (Object.keys(errors).length === 0){
            console.log("Form validated successfully")
            updateInvoiceFull();
        } else {
            console.log("Error validating form")
        }
        
    }

    function validateForm(): any{
        //First, clear current errors to start a fresh validation;
        let errors: any = {};

        for (let property in editedInvoice){
            switch(property){
                //The following cases are generated or unavailable on the form, and thus can be skipped.
                case "id":
                    break;
                case "paymentDue":
                    break;
                case "status":
                    break;
                case "total":
                    break;

                case "createdAt":
                    if (!Date.parse(editedInvoice[property])){
                        errors[property] = "invalid";
                    } 
                    break;
                case "paymentTerms":
                    let validTerms = [1,7,14,30];
                    if (!validTerms.includes(editedInvoice[property])){
                        errors[property] = "invalid";
                    } 
                    break;

                case "clientEmail":
                    if (editedInvoice[property] == ""){
                        errors[property] = "empty";
                    }
                    let regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    if (!regEmail.test(editedInvoice[property])){
                        errors[property] = "invalid";
                    }
                    break;
                
                case "senderAddress":
                    for (let sa in editedInvoice[property]){
                        let reg = /^[a-zA-Z0-9_.-\s]*$/
                        if (!reg.test(editedInvoice[property][sa])){
                            errors[`sender${sa}`] = "invalid";
                        } else if (editedInvoice[property][sa] == ""){
                            errors[`sender${sa}`] = "empty";
                        }
                    }
                    break;

                case "clientAddress":
                    for (let sa in editedInvoice[property]){
                        let reg = /^[a-zA-Z0-9_.-\s]*$/
                        if (!reg.test(editedInvoice[property][sa])){
                            errors[`client${sa}`] = "invalid";
                        } else if (editedInvoice[property][sa] == ""){
                            errors[`client${sa}`] = "empty";
                        }
                        }
                    break;

                case "items":
                    for (let i=0;i<editedInvoice[property].length; i++){
                        for (let itemprop in editedInvoice[property][i]){
                            switch(itemprop){
                                case "name":
                                    if (editedInvoice[property][i][itemprop] == ""){
                                        errors[`item${i}${itemprop}`] = "empty"
                                        break;
                                    }
                                    let regName = /^[a-zA-Z0-9_.-\s]*$/
                                    if (!regName.test(editedInvoice[property][i][itemprop])){
                                        errors[`item${i}${itemprop}`] = "invalid"
                                    } 
                                    break;
                                case "quantity":
                                    if (editedInvoice[property][i][itemprop] == ""){
                                        errors[`item${i}${itemprop}`] = "empty"
                                        break;
                                    }
                                    let regQ = /^[0-9]*$/
                                    if (!regQ.test(editedInvoice[property][i][itemprop])){
                                        errors[`item${i}${itemprop}`] = "invalid"
                                    } 
                                    break;
                                case "price":
                                    if (editedInvoice[property][i][itemprop] == ""){
                                        errors[`item${i}${itemprop}`] = "empty"
                                        break;
                                    }
                                    let regP = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/
                                    if (!regP.test(editedInvoice[property][i][itemprop])){
                                        errors[`item${i}${itemprop}`] = "invalid"
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    break;

                default:
                    if (editedInvoice[property] == ""){
                        errors[property] = "empty"
                    }
                    let reg = /^[a-zA-Z0-9_.-\s]*$/
                    if (!reg.test(editedInvoice[property])){
                        errors[property] = "invalid"
                    } 
            }
        }

        return errors;
    }

    function updateInvoiceStatus(newStatus: string){
        setInvoiceStatus(newStatus)
        setInvoiceData((prevState: any) => {
            return {...prevState, status: newStatus}
        })
        props.updateInvoice(invoiceData);
    }

    function updateInvoiceFull(){
        console.log(JSON.stringify(editedInvoice))
        setInvoiceData(deepClone(editedInvoice));
        props.updateInvoice(invoiceData);
        setEditOpen(false);
        props.setModalOpen(false);
    }

    function addInvoiceItem(event: any){
        event.preventDefault();
        let items = deepClone(editedInvoice.items);
        items.push({
            "name": "",
            "quantity": 0,
            "price": 0.00,
            "total": 0.00
        })

        setEditedInvoice((prevState: any) => {
            return{...prevState, items: items}
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

    //This function should only be called if the user is closing the modal WITHOUT submitting the form
    function closeEditModal(){
        setEditedInvoice(deepClone(invoiceData));
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
                        <button className="invoice-goback" onClick={closeEditModal} style={{margin: "32px 0 24px 0"}}>
                            <img src={backarrow} alt="" style={{marginRight: "24px"}}></img>Go Back
                        </button>
                        <p className="form-header">Edit <span className="form-header--id">#</span>{invoiceData.id}</p>
                        <form>
                            <p className="form-subheader">Bill From</p>
                                <div className="form-flexbox">
                                    <label htmlFor="sender-address">Street Address</label>
                                    <input className={formErrors.senderstreet ? "formerror" : ""} type="text" name="street" id="sender-address" value={editedInvoice.senderAddress.street} onChange={handleFormChange_sender}></input>

                                    <div className="form-flexbox--row">
                                        <div>
                                            <label htmlFor="sender-city">City</label>
                                            <input className={formErrors.sendercity ? "formerror" : ""} type="text" name="city" id="sender-city" value={editedInvoice.senderAddress.city} onChange={handleFormChange_sender}></input>
                                        </div>
                                        <div style={{minWidth: "24px", maxWidth: "24px"}}></div>
                                        <div>
                                            <label htmlFor="sender-postcode">Post Code</label>
                                            <input className={formErrors.senderpostCode ? "formerror" : ""} type="text" name="postCode" id="sender-postcode" value={editedInvoice.senderAddress.postCode} onChange={handleFormChange_sender}></input>
                                        </div>
                                    </div>

                                    <label htmlFor="sender-country">Country</label>
                                    <input className={formErrors.sendercountry ? "formerror" : ""} type="text" name="country" id="sender-country" value={editedInvoice.senderAddress.country} onChange={handleFormChange_sender}></input>
                                </div>
                                

                            <p className="form-subheader">Bill To</p>
                            <div className="form-flexbox">
                                <label htmlFor="client-name">Client's Name</label>
                                <input className={formErrors.clientName ? "formerror" : ""} type="text" name="clientName" id="client-name" value={editedInvoice.clientName} onChange={handleFormChange}></input>

                                <label htmlFor="client-email">Client's Email</label>
                                <input className={formErrors.clientEmail ? "formerror" : ""} type="text" name="clientEmail" id="client-email" value={editedInvoice.clientEmail} onChange={handleFormChange}></input>

                                <label htmlFor="client-address">Street Address</label>
                                <input className={formErrors.clientstreet ? "formerror" : ""} type="text" name="street" id="client-address" value={editedInvoice.clientAddress.street} onChange={handleFormChange_client}></input>

                                <div className="form-flexbox--row">
                                    <div>
                                        <label htmlFor="client-city">City</label>
                                        <input className={formErrors.clientcity ? "formerror" : ""} type="text" name="city" id="client-city" value={editedInvoice.clientAddress.city} onChange={handleFormChange_client}></input>
                                    </div>
                                    <div style={{minWidth: "24px", maxWidth: "24px"}}></div>
                                    <div>
                                        <label htmlFor="client-postcode">Post Code</label>
                                        <input className={formErrors.clientpostCode ? "formerror" : ""} type="text" name="postCode" id="client-postcode" value={editedInvoice.clientAddress.postCode} onChange={handleFormChange_client}></input>
                                    </div>
                                </div>
                                                           
                                <label htmlFor="client-country">Country</label>
                                <input className={formErrors.clientcountry ? "formerror" : ""} type="text" name="country" id="client-country" value={editedInvoice.clientAddress.country} onChange={handleFormChange_client}></input>
                            </div>
                                
                            <div className="form-flexbox">
                                <label htmlFor="invoice-duedate">Invoice Date</label>
                                <input type="date" name="createdAt" id="invoice-duedate" value={editedInvoice.createdAt} onChange={handleFormChange}  disabled={invoiceStatus!=="draft"}></input>

                                <label htmlFor="payment-terms">Payment Terms</label>
                                <select className={formErrors.paymentTerms ? "formerror" : ""} name="paymentTerms" id="payment-terms" value={editedInvoice.paymentTerms} onChange={handleFormChange}>
                                    <option value={1}>Net 1 Days</option>
                                    <option value={7}>Net 7 Days</option>
                                    <option value={14}>Net 14 Days</option>
                                    <option value={30}>Net 30 Days</option>
                                </select>

                                <label htmlFor="project-description">Project Description</label>
                                <input className={formErrors.description ? "formerror" : ""} type="text" name="description" id="project-description" value={editedInvoice.description} onChange={handleFormChange}></input>
                            </div>
                            
                            <p className="form-itemlist">Item List</p>
                            <div className="form-flexbox">
                                {editedInvoice.items.map((item: any, key: any) => (
                                    <div key={key} style={{width: "100%"}}>
                                        <label className="form-item-label" htmlFor={`invoice-item-${item.name}`}>Item Name</label>
                                        <input className={formErrors[`item${key}name`] ? "formerror" : ""} type="text" name="name" id={`invoice-item-${item.name}`} data-key={key} value={item.name} onChange={handleFormChange_items}></input>

                                        <div className="form-flexbox--invoiceitems">
                                            <div>
                                                <label htmlFor={`quantity-${key+1}`}>Qty.</label>
                                                <input className={formErrors[`item${key}quantity`] ? "formerror" : ""} type="text" name="quantity" id={`quantity-${key+1}`} data-key={key} value={item.quantity} maxLength={2} size={1} onChange={handleFormChange_items} onBlur={handleQuantityOut}></input>
                                            </div>
                                            <div>
                                                <label htmlFor={`price-${key+1}`}>Price</label>
                                                <input className={formErrors[`item${key}price`] ? "formerror" : ""} type="text" name="price" id={`price-${key+1}`} data-key={key} value={item.price} maxLength={8} size={4} onChange={handleFormChange_items} onBlur={handlePriceOut}></input>
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
                                <button className="invoice-app--button button-edit-cancel" type="button" onClick={closeEditModal}>Cancel</button>
                                {invoiceStatus === "draft" && <button className="invoice-app--button button-savedraft" style={{marginLeft: "8px"}} type="button">Save as Draft</button>}
                                <button className="invoice-app--button button-savechanges" style={{marginLeft: "8px"}} type="button" onClick={submitForm}>Save Changes</button>
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