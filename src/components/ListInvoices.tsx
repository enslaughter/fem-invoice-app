import InvoiceCard from "./InvoiceCard";
import NoInvoices from "../assets/illustration-empty.svg";

function ListInvoices(props: any) {
  if (!props.data) {
    return <div>No data to display!</div>;
  } else if (Object.keys(props.data).length === 0) {
    return (
      <div className="noinvoice-container">
        <img src={NoInvoices} alt=""></img>
        <div>
          <h3>There is nothing here</h3>
          <p>
            Create an invoice by clicking on the{" "}
            <span style={{ fontWeight: 700 }}>New Invoice</span> button and get
            started
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="invoice-list-container">
        {props.data.map((invoice: any, id: any) => (
          <InvoiceCard data={invoice} key={id} />
        ))}
      </div>
    );
  }
}

export default ListInvoices;
