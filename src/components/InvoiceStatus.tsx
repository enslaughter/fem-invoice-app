

function InvoiceStatus(props: any){
    if (props.status==="paid"){
        return(
            <div className="invoice-status paid">
                <span style={{fontSize: "20px", marginRight: "8px"}}>•</span>Paid
            </div>
        )
    } else if (props.status==="pending"){
        return(
            <div className="invoice-status pending">
                <span style={{fontSize: "20px", marginRight: "8px"}}>•</span>Pending
            </div>
        )
    } else if (props.status==="draft"){
        return(
            <div className="invoice-status draft">
                <span style={{fontSize: "20px", marginRight: "8px"}}>•</span>Draft
            </div>
        )
    } else {
        return(
            <div>
                Error! Invalid invoice status submitted to component: {props.status}
            </div>
        )
    }
    
}

export default InvoiceStatus;