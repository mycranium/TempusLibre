// JavaScript Document
// Set up interface elements
var infc = {
inBtn: document.querySelector('#punchIn'),
outBtn: document.querySelector('#punchOut'),
changeBtn: document.querySelector('#punchChange'),
assignBtn: document.querySelector('#assign'),
initBtn: document.querySelector('#init'),
saveBtn: document.querySelector('#save'),
displayBtn: document.querySelector('#display'),
hideDevBtn: document.querySelector('#hideDev'),
hideUsrBtn: document.querySelector('#hideUsr'),
clientTxt: document.querySelector('#client'),
projectTxt: document.querySelector('#project'),
jobTxt: document.querySelector('#job'),
inDtLi: document.querySelector('#inDateDisplay'),
inTmLi: document.querySelector('#inTimeDisplay'),
clientLi: document.querySelector('#clientDisplay'),
projectLi: document.querySelector('#projectDisplay'),
jobLi: document.querySelector('#jobDisplay'),
statusLi: document.querySelector('#statusDisplay'),
results: document.querySelector('#results'),
devBox: document.querySelector('#devContainer'),
devMsg: document.querySelector('#devMessage'),
userBox: document.querySelector('#userContainer'),
userMsg: document.querySelector('#userMessage'),
};

var devMsgOn = false;
var usrMsgOn = true;

document.body.onload = setupPage(); // Initialize page on load, without clearing localStorage

function setupPage() { //Set up the page based oon conditions
  var isStored = (localStorage.length > 0) ? true : false; // Check LocalStorage length.
  if (!isStored) { // If empty, alert no stored punches, freshSetup. punchArray =[]
    setDisplayMsg("user", "There are no stored punches.");
    setupInterface("ready", isStored, 0);
    updateStatus("ready");
  } else { //If true, retrieve and covert to punchArray.
    let workArray = getStoredPunches();
    let lastPunch = checkMultipleOpenPunch(workArray);//[workArray.length - 1];
    if (typeof lastPunch != 'object') {
      alert("dev", "The selected data is not an object.");
      return;
    } else {
      let pStat = lastPunch.status;
      if (pStat == "In") {
        setDisplayMsg("user", "You are punched IN");
        setupInterface("in", isStored, lastPunch);
        updateStatus("in", lastPunch);
      } else {
        setDisplayMsg("user", "You are punched OUT");
        setupInterface("out", isStored, lastPunch);
        updateStatus("out", lastPunch);
      }
    }    
  }
}

function setupInterface(state, stored, punch) {
  if (state == "ready" || state == "out") {
    infc.inBtn.disabled = false;
    infc.outBtn.disabled = true;
    infc.changeBtn.disabled = true;
    infc.displayBtn.disabled = (stored) ? false : true;
    infc.assignBtn.disabled = true;
    infc.clientTxt.disabled = true;
    infc.projectTxt.disabled = true;
    infc.jobTxt.disabled = true;
    infc.clientTxt.value = "";
    infc.projectTxt.value = "";
    infc.jobTxt.value = "";    
  } else if (state == "in") { // Enable/disable UI elements for punched IN condition
    infc.inBtn.disabled = true;
    infc.outBtn.disabled = false;
    infc.changeBtn.disabled = false;
    infc.displayBtn.disabled = false;
    let cliSet = getSetStat(punch.client);
    let projSet = getSetStat(punch.project);
    let jobSet = getSetStat(punch.job);
    if (!cliSet || !projSet || !jobSet) {
      infc.assignBtn.disabled = false; // If any job fields are unset, enable
    } else {
      infc.assignBtn.disabled = true;
    }
    infc.clientTxt.disabled = (!cliSet) ? false : true; // If not already entered by user, enable
    infc.projectTxt.disabled = (!projSet) ? false : true;
    infc.jobTxt.disabled = (!jobSet) ? false : true;
    infc.clientTxt.value = (!cliSet) ? "" : punch.client; // If user data is entered use it, else empty
    infc.projectTxt.value = (!projSet) ? "" : punch.project;
    infc.jobTxt.value = (!jobSet) ? "" : punch.job;    
    } else if (state == "assign") { // Enable/disable UI elements for punched IN condition
    infc.inBtn.disabled = true;
    infc.outBtn.disabled = false;
    infc.changeBtn.disabled = false;
    infc.displayBtn.disabled = false;
    let cliSet = getSetStat(punch.client);
    let projSet = getSetStat(punch.project);
    let jobSet = getSetStat(punch.job);
    if (!cliSet || !projSet || !jobSet) {
      infc.assignBtn.disabled = false; // If any job fields are unset, enable
    } else {
      infc.assignBtn.disabled = true;
    }
    infc.clientTxt.disabled = (!cliSet) ? false : true; // If not already entered by user, enable
    infc.projectTxt.disabled = (!projSet) ? false : true;
    infc.jobTxt.disabled = (!jobSet) ? false : true;
    infc.clientTxt.value = (!cliSet) ? "" : punch.client; // If user data is entered use it, else empty
    infc.projectTxt.value = (!projSet) ? "" : punch.project;
    infc.jobTxt.value = (!jobSet) ? "" : punch.job;    
    }
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
  infc.inDtLi.textContent = "In Date: " + inDtTxt; // Inject the text into the list items
  infc.inTmLi.textContent = "In Time: " + inTmTxt;
  infc.clientLi.textContent = "Client: " + cliTxt;
  infc.projectLi.textContent = "Project: " + projTxt;
  infc.jobLi.textContent = "Job: " + jobTxt;
  infc.statusLi.textContent = "Status: Punched " + statTxt;
}

