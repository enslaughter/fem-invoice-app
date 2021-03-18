

function MarkPaid(props: any){
    function handleClick(){
        props.updateInvoiceStatus("paid");
    }
    return(
        <button onClick={handleClick} className="invoice-app--button markpaid">
            Mark as Paid
        </button>
    )
}

export default MarkPaid;