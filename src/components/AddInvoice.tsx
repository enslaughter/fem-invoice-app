import {useState} from "react"

import backarrow from "../assets/icon-arrow-left.svg";
import icondelete from "../assets/icon-delete.svg"

import {deepClone, useWindowSize} from "../components/Functionality";

function AddInvoice(props: any){
//Props needed: editOpen, closeEditModal, updateInvoiceFull

    const [editedInvoice, setEditedInvoice] = useState(deepClone(props.invoiceData));
    const [formErrors, setFormErrors]: any = useState({});
    const [formErrorNotes, setFormErrorNotes]: any = useState({
        hasEmpty: false,
        hasInvalid: false,
        needsItems: false
    });

    function handleFormChange(event: any){
        const propName = event.target.name;
        let value = event.target.value;

        if (event.target.type === "date"){
            updateInvoiceDueDate(value, editedInvoice.paymentTerms);
        }

        if (event.target.id === "payment-terms"){
            value = parseInt(value);
            updateInvoiceDueDate(editedInvoice.createdAt, value);
        }

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

        let grandtotal = 0;
        //Update the grand total as well;
        for (let i=0;i<items.length;i++){
            grandtotal += items[i].total;
        }

        setEditedInvoice((prevState: any) => {
            return {...prevState, items: items, total: grandtotal}
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

            items[key][propName] = parseInt(value);
            items[key].total = (items[key].quantity * items[key].price);
            setEditedInvoice((prevState: any) => {
                return {...prevState, items: items}
            })
    }

    function updateInvoiceDueDate(iDate: any, iTerms: any){
        let createdms = new Date(iDate).getTime();
        let duedate = new Date(createdms + (iTerms * 86400000));
        let str = `${duedate.getFullYear()}-${duedate.getMonth() < 9 ? "0" : ""}${duedate.getMonth()+1}-${duedate.getDate() < 9 ? "0" : ""}${duedate.getDate()+1}`;
        setEditedInvoice((prevState: any) => {
            return {...prevState, paymentDue: str}
        })
    }

    function submitForm(){
        let errors = validateForm();
        setFormErrors(deepClone(errors));
        if (Object.keys(errors).length === 0){
            //console.log("Form validated successfully")
            props.updateInvoiceFull(editedInvoice);
        } else {
            //console.log("Error validating form");
            processErrorNotes(errors);
        }       
    }

    function submitDraft(){
        props.updateInvoiceFull(editedInvoice);
    }

    function processErrorNotes(errors: any){
        for (let property in errors){
            if (errors[property] === "empty"){
                setFormErrorNotes((prevState: any) => {
                    return {...prevState, hasEmpty: true}
                })
            }
            if (errors[property] === "invalid"){
                setFormErrorNotes((prevState: any) => {
                    return {...prevState, hasInvalid: true}
                })
            }
            if (errors.noitems){
                setFormErrorNotes((prevState: any) => {
                    return {...prevState, needsItems: true}
                })
            }
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
                    if (editedInvoice[property].length === 0){
                        errors["noitems"] = true;
                        break;
                    }
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

    function addInvoiceItem(event: any){
        event.preventDefault();
        let items = deepClone(editedInvoice.items);
        items.push({
            "name": "",
            "quantity": 0,
            "price": 0.00,
            "total": 0.00
        })

        setFormErrorNotes((prevState: any) => {
            return {...prevState, needsItems: false}
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

        if (items.length === 0){
            setFormErrorNotes((prevState: any) => {
                return {...prevState, needsItems: true}
            })
        }

        setEditedInvoice((prevState: any) => {
            return{...prevState, items: items}
        })
    }

    function handleCloseModal(){
        setEditedInvoice(deepClone(props.invoiceData));
        props.closeEditModal();
    }

    return(
        <div className="edit-invoice-container" style={props.editOpen ? {display: "block"} : {display: "none"}}>
                    <div className="edit-invoice-modal">
                        <button className="invoice-goback" onClick={handleCloseModal} style={{margin: "32px 0 24px 0"}}>
                            <img src={backarrow} alt="" style={{marginRight: "24px"}}></img>Go Back
                        </button>
                        <p className="form-header">Edit <span className="form-header--id">#</span>{editedInvoice.id}</p>
                        <form>
                            <p className="form-subheader">Bill From</p>
                                <div className="form-flexbox">
                                    <div className={formErrors.senderstreet ? "form-label labelerror" : "form-label"}>
                                        <label htmlFor="sender-address">Street Address</label>
                                        {formErrors.senderstreet && <p>{formErrors.senderstreet === "empty" ? "can't be empty" : "invalid input"}</p>}
                                    </div>     
                                    <input className={formErrors.senderstreet ? "formerror" : ""} type="text" name="street" id="sender-address" value={editedInvoice.senderAddress.street} onChange={handleFormChange_sender}></input>

                                    <div className="form-flexbox--row">
                                        <div>
                                            <div className={formErrors.sendercity ? "form-label labelerror" : "form-label"}>
                                                <label htmlFor="sender-city">City</label>
                                                {formErrors.sendercity && <p>{formErrors.sendercity === "empty" ? "can't be empty" : "invalid input"}</p>}
                                            </div>                                            
                                            <input className={formErrors.sendercity ? "formerror" : ""} type="text" name="city" id="sender-city" value={editedInvoice.senderAddress.city} onChange={handleFormChange_sender}></input>
                                        </div>
                                        <div style={{minWidth: "24px", maxWidth: "24px"}}></div>
                                        <div>
                                            <div className={formErrors.senderpostCode ? "form-label labelerror" : "form-label"}>
                                                <label htmlFor="sender-postcode">Post Code</label>
                                                {formErrors.senderpostCode && <p>{formErrors.senderpostCode === "empty" ? "can't be empty" : "invalid input"}</p>}
                                            </div>                                            
                                            <input className={formErrors.senderpostCode ? "formerror" : ""} type="text" name="postCode" id="sender-postcode" value={editedInvoice.senderAddress.postCode} onChange={handleFormChange_sender}></input>
                                        </div>
                                    </div>
                                    <div className={formErrors.sendercountry ? "form-label labelerror" : "form-label"}>
                                        <label htmlFor="sender-country">Country</label>
                                        {formErrors.sendercountry && <p>{formErrors.sendercountry === "empty" ? "can't be empty" : "invalid input"}</p>}
                                    </div> 
                                    <input className={formErrors.sendercountry ? "formerror" : ""} type="text" name="country" id="sender-country" value={editedInvoice.senderAddress.country} onChange={handleFormChange_sender}></input>
                                </div>
                                

                            <p className="form-subheader">Bill To</p>
                            <div className="form-flexbox">
                                <div className={formErrors.clientName ? "form-label labelerror" : "form-label"}>
                                    <label htmlFor="client-name">Client's Name</label>
                                    {formErrors.clientName && <p>{formErrors.clientName === "empty" ? "can't be empty" : "invalid input"}</p>}
                                </div> 
                                <input className={formErrors.clientName ? "formerror" : ""} type="text" name="clientName" id="client-name" value={editedInvoice.clientName} onChange={handleFormChange}></input>

                                <div className={formErrors.clientEmail ? "form-label labelerror" : "form-label"}>
                                    <label htmlFor="client-email">Client's Email</label>
                                    {formErrors.clientEmail && <p>{formErrors.clientEmail === "empty" ? "can't be empty" : "invalid input"}</p>}
                                </div>                                
                                <input className={formErrors.clientEmail ? "formerror" : ""} type="text" name="clientEmail" id="client-email" value={editedInvoice.clientEmail} onChange={handleFormChange}></input>

                                <div className={formErrors.clientstreet ? "form-label labelerror" : "form-label"}>
                                    <label htmlFor="client-address">Street Address</label>
                                    {formErrors.clientstreet && <p>{formErrors.clientstreet === "empty" ? "can't be empty" : "invalid input"}</p>}
                                </div>                               
                                <input className={formErrors.clientstreet ? "formerror" : ""} type="text" name="street" id="client-address" value={editedInvoice.clientAddress.street} onChange={handleFormChange_client}></input>

                                <div className="form-flexbox--row">
                                    <div>
                                        <div className={formErrors.clientcity ? "form-label labelerror" : "form-label"}>
                                            <label htmlFor="client-city">City</label>
                                            {formErrors.clientcity && <p>{formErrors.clientcity === "empty" ? "can't be empty" : "invalid input"}</p>}
                                        </div> 
                                        <input className={formErrors.clientcity ? "formerror" : ""} type="text" name="city" id="client-city" value={editedInvoice.clientAddress.city} onChange={handleFormChange_client}></input>
                                    </div>
                                    <div style={{minWidth: "24px", maxWidth: "24px"}}></div>
                                    <div>
                                        <div className={formErrors.clientpostCode ? "form-label labelerror" : "form-label"}>
                                            <label htmlFor="client-postcode">Post Code</label>
                                            {formErrors.clientpostCode && <p>{formErrors.clientpostCode === "empty" ? "can't be empty" : "invalid input"}</p>}
                                        </div> 
                                        <input className={formErrors.clientpostCode ? "formerror" : ""} type="text" name="postCode" id="client-postcode" value={editedInvoice.clientAddress.postCode} onChange={handleFormChange_client}></input>
                                    </div>
                                </div>

                                <div className={formErrors.clientcountry ? "form-label labelerror" : "form-label"}>
                                    <label htmlFor="client-country">Country</label>
                                    {formErrors.clientcountry && <p>{formErrors.clientcountry === "empty" ? "can't be empty" : "invalid input"}</p>}
                                </div>                                                    
                                <input className={formErrors.clientcountry ? "formerror" : ""} type="text" name="country" id="client-country" value={editedInvoice.clientAddress.country} onChange={handleFormChange_client}></input>
                            </div>
                                
                            <div className="form-flexbox">
                                <div className={formErrors.createdAt ? "form-label labelerror" : "form-label"}>
                                    <label htmlFor="invoice-duedate">Invoice Date</label>
                                    {formErrors.createdAt && <p>{formErrors.createdAt === "empty" ? "can't be empty" : "invalid input"}</p>}
                                </div>                                 
                                <input type="date" name="createdAt" id="invoice-duedate" value={editedInvoice.createdAt} onChange={handleFormChange}  disabled={editedInvoice.status!=="draft"}></input>

                                <div className={formErrors.paymentTerms ? "form-label labelerror" : "form-label"}>
                                    <label htmlFor="payment-terms">Payment Terms</label>
                                    {formErrors.paymentTerms && <p>{formErrors.paymentTerms === "empty" ? "can't be empty" : "invalid input"}</p>}
                                </div>                             
                                <select className={formErrors.paymentTerms ? "formerror" : ""} name="paymentTerms" id="payment-terms" value={editedInvoice.paymentTerms} onChange={handleFormChange}>
                                    <option value={1}>Net 1 Days</option>
                                    <option value={7}>Net 7 Days</option>
                                    <option value={14}>Net 14 Days</option>
                                    <option value={30}>Net 30 Days</option>
                                </select>

                                <div className={formErrors.description ? "form-label labelerror" : "form-label"}>
                                    <label htmlFor="project-description">Project Description</label>
                                    {formErrors.description && <p>{formErrors.description === "empty" ? "can't be empty" : "invalid input"}</p>}
                                </div>                              
                                <input className={formErrors.description ? "formerror" : ""} type="text" name="description" id="project-description" value={editedInvoice.description} onChange={handleFormChange}></input>
                            </div>
                            
                            <p className="form-itemlist">Item List</p>
                            <div className="form-flexbox">
                                {editedInvoice.items.map((item: any, key: any) => (
                                    <div key={key} style={{width: "100%"}}>
                                        <div className={formErrors[`item${key}name`] ? "form-label labelerror" : "form-label"}>
                                            <label className="form-item-label" htmlFor={`invoice-item-${item.name}`}>Item Name</label>
                                            {formErrors[`item${key}name`] && <p>{formErrors[`item${key}name`] === "empty" ? "can't be empty" : "invalid input"}</p>}
                                        </div>                                       
                                        <input className={formErrors[`item${key}name`] ? "formerror" : ""} type="text" name="name" id={`invoice-item-${item.name}`} data-key={key} value={item.name} onChange={handleFormChange_items}></input>

                                        <div className="form-flexbox--invoiceitems">
                                            <div>
                                                <label htmlFor={`quantity-${key+1}`} style={formErrors[`item${key}quantity`] && {color: "hsl(0, 80%, 63%)"}}>Qty.</label>
                                                <input className={formErrors[`item${key}quantity`] ? "formerror" : ""} type="text" name="quantity" id={`quantity-${key+1}`} data-key={key} value={item.quantity} maxLength={2} size={1} onChange={handleFormChange_items} onBlur={handleQuantityOut}></input>
                                            </div>
                                            <div>
                                                <label htmlFor={`price-${key+1}`} style={formErrors[`item${key}price`] && {color: "hsl(0, 80%, 63%)"}}>Price</label>
                                                <input className={formErrors[`item${key}price`] ? "formerror" : ""} type="text" name="price" id={`price-${key+1}`} data-key={key} value={typeof item.price === "number" ? item.price.toFixed(2) : item.price} maxLength={8} size={item.price.toString().length < 3 ? 3 : item.price.toString().length} onChange={handleFormChange_items} onBlur={handlePriceOut}></input>
                                            </div>
                                            <div>
                                                <label htmlFor={`total-${key+1}`}>Total</label>
                                                <input className="form-item-total" type="text" name="total" id={`total-${key+1}`} data-key={key} value={item.total.toFixed(2)} size={item.total.toFixed(2).toString().length} onChange={handleFormChange} disabled></input>
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

                            <div className="form-errors-footer">
                                {formErrorNotes.hasEmpty && <p>- All fields must be added</p>}
                                {formErrorNotes.hasInvalid && <p>- All fields must be valid</p>}
                                {formErrorNotes.needsItems && <p>- An item must be added</p>}
                            </div>
                            
                            <div className="edit-modal-buttons">
                                <button className="invoice-app--button button-edit-cancel" type="button" onClick={handleCloseModal}>Cancel</button>
                                {editedInvoice.status === "draft" && <button className="invoice-app--button button-savedraft" style={{marginLeft: "8px"}} type="button" onClick={submitDraft}>Save as Draft</button>}
                                <button className="invoice-app--button button-savechanges" style={{marginLeft: "8px"}} type="button" onClick={submitForm}>Save Changes</button>
                            </div>
                        </form>
                        
                    </div>
                </div>
    )
}

export default AddInvoice;