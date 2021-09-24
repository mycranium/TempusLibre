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
  inTmLi: document.getElementById('inTimeDisplay'),
  clientLi: document.getElementById('clientDisplay'),
  projectLi: document.getElementById('projectDisplay'),
  jobLi: document.getElementById('jobDisplay'),
  statusH: document.getElementById('statusH'),
  results: document.getElementById('results'),
  alertContainers: [document.getElementById("clipAlert"), document.getElementById("alertText")]
};

document.body.onload = setupPunchPage(); // Initialize page on load, without clearing localStorage

function setupPunchPage() { //Set up the page based oon conditions
  if (!data.hasPunches()) { // If empty, alert no stored punches, freshSetup. punchArray =[]
    if (msgObject.dev) displayAlert(msgObject["noPunchesMsg"], false, pio.alertContainers);
    setupInterface("ready");
    updateStatus("ready");
  } else { //If there are stored punches, retrieve and covert to punchArray.
    let lastPunch = data.lastPunch(); // Get newest punch];
    if (!lastPunch) {
      if (msgObject.dev) displayAlert(msgObject["wrongData"], false, pio.alertContainers);
      return false;
    } else {
      let pStat = lastPunch.status;
      if (pStat == "In") {
//        displayAlert(msgObject["punchStatus"], true, pio.alertContainers);
        setupInterface("in");
        updateStatus("in", lastPunch);
      } else {
//        displayAlert(msgObject["punchStatus"], false, pio.alertContainers);
        setupInterface("out");
        updateStatus("out", lastPunch);
      }
    }
  }
}

function setupInterface(state) {
  //  console.log("SetupInterface, Status = " + punch.status);
  if (state == "ready" || state == "out") {
    enableDisablePunchButtons("out");
    pio.assignBtn.disabled = true;
    pio.assignBtn.style.cursor = "not-allowed";
    pio.clientTxt.disabled = true;
    pio.projectTxt.disabled = true;
    pio.jobTxt.disabled = true;
    pio.clientTxt.value = "";
    pio.projectTxt.value = "";
    pio.jobTxt.value = "";
    enableDisablePunchButtons("out");
  } else if (state == "in" || state == "assign") { // Enable/disable UI elements for punched IN condition
    enableDisablePunchButtons("in");
    displayAssignFields(data.lastPunch());
  }
}

function enableDisablePunchButtons(state) {
  pio.inBtn.disabled = (state == "in") ? true : false;
  pio.inBtn.style.cursor = (state == "in") ? "not-allowed" : "pointer";
  pio.outBtn.disabled = (state == "in") ? false : true;
  pio.outBtn.style.cursor = (state == "in") ? "pointer" : "not-allowed";
  pio.changeBtn.disabled = (state == "in") ? false : true;
  pio.changeBtn.style.cursor = (state == "in") ? "pointer" : "not-allowed";
}

function displayAssignFields(punch) {
  let cliSet = getSetStat(punch.client);
  let projSet = getSetStat(punch.project);
  let jobSet = getSetStat(punch.job);
  if (!cliSet || !projSet || !jobSet) {
    pio.assignBtn.disabled = false; // If any job fields are unset, enable
    pio.assignBtn.style.cursor = "cursor";
  } else {
    pio.assignBtn.disabled = true;
    pio.assignBtn.style.cursor = "not-allowed";
  }
  pio.clientTxt.disabled = (!cliSet) ? false : true; // If not already entered by user, enable
  pio.projectTxt.disabled = (!projSet) ? false : true;
  pio.jobTxt.disabled = (!jobSet) ? false : true;
  pio.clientTxt.value = (!cliSet) ? "" : punch.client; // If user data is entered use it, else empty
  pio.projectTxt.value = (!projSet) ? "" : punch.project;
  pio.jobTxt.value = (!jobSet) ? "" : punch.job;
}

function Punch(punch_Id, inPunch) { // Definition for Punch object
  this.punchId = punch_Id;
  this.inTime = inPunch;
  this.outTime = "Unassigned";
  this.client = 'Unassigned';
  this.project = 'Unassigned';
  this.job = 'Unassigned';
  this.status = 'Out';
}

function updateStatus(state) {
  let punch = data.lastPunch();
  if (state == "in" || state == "change" || state == "assign") {
    let inArray = getFormattedDate(punch.inTime);
    pio.statusH.textContent = "You punched IN at " + inArray[1] + " on " + inArray[0];
    pio.clientLi.textContent = "Client: " + punch.client;
    pio.projectLi.textContent = "Project: " + punch.project;
    pio.jobLi.textContent = "Job: " + punch.job;
  } else if (state == "ready" || state == "out") {
    pio.statusH.textContent = "You are punched OUT";
    pio.clientLi.textContent = "Client: --";
    pio.projectLi.textContent = "Project: --";
    pio.jobLi.textContent = "Job: --";
  }
}

