import {Link} from "react-router-dom";

function EditInvoice(props: any){
    return(
        <Link to={`/invoice/${props.id}/edit`}>
            <button className="invoice-app--button edit">
                Edit
            </button>
        </Link>
        
    )
}

export default EditInvoice;