function initializePage(caller) { // Clear fields, displays, reset punchArray & clear localStorage
  setupInterface("ready", false, 0);
  if (caller == "init") { // optionally clear localStorage, determined by caller value
    localStorage.clear();
  }
  updateStatus(caller); // Update status display
  infc.results.innerHTML = ""; // clear out results display
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
  this.client = "Unset";
  this.project = "Unset";
  this.job = "Unset";
  this.status = "Out";
}

function setDisplayMsg(audience, msg) { // Display messages to dev or user;
  if (devMsgOn && audience == "dev") {
      infc.devBox.style.display = "block";
      infc.devMsg.textContent = msg;
  } else if (usrMsgOn && audience == "user") {
      infc.userBox.style.display = "block";
      infc.userMsg.textContent = msg;
  }
}

function getStoredPunches() {
  let workArray = [];
  if (localStorage.length > 0) {
    workArray = JSON.parse(localStorage.getItem("punches"));
    } else {
    setDisplayMsg("dev", "There are no stored punches.");
    }
  return workArray;
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

function checkMultipleOpenPunch(array) {
  let result = array.filter(punch => punch.status == "In");
  if (result.length > 1) {
    setDisplayMsg("dev", "There are multiple open punches.");
    //return false;
    return result[0];
  } else {
    return result[0];
  }
}



infc.inBtn.addEventListener('click', function () { // Punch In button
  let caller = "in"; // Identifies source of function calls
  let myTime = Date.now();
  let punchArray = getStoredPunches();
  let punchId = punchArray.length; // Get an index number to assign this new punch
  punchArray[punchId] = new Punch(punchId, myTime); //Create new Punch object with index and in-time
  let thisPunch = punchArray[punchId]; // Assign the punch object to a variable
  thisPunch.status = "In"; // Set punch status
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface("in", true, thisPunch); // Enable/disable UI elements
  updateStatus(caller, thisPunch); //Update status display
});

infc.outBtn.addEventListener('click', function () { // Punch Out button
  let caller = "out"; // Identifies source of function calls
  let myTime = Date.now();
  let punchArray = getStoredPunches();
  let punchId = punchArray.length - 1; // Get the index number of the current punch
  let thisPunch = punchArray[punchId]; // Assign the punch object to a variable
  thisPunch.outTime = myTime; //Set the out-time for the punch
  thisPunch.status = "Out"; // Set status of punch to Out
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface(caller, true, thisPunch); // Enable/disable UI elements
  updateStatus(caller, thisPunch); // Update the status display
});

infc.changeBtn.addEventListener('click', function () { // Change Punch button (same as punch out and punch in in one action)
  let caller = "in"; // Identifies source of function calls
  let myTime = Date.now();
  let punchArray = getStoredPunches();
  let punchId = punchArray.length; // Get an index number to assign this new punch
  punchArray[punchId] = new Punch(punchId, myTime); //Create new Punch object with index and in-time
  let thisPunch = punchArray[punchId]; // Assign the punch object to a variable
  thisPunch.status = "In"; // Set status of the new punch to In
  let lastPunch = punchArray[punchId - 1]; // Get the index number of the previous punch
  lastPunch.outTime = myTime; //Set the out-time for the punch
  lastPunch.status = "Out"; // Set status of the previous punch to Out
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface(caller, true, thisPunch); // Enable/disable UI elements
  updateStatus(caller, thisPunch); // Update the status display
});

infc.assignBtn.addEventListener('click', function () { // Collect text input values and assign them to punch properties
  let caller = "assign";
  let punchArray = getStoredPunches();
  let punchId = punchArray.length;
  let thisPunch = punchArray[punchId - 1]; // Get the index number of the currently open punch
  thisPunch.client = infc.clientTxt.value; // Assign text values from inputs to object properties
  thisPunch.project = infc.projectTxt.value;
  thisPunch.job = infc.jobTxt.value;
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface(caller, true, thisPunch); // Enable/disable UI elements
  updateStatus(caller, thisPunch); // Update the status display
});

infc.initBtn.addEventListener('click', function () { // Initialize the page deleting localStorage and clearing all inputs
  let caller = "init"; // Identifies source of function calls
  initializePage(caller);
}); // Calls the initializer function

infc.displayBtn.addEventListener('click', function () { // Retrieve and display the localStorage data
  let gotPunches = getStoredPunches(); // Get stored punches as JSON object
  let punchHTML = "<p><span class='tblHeader'>Date In,In Time,Date Out,Out Time,Duration H:M, Duration Minutes,Client,Project,Job,Status</span><br>"; // Set variable to build HTML string
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
    punchHTML += inDate + "," + inTime + "," + outDate + "," + outTime + "," + duration[0] + "," + duration[1] + "," + punch.client + "," + punch.project + "," + punch.job + "," + punch.status + "<br>";
  }
  punchHTML += "</p>";
  infc.results.innerHTML = punchHTML; // Inject the HTML string into the document  
});

infc.hideDevBtn.addEventListener('click', function() {
  infc.devBox.style.display = "none";
  infc.devMsg.textContent = "";
});

infc.hideUsrBtn.addEventListener('click', function() {
  infc.userBox.style.display = "none";
  infc.userMsg.textContent = "";
});

