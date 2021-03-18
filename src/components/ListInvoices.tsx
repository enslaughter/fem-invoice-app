import InvoiceCard from "./InvoiceCard";

function ListInvoices(props: any){
    if (!props.data){
        return(
            <div>
                No data to display!
            </div>
        )
    } else {
        return(
            <div>
                {props.data.map((invoice: any, id: any) => (
                    <InvoiceCard data={invoice} key={id} />
                ))}
            </div>
        )
    }
    
}

export default ListInvoices