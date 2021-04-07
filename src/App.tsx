import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.scss';
import invoiceData from "./data.json";

import {deepClone, useWindowSize} from "./components/Functionality";

import Menubar from "./components/Menubar";
import InvoiceMenu from "./components/InvoiceMenu";
import ListInvoices from "./components/ListInvoices";
import Invoice from "./views/Invoice";
import Edit from "./views/Edit";

function App() {

  const [currentInvoiceData, setCurrentInvoiceData] = useState(invoiceData);
  const [modalOpen, setModalOpen] = useState(false);
  const windowSize: any = useWindowSize();

  function lookupInvoice(invoiceid: string){
    for (let i=0;i<currentInvoiceData.length;i++){
      if (invoiceid === currentInvoiceData[i].id){
        return currentInvoiceData[i];
      } 
    }

    return null;
  }

  function updateInvoice(invoiceid: string, invoicedata: any){
    console.log(JSON.stringify(invoicedata))
    let invoices = deepClone(currentInvoiceData);
    for (let i=0;i<invoices.length;i++){
      if (invoices[i].id === invoiceid){
        invoices[i] = deepClone(invoicedata);
      }
    }

    setCurrentInvoiceData(invoices);
  }

  function deleteInvoice(invoiceid: string){
    let invoices = [];
    for (let i=0;i<currentInvoiceData.length; i++){
      if (currentInvoiceData[i].id!==invoiceid){
        invoices.push(deepClone(currentInvoiceData[i]));
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
    <div className="App">
    {/* style={modalOpen ? {position: "fixed", width: "100%"} : {position: "static"}} */}
      
      <Router>
      <Menubar />
      <div className="app-body" style={windowSize.width > 620 ? {height: `${windowSize.height}px`, width: `${windowSize.width-72}px`} : {height: `${windowSize.height - 72}px`, width: `${windowSize.width}px`}}>
        <Switch>
            <Route path="/" exact>
              <InvoiceMenu invoiceCount={currentInvoiceData.length}/>
              <ListInvoices data={currentInvoiceData}/>
            </Route>
            <Route path="/invoice/:invoiceid" exact>
              <Invoice lookupInvoice={lookupInvoice} updateInvoice={updateInvoice} deleteInvoice={deleteInvoice} setModalOpen={setModalOpen}/>
            </Route>
            <Route path="/invoice/:invoiceid/edit">
              <Edit lookupInvoice={lookupInvoice}/>
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
