import InvoiceStatus from "./InvoiceStatus";
import {Link} from "react-router-dom";

function ListingCard(props: any){
    return(
        <Link to={`/invoice/${props.data.id}`}>
            <div className="invoice-card">
                <div className="invoice-card-column">
                    <span className="invoice-card--id"><span>#</span><span style={{color: "black", fontWeight: "bold"}}>{props.data.id}</span></span>
                    <div>
                        <p>Due <span className="invoice-card--duedate">{props.data.paymentDue}</span></p>
                        <p className="invoice-card--total">$ {props.data.total.toFixed(2)}</p>
                    </div>
                </div>
                <div className="invoice-card-column">
                    <p style={{textAlign: "right", margin: 0}}>{props.data.clientName}</p>
                    <InvoiceStatus status={props.data.status}/>
                </div>
             </div>
        </Link>
        
    )
}

export default ListingCard;