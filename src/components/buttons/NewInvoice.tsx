import iconplus from "../../assets/icon-plus.svg";
import { useWindowSize } from "../Functionality";

function NewInvoice(props: any) {
  let windowSize: any = useWindowSize();

  function handleNewInvoice() {
    props.setFiltersOpen(false);
    props.setAddOpen(true);
  }
  return (
    <button className="button-newinvoice" onClick={handleNewInvoice}>
      <div className="button-newinvoice--plus">
        <img src={iconplus} alt=""></img>
      </div>
      New {windowSize.width > 620 ? " Invoice" : ""}
    </button>
  );
}

export default NewInvoice;
