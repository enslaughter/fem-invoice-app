import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.scss';
import invoiceData from "./data.json";

import Menubar from "./components/Menubar";
import InvoiceMenu from "./components/InvoiceMenu";
import ListInvoices from "./components/ListInvoices";
import Invoice from "./views/Invoice";
import Edit from "./views/Edit";

function App() {

  const [currentInvoiceData, setCurrentInvoiceData] = useState(invoiceData);
  const [modalOpen, setModalOpen] = useState(false);

  function lookupInvoice(invoiceid: string){
    for (let i=0;i<currentInvoiceData.length;i++){
      if (invoiceid === currentInvoiceData[i].id){
        return currentInvoiceData[i];
      } 
    }

    return null;
  }

  function updateInvoice(invoiceid: string, invoicedata: any){
    let invoices = [...currentInvoiceData];
    for (let i=0;i<invoices.length;i++){
      if (invoices[i].id === invoiceid){
        invoices[i] = {...invoicedata};
      }
    }

    setCurrentInvoiceData(invoices);
  }

  function deleteInvoice(invoiceid: string){
    let invoices = [];
    for (let i=0;i<currentInvoiceData.length; i++){
      if (currentInvoiceData[i].id!==invoiceid){
        invoices.push(currentInvoiceData[i]);
      }
    }
    setCurrentInvoiceData(invoices);
  }

  function addInvoice(newinvoicedata: any){
    newinvoicedata.id = generateInvoiceID();
    setCurrentInvoiceData(prevInvoices => {
      return [...prevInvoices, newinvoicedata];
    });
  }

  function generateInvoiceID(){
    let id = "";
    id += String.fromCharCode(65+Math.floor(Math.random() * 26));
    id += String.fromCharCode(65+Math.floor(Math.random() * 26));
    id += Math.floor(Math.random() * 10000).toString();
    console.log("Generated new ID :" + id);
    return id;
  }

  return (
    <div className="App" style={modalOpen ? {position: "fixed", width: "100%"} : {position: "static"}}>
      
      <Router>
      <Menubar />
        <Switch>
          <Route path="/" exact>
            <InvoiceMenu />
            <ListInvoices data={currentInvoiceData}/>
          </Route>
          <Route path="/invoice/:invoiceid" exact>
            <Invoice lookupInvoice={lookupInvoice} updateInvoice={updateInvoice} setModalOpen={setModalOpen}/>
          </Route>
          <Route path="/invoice/:invoiceid/edit">
            <Edit lookupInvoice={lookupInvoice}/>
          </Route>
          <Route>
              <h1>ERROR: Page not found!</h1>
          </Route>
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;
