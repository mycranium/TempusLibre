// JavaScript Document
var pv = {
  copyCont: document.getElementById("toCopy"),
  copyBtn: document.getElementById("copyToClip"),
  latest: document.getElementById("viewLatest"),
  all: document.getElementById("viewAll"),
  clear: document.getElementById("clearDisplay"),
  sortDate: document.getElementById("sortDate"),
  sortClient: document.getElementById("sortClient"),
  dateOrderDir: document.getElementById("dateOrder"),
  clientOrderDir: document.getElementById("clientOrder"),
  tableCont: document.getElementById("tableContainer"),
  listCont: document.getElementById("listContainer"),
  alertContainers: [document.getElementById("clipAlert"), document.getElementById("alertText")]
};

document.body.onload = setupViewPage();

// Set up page depending on localStorage status

function setupViewPage() { // THIS OAGE ONLY
  let hasData = localStorage.length;
  pv.sortDate.disabled = true;
  pv.sortClient.disabled = true;
  pv.copyBtn.disabled = true;
  if (hasData == 0) {
    if (msgObject.dev) displayAlert(msgObject["noPunchesMsg"], false, pv.alertContainers);
    clearDisplays();
    pv.latest.disabled = true;
    pv.all.disabled = true;
    return false;
  } else {
    pv.latest.disabled = false;
    pv.all.disabled = false;
  }
}

// GET AND FORMAT PUNCHES
function getStoredPunches() { // called from setupPage line 30
  if (localStorage.hasOwnProperty('punches')) { // See if localStorage has any punches
    let workArray = JSON.parse(localStorage.getItem('punches')); // If yes, get and parse
    if (typeof workArray == 'object' && workArray.length > 0) { // If parsed data is an object and there are more than 0 entries
      if (workArray[workArray.length - 1].hasOwnProperty('punchId')) { // If the latest object has a PunchId property
        return workArray; // Data is as expected. Retun the array of punch objects.
      } else { // If the object doesn't have the expected property
        if (msgObject.dev) displayAlert(msgObject["getStoredMsg"], false, pv.alertContainers);
        return false;
      }
    } else { // Data doesn't contain the correct data type
      if (msgObject.dev) displayAlert(msgObject["noValidMsg"], false, pv.alertContainers);
      return false;
    }
  }
  displayAlert(msgObject["noPunchesMsg"], false, pv.alertContainers);
  return false;
}

// THIS PAGE ONLY
function getAndShowPunches(field, range) { // Master function called by display buttons
  var sortField = (field == "time") ? pv.dateOrderDir : pv.clientOrderDir;
  var sortdir = (range == "latest") ? "Desc" : sortField.textContent;
  var myPunches = getSortedPunches(field, sortdir);
  if (!myPunches) return false; // Return false if getSortedPunches returns false
  displayPunches(myPunches, range); // Gather and format strings for display
  if (range != "latest") {
    sortField.textContent = (sortdir == "Asc") ? "Desc" : "Asc";
  }
}

// Gets array of punches sorted by specified sort direction
// THIS PAGE ONLY
function getSortedPunches(field, order) { // First function called by getAndShowPunches
  if (!getStoredPunches()) {
    clearDisplays();
    return false; // Flase if no stored punches
  }
  var myPunches = getStoredPunches();
  if (field == "client") {
    myPunches.sort(function (a, b) {
      let clientA = (order == "Asc") ? a.client.toUpperCase() : b.client.toUpperCase();
      let clientB = (order == "Asc") ? b.client.toUpperCase() : a.client.toUpperCase();
      if (clientA < clientB) return -1;
      if (clientA > clientB) return 1;
      return 0;
    });
  } else {
    myPunches.sort(function (a, b) {
      return (order == "Asc") ? a.inTime - b.inTime : b.inTime - a.inTime;
    });
  }
  return myPunches;
}

