import {useParams} from "react-router-dom";

function Edit(props: any){
    interface ParamTypes {
        invoiceid: string
    }

    let grabbedID = useParams<ParamTypes>();

    let invoiceData = props.lookupInvoice(grabbedID.invoiceid);
    console.log(invoiceData);

    return(
        <div>
            <h1>Editing Invoice {invoiceData.id}</h1>
        </div>
    )
}

export default Edit