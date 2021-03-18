import NewInvoice from "./buttons/NewInvoice";

function InvoiceMenu(){
    return(
        <div className="invoice-menu">
            <div>
                <h1>Invoices</h1>
                <p>7 Invoices</p>
            </div>
            <div className="invoice-menu-right">
                <button>Filter</button>
                <NewInvoice />
            </div>
        </div>
    )
}

export default InvoiceMenu;