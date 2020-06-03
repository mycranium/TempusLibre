// JavaScript Document
// Set up interface elements
var pio = {
  inBtn: document.getElementById('punchIn'),
  outBtn: document.getElementById('punchOut'),
  changeBtn: document.getElementById('punchChange'),
  assignBtn: document.getElementById('assign'),
  clientTxt: document.getElementById('client'),
  projectTxt: document.getElementById('project'),
  jobTxt: document.getElementById('job'),
  inDtLi: document.getElementById('inDateDisplay'),
  inTmLi: document.getElementById('inTimeDisplay'),
  clientLi: document.getElementById('clientDisplay'),
  projectLi: document.getElementById('projectDisplay'),
  jobLi: document.getElementById('jobDisplay'),
  statusLi: document.getElementById('statusDisplay'),
  results: document.getElementById('results'),
  alertContainers: [document.getElementById("clipAlert"), document.getElementById("alertText")]
};

document.body.onload = setupPunchPage(); // Initialize page on load, without clearing localStorage

function setupPunchPage() { //Set up the page based oon conditions
  var isStored = (localStorage.hasOwnProperty('punches')) ? true : false; // Check if LocalStorage has 'punches' item.
  if (!isStored) { // If empty, alert no stored punches, freshSetup. punchArray =[]
    if (msgObject.dev) displayAlert(msgObject["noPunchesMsg"], false, pio.alertContainers);
    setupInterface("ready", 0);
    updateStatus("ready");
  } else { //If true, retrieve and covert to punchArray.
    let workArray = getStoredPunches();
    if (!workArray) {
      if (msgObject.dev) displayAlert(msgObject["noValidMsg"], false, pio.alertContainers);
      return false;
    }
    let lastPunch = checkMultipleOpenPunch(workArray); //[workArray.length - 1];
    if (typeof lastPunch != 'object') {
      if (msgObject.dev) displayAlert(msgObject["wrongData"], false, pio.alertContainers);
      return;
    } else {
      let pStat = lastPunch.status;
      if (pStat == "In") {
        displayAlert(msgObject["punchStatus"], true, pio.alertContainers);
        setupInterface("in", lastPunch);
        updateStatus("in", lastPunch);
      } else {
        displayAlert(msgObject["punchStatus"], false, pio.alertContainers);
        setupInterface("out", lastPunch);
        updateStatus("out", lastPunch);
      }
    }
  }
}

function getStoredPunches() { // called from setupPage line 30
  if (localStorage.hasOwnProperty('punches')) { // See if localStorage has any punches
    let workArray = JSON.parse(localStorage.getItem('punches')); // If yes, get and parse
    if (typeof workArray == 'object' && workArray.length > 0) { // If parsed data is an object and there are more than 0 entries
      if (workArray[workArray.length - 1].hasOwnProperty('punchId')) { // If the latest object has a PunchId property
        return workArray; // Data is as expected. Retun the array of punch objects.
      } else { // If the object doesn't have the expected property
        if (msgObject.dev) displayAlert(msgObject["getStoredMsg"], false, pio.alertContainers);
        return false;
      }
    } else { // Data doesn't contain the correct data type
      if (msgObject.dev) displayAlert(msgObject["noValidMsg"], false, pio.alertContainers);
      return false;
    }
  }
  displayAlert(msgObject["noPunchesMsg"], false, pio.alertContainers);
  return false;
}

function setupInterface(state, punch) {
  if (state == "ready" || state == "out") {
    enableDisablePunchButtons("out");
    pio.assignBtn.disabled = true;
    pio.clientTxt.disabled = true;
    pio.projectTxt.disabled = true;
    pio.jobTxt.disabled = true;
    pio.clientTxt.value = "";
    pio.projectTxt.value = "";
    pio.jobTxt.value = "";
  } else if (state == "in" || state == "assign") { // Enable/disable UI elements for punched IN condition
    enableDisablePunchButtons("in");
    displayAssignFields(punch);
  }
}

function enableDisablePunchButtons(state) {
  pio.inBtn.disabled = (state == "in") ? true : false;
  pio.outBtn.disabled = (state == "in") ? false : true;
  pio.changeBtn.disabled = (state == "in") ? false : true;
}

function displayAssignFields(punch) {
  let cliSet = getSetStat(punch.client);
  let projSet = getSetStat(punch.project);
  let jobSet = getSetStat(punch.job);
  if (!cliSet || !projSet || !jobSet) {
    pio.assignBtn.disabled = false; // If any job fields are unset, enable
  } else {
    pio.assignBtn.disabled = true;
  }
  pio.clientTxt.disabled = (!cliSet) ? false : true; // If not already entered by user, enable
  pio.projectTxt.disabled = (!projSet) ? false : true;
  pio.jobTxt.disabled = (!jobSet) ? false : true;
  pio.clientTxt.value = (!cliSet) ? "" : punch.client; // If user data is entered use it, else empty
  pio.projectTxt.value = (!projSet) ? "" : punch.project;
  pio.jobTxt.value = (!jobSet) ? "" : punch.job;
}

function getSetStat(field) {
  if (field == "Unset" || field == "") {
    return false;
  }
  return true;
}