pio.inBtn.addEventListener('click', function () { // Punch In button
  let caller = "in"; // Identifies source of function calls
  let myTime = Date.now();
  let punchArray;
  if (!data.hasPunches()) {
    if (msgObject.dev) displayAlert(msgObject["noPunchesMsg"], false, pio.alertContainers);
    punchArray = [];
  } else {
    punchArray = data.getPunches("time", "Asc");
  }
  let punchId = punchArray.length; // Get an index number to assign this new punch
  let thisPunch = new Punch(punchId, myTime);
  thisPunch.status = "In";
  punchArray[punchId] = thisPunch; //Create new Punch object with index and in-time
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  pio.inBtn.classList.add('pressedChange');
  pio.inBtn.addEventListener('animationend', function press() {
    pio.inBtn.classList.remove('pressedChange');
    pio.inBtn.removeEventListener('animationend', press, false);
    setupInterface(caller); // Enable/disable UI elements
    updateStatus(caller); //Update status display
  });
});

pio.outBtn.addEventListener('click', function () { // Punch Out button  pio.changeBtn.classList.add('pressedChange');
  let caller = "out"; // Identifies source of function calls
  let myTime = Date.now();
  let punchArray;
  if (!data.hasPunches()) {
    if (msgObject.dev) displayAlert(msgObject["wrongStat"], false, pio.alertContainers);
    punchArray = [];
    return false;
  } else {
    punchArray = data.getPunches();
  }
    let thisPunch = punchArray[0]; // Assign the punch object to a variable
    thisPunch.outTime = myTime; //Set the out-time for the punch
    thisPunch.status = "Out"; // Set status of punch to Out
    localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
    pio.outBtn.classList.add('pressedChange');
    pio.outBtn.addEventListener('animationend', function press() {
      pio.outBtn.classList.remove('pressedChange');
      pio.outBtn.removeEventListener('animationend', press, false);
      setupInterface(caller); // Enable/disable UI elements
      updateStatus(caller); // Update the status display
    });

});

pio.changeBtn.addEventListener('click', function () { // Change Punch button (same as punch out and punch in in one action)
  pio.changeBtn.classList.add('pressedChange');
  pio.changeBtn.addEventListener('animationend', function press() {
    pio.changeBtn.classList.remove('pressedChange');
    pio.changeBtn.removeEventListener('animationend', press, false);
  });
  let caller = "in"; // Identifies source of function calls
  let myTime = Date.now();
  let punchArray;
  if (!data.hasPunches()) {
    if (msgObject.dev) displayAlert(msgObject["wrongStat"], false, pio.alertContainers);
    punchArray = [];
    return false;
  } else {
    punchArray = data.getPunches("time", "Asc");
  }
  let punchId = punchArray.length; // Get an index number to assign this new punch
  punchArray[punchId] = new Punch(punchId, myTime); //Create new Punch object with index and in-time
  let thisPunch = punchArray[punchId]; // Assign the punch object to a variable
  thisPunch.status = "In"; // Set status of the new punch to In
  let lastPunch = punchArray[punchId - 1]; // Get the index number of the previous punch
  lastPunch.outTime = myTime; //Set the out-time for the punch
  lastPunch.status = "Out"; // Set status of the previous punch to Out
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface(caller); // Enable/disable UI elements
  updateStatus(caller); // Update the status display
});

pio.assignBtn.addEventListener('click', function () { // Collect text input values and assign them to punch properties
  let caller = "assign";
  let punchArray;
  if (!data.hasPunches()) {
    if (msgObject.dev) displayAlert(msgObject["wrongStat"], false, pio.alertContainers);
    punchArray = [];
  } else {
    punchArray = data.getPunches("time", "Asc");
  }
  let punchId = punchArray.length;
  let thisPunch = punchArray[punchId - 1]; // Get the index number of the currently open punch
  thisPunch.client = pio.clientTxt.value; // Assign text values from inputs to object properties
  thisPunch.project = pio.projectTxt.value;
  thisPunch.job = pio.jobTxt.value;
  localStorage.setItem('punches', JSON.stringify(punchArray)); // Put data back in storage
  setupInterface(caller); // Enable/disable UI elements
  updateStatus(caller); // Update the status display
});