// THIS PAGE ONLY
function displayPunches(punches, range) {
  let punchTable = ""; // Set variable to build HTML string
  let punchList = "";
  let punchCSV = "In Date&#x0009;In Time&#x0009;Out Date&#x0009;Out Time&#x0009;Dur: H:M&#x0009;Dur: Min&#x0009;Client&#x0009;Project&#x0009;Job&#x0009;Status";
  if (range == "all") {
    punches.forEach(htmlStringify); // Iterate the array
    pv.sortDate.disabled = false;
    pv.sortClient.disabled = false;
  } else {
    let myPunch = punches[0];
    htmlStringify(myPunch);
    pv.sortDate.disabled = true;
    pv.sortClient.disabled = true;
  }

  function htmlStringify(punch) { // Function to build HTML string
    let inArray = getFormattedDate(punch.inTime);
    let inDate = inArray[0];
    let inTime = inArray[1]; // getSetStat();
    let outDate = punch.outTime;
    let outTime = punch.outTime;
    let duration = ["N/A", "N/A"];
    if (getSetStat(punch.outTime)) {
      let outArray = getFormattedDate(punch.outTime);
      outDate = outArray[0];
      outTime = outArray[1];
      duration = getDuration(punch.inTime, punch.outTime);
    }
    punchTable += "<tr>\n<td>" + inDate + "</td>\n<td>" + inTime + "</td>\n<td>" + outDate + "</td>\n<td>" + outTime + "</td>\n<td>" + duration[0] + "</td>\n<td>" + duration[1] + "</td>\n<td>" + punch.client + "</td>\n<td>" + punch.project + "</td>\n<td>" + punch.job + "</td>\n<td>" + punch.status + "</td>\n</tr>\n"
    punchList += "<ul class='punchPod'>\n<li class='col0'>" + inDate + "</li><li class='col1'>" + inTime + "</li><li class='col2'>" + outDate + "</li><li class='col3'>" + outTime + "</li><li class='col4'>" + duration[0] + "</li><li class='col5'>" + duration[1] + "</li><li class='col6'>" + punch.status + "</li><li class='col7'>" + punch.client + "</li><li class='col8'>" + punch.project + "</li><li class='col9'>" + punch.job + "</li>\n</ul>\n";
    punchCSV += "\n" + inDate + "&#x0009;" + inTime + "&#x0009;" + outDate + "&#x0009;" + outTime + "&#x0009;" + duration[0] + "&#x0009;" + duration[1] + "&#x0009;" + escapeCommas(punch.client) + "&#x0009;" + escapeCommas(punch.project) + "&#x0009;" + escapeCommas(punch.job) + "&#x0009;" + punch.status;
  }
  pv.tableCont.innerHTML = punchTable;
  pv.listCont.innerHTML = punchList;
  pv.copyCont.innerHTML = punchCSV;
}

function getSetStat(field) {
  if (field == "Unset" || field == "") {
    return false;
  }
  return true;
}

function escapeCommas(str) {
  if (str.indexOf(",") != -1) {
    let esStr = "\"" + str + "\"";
    return esStr;
  } else {
    return str;
  }

}

// MESSAGES // THIS PAGE ONLY
function clearDisplays() {
  pv.tableCont.innerHTML = "";
  pv.listCont.innerHTML = "";
  pv.copyCont.value = "";
}

pv.all.addEventListener('click', function () { // Retrieve and display the localStorage data
  getAndShowPunches("time", "all");
  pv.copyBtn.disabled = false;
  pv.all.disabled = true;
});

pv.latest.addEventListener('click', function () {
  getAndShowPunches("time", "latest");
  pv.copyBtn.disabled = false;
  pv.all.disabled = false;
});

pv.clear.addEventListener('click', function () {
  clearDisplays();
  pv.copyBtn.disabled = true;
  pv.all.disabled = false;
});

pv.sortDate.addEventListener('click', function () {
  getAndShowPunches("time", "all");
  pv.copyBtn.disabled = false;
});

pv.sortClient.addEventListener('click', function () {
  getAndShowPunches("client", "all");
  pv.copyBtn.disabled = false;
});

pv.copyBtn.addEventListener('click', function () {
  var el = pv.copyCont;
  navigator.clipboard.writeText(el.innerHTML).then(function () {
    displayAlert(msgObject["dataCopied"], true, pv.alertContainers);
  }, function () {
    displayAlert(msgObject["dataCopied"], false, pv.alertContainers);
  });
});
