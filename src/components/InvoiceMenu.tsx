import {useState} from 'react';
import {deepClone, useWindowSize} from './Functionality';

import NewInvoice from "./buttons/NewInvoice";
import arrowdown from "../assets/icon-arrow-down.svg";

function InvoiceMenu(props: any){
    let windowSize: any = useWindowSize();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState({
        draft: true,
        pending: true,
        paid: true
    }
    )

    function toggleFiltersOpen(){
        if (filtersOpen){
            setFiltersOpen(false);
        } else {
            setFiltersOpen(true);
        }
    }

    function handleFilterChange(event: any){
        let checked: boolean = event.target.checked;
        let name: string = event.target.name;
        let newFilters = deepClone(filters);
        newFilters[name] = checked;
        setFilters(newFilters);
        props.updateFilterData(newFilters);
    }   

    function invoiceNumberText(){
        if (windowSize.width < 620){
            return `${props.invoiceCount} Invoice${props.invoiceCount === 1 ? "" : "s"}`;
        } else {
            if (props.invoiceCount === 0) {
                return "No invoices";
            }
            if (props.invoiceCount === 1){
                return "There is 1 total invoice";
            }
            return `There are ${props.invoiceCount} total invoices`;
        }
    }

    return(
        <div className="invoice-menu">
            <div className="invoice-menu-left">
                <h1>Invoices</h1>
                <p>{`${invoiceNumberText()}`}</p>
            </div>
            <div className="invoice-menu-right">
                <div className="invoice-menu-filters">
                    <button onClick={toggleFiltersOpen}>Filter {windowSize.width > 620 ? "by status" : ""}<img className="downarrow" src={arrowdown} style={filtersOpen ? {transform: "rotate(180deg)"} : {}} alt=""></img></button>
                    <div className="invoice-menu-filters-popup" style={filtersOpen ? {visibility: "visible"} : {visibility: "hidden"}}>
                        <div className="filter-option">
                            <input type="checkbox" id="draft" name="draft" onChange={handleFilterChange} checked={filters.draft}></input>
                            <label htmlFor="draft">Draft</label>
                        </div>
                        <div className="filter-option" style={{margin: "16px 0px 16px 0px"}}>
                            <input type="checkbox" id="pending" name="pending" onChange={handleFilterChange} checked={filters.pending}></input>
                            <label htmlFor="pending">Pending</label>
                        </div>
                        <div className="filter-option">
                            <input type="checkbox" id="paid" name="paid" onChange={handleFilterChange} checked={filters.paid}></input>
                            <label htmlFor="paid">Paid</label>
                        </div>
                    </div>
                </div>          
                <NewInvoice />
            </div>
        </div>
    )
}

export default InvoiceMenu;