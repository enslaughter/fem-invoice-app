import iconplus from "../../assets/icon-plus.svg";

function NewInvoice(){
    return(
        <button className="button-newinvoice">
            <div className="button-newinvoice--plus">
                <img src={iconplus} alt=""></img>
            </div>
            New
        </button>
    )
}

export default NewInvoice;