// JavaScript Document
var ifc = {
  latest: document.querySelector("#viewLatest"),
  all: document.querySelector("#viewAll"),
  clear: document.querySelector("#clearDisplay"),
  sortDate: document.querySelector("#sortDate"),
  sortClient: document.querySelector("#sortClient"),
  dateOrderDir: document.querySelector("#dateOrder"),
  clientOrderDir: document.querySelector("#clientOrder"),
  tableCont: document.querySelector("#tableContainer"),
  listCont: document.querySelector("#listContainer"),
  devBox: document.querySelector('#devContainer'),
  devMsg: document.querySelector('#devMessage'),
  userBox: document.querySelector('#userContainer'),
  userMsg: document.querySelector('#userMessage'),
}

var devMsgOn = false;
var usrMsgOn = true;

function getStoredPunches() {
  let workArray = [];
  if (localStorage.length > 0) {
    workArray = JSON.parse(localStorage.getItem("punches"));
    } else {
    setDisplayMsg("dev", "There are no stored punches.");
    }
  return workArray;
}

function setDisplayMsg(audience, msg) { // Display messages to dev or user;
  if (devMsgOn && audience == "dev") {
      ifc.devBox.style.display = "block";
      ifc.devMsg.textContent = msg;
  } else if (usrMsgOn && audience == "user") {
      ifc.userBox.style.display = "block";
      ifc.userMsg.textContent = msg;
  }
}

function getFormattedDate(timeMS) {
  let myDate = new Date(timeMS);
  let dateString = "";
  let timeString = "";
  let hourSpace = "";
  let minSpace = "";
  let outArray = [];
  dateString += myDate.getFullYear() + "-";
  let myMonth = myDate.getMonth() + 1;
  if (myMonth < 10) {
    dateString += "0";
  }
  dateString += myMonth + "-";
  let myDay = myDate.getDate();
  if (myDay < 10) {
    dateString += "0";
  }
  dateString += myDay;
  let hours = myDate.getHours();
  if (hours < 10) {
    hourSpace = "0";
  }
  timeString += hourSpace + hours + ":";
  let minutes = myDate.getMinutes();
  if (minutes < 10) {
    minSpace = "0";
  }
  timeString += minSpace + minutes;
  outArray.push(dateString, timeString);
  return outArray;
}

function getSetStat(field) {
  if (field == "Unset" || field == "") {
    return false;
  }
  return true;
}

function getDuration(inTimeMS, outTimeMS) {
  let hourSpace = "";
  let minSpace = "";
  let durMS = outTimeMS - inTimeMS;
  let seconds = durMS / 1000;
  let minutes = Math.round(seconds / 60);
  let hours = Math.floor(minutes / 60);
  if (hours < 10) {
    hourSpace = "0";
  }
  let leftMinutes = minutes % 60;
  if (leftMinutes < 10) {
    minSpace = "0";
  }
  let outString = hourSpace + hours + ":" + minSpace + leftMinutes;
  let outArray = [outString, minutes];
  return outArray;
}

ifc.all.addEventListener('click', function () { // Retrieve and display the localStorage data
  let gotPunches = getStoredPunches(); // Get stored punches as JSON object
  let punchTable = ""; // Set variable to build HTML string
  let punchList = "";
  gotPunches.forEach(htmlStringify); // Iterate the array
  function htmlStringify(punch) { // Function to build HTML string
    let inArray = getFormattedDate(punch.inTime);
    let inDate = inArray[0];
    let inTime = inArray[1];// getSetStat();
    let outDate = punch.outTime;
    let outTime = punch.outTime;
    let duration = ["N/A", "N/A"];
    if (getSetStat(punch.outTime)){
      let outArray = getFormattedDate(punch.outTime);      
      outDate = outArray[0];
      outTime = outArray[1];
      duration = getDuration(punch.inTime, punch.outTime);
    }
    punchTable += "<tr>\n<td>" + inDate + "</td>\n<td>" + inTime + "</td>\n<td>" + outDate + "</td>\n<td>" + outTime + "</td>\n<td>" + duration[0] + "</td>\n<td>" + duration[1] + "</td>\n<td>" + punch.client + "</td>\n<td>" + punch.project + "</td>\n<td>" + punch.job + "</td>\n<td>" + punch.status + "</td>\n</tr>\n"
    punchList += "<ul class='punchPod'>\n<li class='col0'>" + inDate + "</li><li class='col1'>" + inTime + "</li><li class='col2'>" + outDate + "</li><li class='col3'>" + outTime + "</li><li class='col4'>" + duration[0] + "</li><li class='col5'>" + duration[1] + "</li><li class='col6'>" + punch.status + "</li><li class='col7'>" + punch.client + "</li><li class='col8'>" + punch.project + "</li><li class='col9'>" + punch.job + "</li>\n</ul>\n";
  }
  //punchTable
  ifc.tableCont.innerHTML = punchTable;
  ifc.listCont.innerHTML = punchList;
});

ifc.clear.addEventListener('click', function () {
  ifc.tableCont.innerHTML = "";
  ifc.listCont.innerHTML = "";
});