function Punch(punch_Id, inPunch) { // Definition for Punch object
  this.punchId = punch_Id;
  this.inTime = inPunch;
  this.outTime = "Unset";
  this.client = 'Unset';
  this.project = 'Unset';
  this.job = 'Unset';
  this.status = 'Out';
}

function updateStatus(state, punch) { // Update the status display
  let inDtTxt, inTmTxt, cliTxt, projTxt, jobTxt, statTxt; // Create empty variables
  if (state == "init" || state == "ready" || state == "out") { // if specified by state or if punchArray doesn't exist
    // initialize variables with default text
    inDtTxt = "N/A", inTmTxt = "N/A", cliTxt = "N/A", projTxt = "N/A", jobTxt = "N/A", statTxt = "Out";
  } else if (state == "in" || state == "change" || state == "assign") { // If punchArray is not undefined and if state isn't 'init'
    let inArray = getFormattedDate(punch.inTime);
    inDtTxt = inArray[0]; // set display text chunks to vales  from punch object
    inTmTxt = inArray[1];
    cliTxt = punch.client;
    projTxt = punch.project;
    jobTxt = punch.job;
    statTxt = punch.status;
  }
  pio.inDtLi.textContent = "In Date: " + inDtTxt; // Inject the text into the list items
  pio.inTmLi.textContent = "In Time: " + inTmTxt;
  pio.clientLi.textContent = "Client: " + cliTxt;
  pio.projectLi.textContent = "Project: " + projTxt;
  pio.jobLi.textContent = "Job: " + jobTxt;
  pio.statusLi.textContent = "Status: Punched " + statTxt;
}

function checkMultipleOpenPunch(array) {
  let result = array.filter(punch => punch.status == "In");
  if (result.length > 1) {
    if (msgObject.dev) displayAlert(msgObject["multiOpenMsg"], false, pio.alertContainers);
    return false;
  } else {
    return result[0];
  }
}

pio.inBtn.addEventListener('click', function () { // Punch In button
  let caller = "in"; // Identifies source of function calls
  let myTime = Date.now();
  let punchArray;
  if (!getStoredPunches()) {
    if (msgObject.dev) displayAlert(msgObject["noPunchesMsg"], false, pio.alertContainers);
    punchArray = [];
  } else {
    punchArray = getStoredPunches();
  }
  let punchId = punchArray.length; // Get an index number to assign this new punch
  punchArray[punchId] = new Punch(punchId, myTime); //Create new Punch object with index and in-time
  let thisPunch = punchArray[punchId]; // Assign the punch object to a variable
  thisPunch.status = "In"; // Set punch status
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface(caller, thisPunch); // Enable/disable UI elements
  updateStatus(caller, thisPunch); //Update status display
});

pio.outBtn.addEventListener('click', function () { // Punch Out button
  let caller = "out"; // Identifies source of function calls
  let myTime = Date.now();
  let punchArray;
  if (!getStoredPunches()) {
    if (msgObject.dev) displayAlert(msgObject["wrongStat"], false, pio.alertContainers);
    punchArray = [];
    return false;
  } else {
    punchArray = getStoredPunches();
  }
  let punchId = punchArray.length - 1; // Get the index number of the current punch
  let thisPunch = punchArray[punchId]; // Assign the punch object to a variable
  thisPunch.outTime = myTime; //Set the out-time for the punch
  thisPunch.status = "Out"; // Set status of punch to Out
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface(caller, thisPunch); // Enable/disable UI elements
  updateStatus(caller, thisPunch); // Update the status display
});

pio.changeBtn.addEventListener('click', function () { // Change Punch button (same as punch out and punch in in one action)
  let caller = "in"; // Identifies source of function calls
  let myTime = Date.now();
  let punchArray;
  if (!getStoredPunches()) {
    if (msgObject.dev) displayAlert(msgObject["wrongStat"], false, pio.alertContainers);
    punchArray = [];
    return false;
  } else {
    punchArray = getStoredPunches();
  }
  let punchId = punchArray.length; // Get an index number to assign this new punch
  punchArray[punchId] = new Punch(punchId, myTime); //Create new Punch object with index and in-time
  let thisPunch = punchArray[punchId]; // Assign the punch object to a variable
  thisPunch.status = "In"; // Set status of the new punch to In
  let lastPunch = punchArray[punchId - 1]; // Get the index number of the previous punch
  lastPunch.outTime = myTime; //Set the out-time for the punch
  lastPunch.status = "Out"; // Set status of the previous punch to Out
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface(caller, thisPunch); // Enable/disable UI elements
  updateStatus(caller, thisPunch); // Update the status display
});

pio.assignBtn.addEventListener('click', function () { // Collect text input values and assign them to punch properties
  let caller = "assign";
  let punchArray;
  if (!getStoredPunches()) {
    if (msgObject.dev) displayAlert(msgObject["wrongStat"], false, pio.alertContainers);
    punchArray = [];
  } else {
    punchArray = getStoredPunches();
  }
  let punchId = punchArray.length;
  let thisPunch = punchArray[punchId - 1]; // Get the index number of the currently open punch
  thisPunch.client = pio.clientTxt.value; // Assign text values from inputs to object properties
  thisPunch.project = pio.projectTxt.value;
  thisPunch.job = pio.jobTxt.value;
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface(caller, thisPunch); // Enable/disable UI elements
  updateStatus(caller, thisPunch); // Update the status display
});
