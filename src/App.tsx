import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useMediaPredicate } from "react-media-hook";
import "./App.scss";
import invoiceData from "./data.json";

import { deepClone, useWindowSize } from "./components/Functionality";

import Menubar from "./components/Menubar";
import InvoiceMenu from "./components/InvoiceMenu";
import ListInvoices from "./components/ListInvoices";
import AddInvoice from "./components/AddInvoice";
import Invoice from "./views/Invoice";
import Edit from "./views/Edit";

function App() {
  const [currentInvoiceData, setCurrentInvoiceData] = useState(invoiceData);
  const [filteredInvoices, setFilteredInvoices] = useState(invoiceData);
  const [theme, setTheme] = useState(
    useMediaPredicate("(prefers-color-scheme: dark)") ? "dark" : "light"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const windowSize: any = useWindowSize();
  const [filters, setFilters] = useState({
    draft: true,
    pending: true,
    paid: true,
  });
  const [addOpen, setAddOpen] = useState(false);

  function lookupInvoice(invoiceid: string) {
    for (let i = 0; i < currentInvoiceData.length; i++) {
      if (invoiceid === currentInvoiceData[i].id) {
        return currentInvoiceData[i];
      }
    }

    return null;
  }

  function updateInvoice(invoiceid: string, invoicedata: any) {
    console.log(JSON.stringify(invoicedata));
    let invoices = deepClone(currentInvoiceData);
    for (let i = 0; i < invoices.length; i++) {
      if (invoices[i].id === invoiceid) {
        invoices[i] = deepClone(invoicedata);
      }
    }

    setCurrentInvoiceData(invoices);
  }

  function deleteInvoice(invoiceid: string) {
    let invoices = [];
    for (let i = 0; i < currentInvoiceData.length; i++) {
      if (currentInvoiceData[i].id !== invoiceid) {
        invoices.push(deepClone(currentInvoiceData[i]));
      }
    }
    setCurrentInvoiceData(invoices);
  }

  function addInvoice(newinvoicedata: any) {
    newinvoicedata.id = generateInvoiceID();
    setCurrentInvoiceData((prevInvoices) => {
      return [...prevInvoices, newinvoicedata];
    });
    filterInvoices(filters);
  }

  function generateInvoiceID() {
    let id = "";
    id += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    id += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    id += Math.floor(Math.random() * 10000).toString();
    console.log("Generated new ID :" + id);
    currentInvoiceData.forEach((invoice) => {
      if (id === invoice.id) {
        id = generateInvoiceID();
      }
    });
    return id;
  }

  function filterInvoices(filterData: any) {
    let newFilteredInvoices: any = [];

    currentInvoiceData.forEach((invoice) => {
      for (let filter in filterData) {
        if (filterData[filter] === true) {
          if (invoice["status"] == filter) {
            newFilteredInvoices.push(deepClone(invoice));
          }
        }
      }
    });

    setFilteredInvoices(newFilteredInvoices);
  }

  function updateFilterData(newFilters: any) {
    setFilters(newFilters);
    filterInvoices(newFilters);
  }

  function closeAddModal() {
    setAddOpen(false);
  }

  function addInvoiceFull(newInvoice: any) {
    newInvoice.id = generateInvoiceID();
    addInvoice(newInvoice);
  }

  return (
    <div className="App" data-theme={theme}>
      {/* style={modalOpen ? {position: "fixed", width: "100%"} : {position: "static"}} */}

      <Router>
        <Menubar setTheme={setTheme} theme={theme} />
        <div
          className="app-body"
          style={
            windowSize.width > 620
              ? {
                  height: `${windowSize.height}px`,
                  width: `${windowSize.width - 72}px`,
                }
              : {
                  height: `${windowSize.height - 72}px`,
                  width: `${windowSize.width}px`,
                }
          }
        >
          <Switch>
            <Route path="/" exact>
              <InvoiceMenu
                invoiceCount={currentInvoiceData.length}
                updateFilterData={updateFilterData}
                setAddOpen={setAddOpen}
              />
              <ListInvoices data={filteredInvoices} />
              <AddInvoice
                editOpen={addOpen}
                closeEditModal={closeAddModal}
                invoiceData={invoiceData[0]}
                updateInvoiceFull={addInvoiceFull}
              />
            </Route>
            <Route path="/invoice/:invoiceid" exact>
              <Invoice
                lookupInvoice={lookupInvoice}
                updateInvoice={updateInvoice}
                deleteInvoice={deleteInvoice}
                setModalOpen={setModalOpen}
              />
            </Route>
            <Route path="/invoice/:invoiceid/edit">
              <Edit lookupInvoice={lookupInvoice} />
            </Route>
            <Route>
              <h1>ERROR: Page not found!</h1>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
