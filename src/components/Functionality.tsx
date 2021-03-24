// function validateForm(){
//     //First, clear current errors to start a fresh validation;
//     setFormErrors({});

//     for (let property in editedInvoice){
//         switch(property){
//             //The following cases are generated or unavailable on the form, and thus can be skipped.
//             case "id":
//                 break;
//             case "paymentDue":
//                 break;
//             case "status":
//                 break;
//             case "total":
//                 break;

//             case "createdAt":
//                 if (!Date.parse(editedInvoice[property])){
//                     setFormErrors((prevState: any) => {
//                         return {...prevState, property: "invalid"}
//                      })
//                 } 
//                 break;
//             case "paymentTerms":
//                 let validTerms = [1,7,14,30];
//                 if (!validTerms.includes(editedInvoice[property])){
//                     setFormErrors((prevState: any) => {
//                         return {...prevState, paymentTerms: "invalid"}
//                     })
//                 } 
//                 break;

//             case "clientEmail":
//                 let regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//                 if (!regEmail.test(editedInvoice[property])){
//                     setFormErrors((prevState: any) => {
//                         return {...prevState, clientEmail: "invalid"}
//                     })
//                 }
//                 break;
            
//             case "senderAddress":
//                 for (let sa in editedInvoice[property]){
//                     let reg = /^[a-zA-Z0-9_.-\s]*$/
//                     if (!reg.test(editedInvoice[property][sa])){
//                         setFormErrors((prevState: any) => {
//                             return {...prevState, [sa]: "invalid"}
//                         });
//                     } else if (editedInvoice[property][sa] == ""){
//                         setFormErrors((prevState: any) => {
//                             return {...prevState, [sa]: "empty"}
//                         });
//                     }
//                     }
                
//                 break;

//             case "clientAddress":
//                 for (let sa in editedInvoice[property]){
//                     let reg = /^[a-zA-Z0-9_.-\s]*$/
//                     if (!reg.test(editedInvoice[property][sa])){
//                         setFormErrors((prevState: any) => {
//                             return {...prevState, [sa]: "invalid"}
//                         });
//                     } else if (editedInvoice[property][sa] == ""){
//                         setFormErrors((prevState: any) => {
//                             return {...prevState, [sa]: "empty"}
//                         });
//                     }
//                     }
                
//                 break;

//             case "items":
//                 for (let i=0;i<editedInvoice[property].length; i++){
//                     for (let itemprop in editedInvoice[property][i]){
//                         switch(itemprop){
//                             case "name":
//                                 if (editedInvoice[property][i][itemprop] == ""){
//                                     setFormErrors((prevState: any) => {
//                                         return {...prevState, [`itemname${i}`]: "empty"}
//                                     })
//                                     break;
//                                 }
//                                 let regName = /^[a-zA-Z0-9_.-\s]*$/
//                                 if (!regName.test(editedInvoice[property][i][itemprop])){
//                                     setFormErrors((prevState: any) => {
//                                         return {...prevState, [`itemname${i}`]: "invalid"}
//                                     })
//                                 } 
//                                 break;
//                             case "quantity":
//                                 if (editedInvoice[property][i][itemprop] == ""){
//                                     setFormErrors((prevState: any) => {
//                                         return {...prevState, [`itemquantity${i}`]: "empty"}
//                                     })
//                                     break;
//                                 }
//                                 let regQ = /^[0-9]*$/
//                                 if (!regQ.test(editedInvoice[property][i][itemprop])){
//                                     setFormErrors((prevState: any) => {
//                                         return {...prevState, [`itemquantity${i}`]: "invalid"}
//                                     })
//                                 } 
//                                 break;
//                             case "price":
//                                 if (editedInvoice[property][i][itemprop] == ""){
//                                     setFormErrors((prevState: any) => {
//                                         return {...prevState, [`itemprice${i}`]: "empty"}
//                                     })
//                                     break;
//                                 }
//                                 let regP = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/
//                                 if (!regP.test(editedInvoice[property][i][itemprop])){
//                                     setFormErrors((prevState: any) => {
//                                         return {...prevState, [`itemprice${i}`]: "invalid"}
//                                     })
//                                 }
//                                 break;
//                             default:
//                                 break;
//                         }
//                     }
//                 }
//                 break;

//             default:
//                 if (editedInvoice[property] == ""){
//                     setFormErrors((prevState: any) => {
//                         return {...prevState, [property]: "empty"}
//                     })
//                 }
//                 let reg = /^[a-zA-Z0-9_.-\s]*$/
//                 if (!reg.test(editedInvoice[property])){
//                     setFormErrors((prevState: any) => {
//                         return {...prevState, [property]: "invalid"}
//                     })
//                 } 
//         }
//     }
// }

function deepClone(value: any): any{
    if (Array.isArray(value)){
        return value.map(deepClone);
    } else if ((typeof value) == "object"){
        let obj: any = {};
        for (let key in value){
            obj[key] = deepClone(value[key]);
        }
        return obj;
    } else {
        return value;
    }
}
export {deepClone};