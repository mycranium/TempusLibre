// Include this script in your page to generate a list of all elements
// and their ids and classes for elements that have either attribute.
//
// This adds a button at the bottom of the body element that, when clicked,
// will generate and download a tab-separated-values textfile that you
// can import into Google Sheets, MS Excel etc.
//
// The basic code to create and download the file came from this page:
// https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
//


function makeButton() {
  let btn = document.createElement('button');
  btn.setAttribute('id', 'lister');
  btn.setAttribute('type', 'button');
  let btnTxt = document.createTextNode('Download LocalStorage Data');
  btn.appendChild(btnTxt);
  document.body.appendChild(btn);
}


function hasPunches() {
  if (localStorage.hasOwnProperty('punches')) {
    let myPunches = {};
    myPunches.punches = JSON.parse(localStorage.getItem('punches'));
    myPunches.settings = JSON.parse(localStorage.getItem('settings'));
    return myPunches;
  }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const myBtn = makeButton();

document.getElementById("lister").addEventListener("click", function () {
  let text = hasPunches();
  let filename = "LocalStorage_Data.js";
  download(filename, text);
}, false);