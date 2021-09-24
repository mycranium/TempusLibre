// JavaScript Document

const cliInput = {
  cSel: document.getElementById('clientSel'),
  cNew: document.getElementById('clientNew'),
  pSel: document.getElementById('projectSel'),
  pNew: document.getElementById('projectNew'),
  jSel: document.getElementById('jobSel'),
  jNew: document.getElementById('jobNew'),
  assignBtn: document.getElementById('assign'),
  disabledEl: function (obj, truth) {
    obj.disabled = truth;
  },
  popSel: function (obj, content) {
    const optArr = content.map(v => `<option value=\"${v.name}\">${v.name}</option>`);
    const defArr = [`<option value="init" disabled selected hidden>Select or Add New ${obj.getAttribute('name')}</option>`, '<option value="new">Add New</option>'];
    obj.innerHTML = defArr.concat(optArr).join("\n");
    this.disabledEl(obj, false);
  },
  clearEl: function (obj) {
    obj.value = "";
  }
}
const cliData = { // move into data object?
  srcData: JSON.parse(localStorage.getItem('clients')),
  prData: function (client) {
    return this.srcData.filter(c => c.name == client)[0].projects;
  },
  joData: function (client, project) {
    return this.prData(client).filter(c => c.name == project)[0].jobs;
  }
}
document.body.onload = loadForm;

function loadForm() {
  cliInput.cNew.value = "";
  cliInput.pNew.value = "";
  cliInput.jNew.value = "";
  cliInput.cNew.disabled = true;
  cliInput.pNew.disabled = true;
  cliInput.jNew.disabled = true;
  cliInput.popSel(cliInput.cSel, cliData.srcData);
}

function Assignment() { // Definition for Assignment object
  this.clientId = 0;
  this.clientName = "";
  this.projectId = 0;
  this.projectName = "";
  this.jobId = 0;
  this.jobName = "";
}

function resetFields(field, value) {
  let fieldSel = field + "Sel";
  let fieldNew = field + "New";
  cliInput[fieldSel].value = value;  
  cliInput[fieldNew].value = "";  
//  let evt = new Event('change');
//  cliInput[fieldSel].dispatchEvent(evt);
}
// Gather data from correct fields
// If any are "new" then add them to the lists
// then add assignment data to punches
function getInValue(level = "client") {
  let sel = cliInput.cSel;
  let newIn = cliInput.cNew;
  let outVal;
  if (level == "project") {
    sel = cliInput.pSel;
    newIn = cliInput.pNew;
  } else if (level == "job") {
    sel = cliInput.jSel;
    newIn = cliInput.jNew;
  }
  outVal = (sel.value != "new") ? sel.value : newIn.value;
  if (outVal == "init" || outVal == "None") {
    outVal = "Unassigned"
  }
  return outVal;
}

cliInput.assignBtn.addEventListener('click', function () { // Collect text input values and assign them to punch properties
  console.log("Client: " + getInValue("client"));
  console.log("Project: " + getInValue("project"));
  console.log("Job: " + getInValue("job"));
/*  let caller = "assign";
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
  updateStatus(caller); // Update the status display*/
});

/*
CLIENT
*/
cliInput.cSel.addEventListener('change', function () {
    if (this.value == "new") {
    cliInput.disabledEl(cliInput.cNew, false);
    cliInput.cNew.focus();
    resetFields("p", "new");
    resetFields("j", "new");
    cliInput.disabledEl(cliInput.pNew, false);
    cliInput.disabledEl(cliInput.jNew, false);
    cliInput.disabledEl(cliInput.assignBtn, false);
    cliInput.disabledEl(cliInput.pSel, true);
    cliInput.disabledEl(cliInput.jSel, true);
  } else {
    cliInput.popSel(cliInput.pSel, cliData.prData(this.value));
    cliInput.cNew.value = "";
    cliInput.pNew.value = "";
    cliInput.jNew.value = "";
    cliInput.pSel.value = "init";
    cliInput.jSel.value = "init";
    cliInput.disabledEl(cliInput.cNew, true);
    cliInput.disabledEl(cliInput.pNew, true);
    cliInput.disabledEl(cliInput.jSel, true);
    cliInput.disabledEl(cliInput.jNew, true);
  }
});
cliInput.cNew.addEventListener('blur', function () {
  if (this.value.length > 0) {
    let result = cliData.srcData.filter(cli => cli.name == this.value);
    if (result.length > 0) {
      cliInput.cSel.value = this.value;
      this.value = "";
      this.disabled = true;
      alert("This client name is already in your list. Please select it from the list, or enter a different, unused client name.");
      let evt = new Event('change');
      cliInput.cSel.dispatchEvent(evt);
    }
  } else {
    this.value = "None";
  }
});

/*
PROJECT
*/
cliInput.pSel.addEventListener('change', function () {
  if (this.value == "new") {
    cliInput.disabledEl(cliInput.pNew, false);
    cliInput.pNew.focus();
    cliInput.jNew.value = "";
    cliInput.disabledEl(cliInput.jNew, false);
    cliInput.disabledEl(cliInput.jSel, true);
  } else {
    let myClient = cliInput.cSel.value;
    cliInput.popSel(cliInput.jSel, cliData.joData(myClient, this.value));
    cliInput.pNew.value = "";
    cliInput.jNew.value = "";
    cliInput.disabledEl(cliInput.pNew, true);
    cliInput.disabledEl(cliInput.jNew, true);
  }  
});
cliInput.pNew.addEventListener('blur', function () {
  if (this.value.length > 0) {
    let myClient = cliInput.cSel.value;
    if (myClient != "new") {
      let result = cliData.prData(myClient).filter(pro => pro.name == this.value);
      if (result.length > 0) {
        cliInput.pSel.value = this.value;
        this.value = "";
        this.disabled = true;
        alert("This project name is already in your list. Please select it from the list, or enter a different, unused project name.");
        let evt = new Event('change');
        cliInput.pSel.dispatchEvent(evt);
      }
    } else {
      cliInput.pSel.value = "new";
      let evt = new Event('change');
      cliInput.pSel.dispatchEvent(evt);
    }
  } else {
    this.value = "None";
    cliInput.pSel.value = "new";
    let evt = new Event('change');
    cliInput.pSel.dispatchEvent(evt);
  }
});

/*
JOB
*/
cliInput.jSel.addEventListener('change', function () {
  if (this.value == "new") {
    cliInput.disabledEl(cliInput.jNew, false);
    cliInput.jNew.focus();
  } else {
    cliInput.disabledEl(cliInput.jNew, true);
  }  
});
cliInput.jNew.addEventListener('blur', function () {
  if (this.value.length > 0) {
    let myClient = cliInput.cSel.value;
    let myProject = cliInput.pSel.value;
    if (myClient != "new" && myProject != "new") {
      let result = cliData.joData(myClient, myProject).filter(job => job.name == this.value);
      if (result.length > 0) {
        cliInput.jSel.value = this.value;
        this.value = "";
        this.disabled = true;
        alert("This job name is already in your list. Please select it from the list, or enter a different, unused job name.");
        let evt = new Event('change');
        cliInput.jSel.dispatchEvent(evt);
      }
    } else {
      cliInput.jSel.value = "new";
      let evt = new Event('change');
      cliInput.jSel.dispatchEvent(evt);
    }
  } else {
    this.value = "None";
    cliInput.jSel.value = "new";
    let evt = new Event('change');
    cliInput.jSel.dispatchEvent(evt);
  }
});

