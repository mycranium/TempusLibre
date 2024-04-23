
function makeButton(kind) {
  console.log(kind);
  let btn = document.createElement('button');
  btn.setAttribute('id', kind.toLowerCase());
  btn.setAttribute('type', 'button');
  let btnTxt = document.createTextNode(kind + ' LocalStorage Data');
  btn.appendChild(btnTxt);
  document.body.appendChild(btn);
}


//function hasData(dType) {
//  if (localStorage.hasOwnProperty(dType)) {
//    let myPunches = {};
//    myPunches.punches = JSON.parse(localStorage.getItem('punches'));
//    myPunches.settings = JSON.parse(localStorage.getItem('settings'));
//    return myPunches;
//  }
//}

function setEvtHandler() {
  for (const [key, value] of Object.entries(myData)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

//function download(filename, text) {
//  var element = document.createElement('a');
//  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
//  element.setAttribute('download', filename);
//  element.style.display = 'none';
//  document.body.appendChild(element);
//  element.click();
//  document.body.removeChild(element);
//}
let myData = allData;
const setBtn = makeButton("Set");
//const getBtn = makeButton("Get");
//const clrBtn = makeButton("Clear");
//const clrBtn = makeButton("Download");

document.getElementById("set").addEventListener("click", setEvtHandler); 
//document.getElementById("get").addEventListener("click", getEvtHandler); 
//document.getElementById("clear").addEventListener("click", clearEvtHandler); 
//document.getElementById("download").addEventListener("click", downloadEvtHandler); 




//
//function downloadEvtHandler() {
//  let text = hasData('punches');
//  text += hasData('settings');
//  text += hasData('settings');
//  let filename = "LocalStorage_Data.js";
//  download(filename, text);
//}, false);