import NewInvoice from "./buttons/NewInvoice";

function InvoiceMenu(props: any){
    return(
        <div className="invoice-menu">
            <div>
                <h1>Invoices</h1>
                <p>{`${props.invoiceCount} Invoice${props.invoiceCount === 1 ? "" : "s"}`}</p>
            </div>
            <div className="invoice-menu-right">
                <button>Filter</button>
                <NewInvoice />
            </div>
        </div>
    )
}

export default InvoiceMenu;