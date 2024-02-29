let cliObj = {};

function toggleSelectsDisabled() {
  let selArr = [document.getElementById("clientSel"), document.getElementById("projectSel"), document.getElementById("jobSel")];
  for (let s=0; s<selArr.length; s++) {
    selArr[s].toggleAttribute("disabled");
  }
}

function clearOpts(id) {
  let sel = document.getElementById("jobSel");
  for (let i= sel.options.length -1; i >2; i--) {
    sel.remove(i);
  }
  if (id == "clientSel") {
    let upSel = document.getElementById("projectSel");
    for (let n= upSel.options.length -1; n >=3; n--) {
      upSel.remove(n);
    }
  }
}

function toggleMoreItems(e) {
  let sel = e.target;
  let val = sel.value;
  let level = (sel.id.includes("job")) ? "job" : "project";
  let upLevel = (level == "project") ? "client" : "project";
  let upVal = document.getElementById(upLevel + "Sel").value;
  let slOpt = sel.options[sel.selectedIndex];
  let opts = sel.children;
  let listArray = new Array();
  if (level == "job") {
   listArray = cliObj.projects.filter(p => p.id == upVal)[0].jobs;
  } else {
    listArray = cliObj.projects;
  }
  let outArray = new Array();
  if (val == "more") {
    slOpt.text = "Less...";
    slOpt.value = "less";
    if (listArray.length + 3 < opts.length) { // bail out if already extra options
      return false;
    }
    let aIArr = new Array();
    for (let j=0; j<listArray.length; j++) {
      aIArr.push(listArray[j].id);
    }
    let allItems = (level == "job") ? mcl.jobs : mcl.projects;
    let moreItems = allItems.filter(item => !aIArr.includes(item.id) && !item.exc);
    if (level == "project") {
      for (s=0;s<moreItems.length;s++) {
      }
      
    }
    // for projects, moreItems should include all projects that are not assigned to the slected project and are not exclusive
    for (let m=0; m<moreItems.length; m++) {
      let tI = moreItems[m];
      outArray.push(createOption(tI.id, false, tI.name, "unassigned"));
    }
  } else if (val == "less") {
    slOpt.text = "more...";
    slOpt.value = "more";
    (level == "job") ? clearOpts(level + "Sel") : clearOpts(upLevel + "Sel");
    for (let p=0; p<listArray.length; p++) {
      let pI = listArray[p];
      if (pI.name != "Unspecified") { outArray.push(createOption(pI.id, false, pI.name, "assigned")); }
    }
  }
  return outArray;
}

function makeNewId(arr) {
  let max = 0;
  for (n=0; n<arr.length; n++) {
    if (arr[n].id > max) { max = arr[n].id; }
  }
  return (arr.length > max) ? arr.length : max + 1;
}

function addNewEntry(level, val, exclusive = true) {
  let cl = document.getElementById("clientSel").value;
  let pr = document.getElementById("projectSel").value;
  let newId = 0;
  switch (level) {
    case ("client"):
      newId = makeNewId(mcl.clients);
      mcl.clients.push({name: val, id: newId});
      makeClientObject(newId);
      break;
    case ("project"):
    let myCli = mcl.clients.filter(clis => clis.id == cl);
      newId = makeNewId(mcl.projects);
      mcl.projects.push({name: val, exc:exclusive, id: newId});
      mcl.clientConnector.push({clientId: myCli[0].id, projectId: newId});
      makeClientObject(cl);
      break;
    case ("job"):
    let myProj = mcl.projects.filter(prjs => prjs.id == pr);
      newId = makeNewId(mcl.jobs);
      mcl.jobs.push({name: val, exc:exclusive, id: newId});
      mcl.projectConnector.push({projectId: myProj[0].id, jobId: newId});
      makeClientObject(cl);
      break;
  }
  return newId;
}

function revealNewInput(level) {
  let newInpPanel = document.getElementById(level + "InpPanel");
  let outer = document.getElementById("selectsWrap");
  let selects = document.querySelectorAll("div.select > select");
  let newInp = document.getElementById(level + "New");
  let cancel = document.getElementById(level + "NewCancel");
  let save = document.getElementById(level + "NewSave");
  newInpPanel.classList.add("slide");
  outer.classList.add("dim");
  for (sct of selects) { sct.classList.add("dim") };
  newInp.disabled = false;
  newInp.setAttribute("required", "true");
  toggleSelectsDisabled();
  cancel.addEventListener('click', handleSaveAndCancelEvt);
  save.addEventListener('click', handleSaveAndCancelEvt);
}

function createOption(value, selected, txt, className="") {
  let myOpt = document.createElement("option");
  let myTxt = document.createTextNode(txt);
  myOpt.setAttribute("value", value);
  if (selected) { myOpt.setAttribute("selected", ""); }
  if (className != "") { myOpt.setAttribute("class", className); }
  myOpt.append(myTxt);
  return myOpt;
}

function resetMoreOptions(level) {
  let subsArr = new Array();
  subsArr.push(document.getElementById("jobSel").options);
  if (level == "project") {
    subsArr.push(document.getElementById("projectSel").options);
  }
  for (r=0;r<subsArr.length;r++) {
    for (q=0;q<subsArr[r].length;q++) {
      if (subsArr[r][q].value == "less") {
        subsArr[r][q].value = "more";
        subsArr[r][q].text = "more...";
      }
    }
  }
}

function makeJobSelect(level, obj) {//ok
  let myArr;
  let mySelect = document.getElementById(level + "Sel");
  switch (level){
    case "client":
      myArr = obj;
    break;
    case "project":
      myArr = obj.projects;
    break;
    case "job":
      myArr = obj.jobs;
    break;
  }
  resetMoreOptions(level);
  for (let i=0; i<myArr.length; i++) {
    let p = myArr[i];
    let myClass = (level=="job" || level == "project") ? "assigned": "";
    if (p.name != "Unspecified") { mySelect.append(createOption(p.id, false, p.name, myClass)); }
  }
}

function makeClientObject(id) {
  let outObj = structuredClone(mcl.clients.filter((c) => c.id == id)[0]); // Deep clone filtered client list for name
  let cC = mcl.clientConnector.filter((cp) => cp.clientId == outObj.id); // Filtered connector list matching projectId to this client
  let cCArr = new Array();
  for (a=0; a<cC.length; a++) {cCArr.push(cC[a].projectId);} // Push project ids that match client in Connector into array
  outObj.projects = structuredClone(mcl.projects.filter((p) => cCArr.includes(p.id))); // deep clone of projects for this client
  let pC = mcl.projectConnector.filter((pj) => cCArr.includes(pj.projectId)); // get all projId & jobId for this client from Connector
  for (pjt of outObj.projects) { // for each project in the cliObj
    let myJbs = pC.filter((jz) => jz.projectId == pjt.id); // filter list for jobIds asstd w/ this projectId
    let jbNums = new Array(); // new array to hold jobIds for this project
    for(job of myJbs) { // for each entry in p->j filtered for this job
      jbNums.push(job.jobId); // push the job numbers into array
    }
    let jbsArray = new Array(); // new array to hold job objects
    jbsArray = structuredClone(mcl.jobs.filter((mJob) => jbNums.includes(mJob.id))); // filter jobs list on jobNums in array
    pjt.jobs = jbsArray; // set this project's jobs value to jobs array
  }
  cliObj = outObj;
}

function handleSaveAndCancelEvt(e) {
  let level = e.target.id.split("New")[0];
  let type = e.target.id.split("New")[1].toLowerCase();
  let sel = document.getElementById(level + "Sel");
  let newInpPanel = document.getElementById(level + "InpPanel");
  let outer = document.getElementById("selectsWrap");
  let selects = document.querySelectorAll("div.select > select");
  let newInp = document.getElementById(level + "New");
  let exc = false;
  if (level != "client") {
    let newExc = document.getElementById(level + "ExcChk");
    if (newExc.checked) { exc = true; }
  }
  if (type == "cancel") {
    sel.selectedIndex = 0;
  } else {
    let newVal = newInp.value;
    let valMsg = "This field is required. Please enter a name or click cancel."
    if (!newInp.validity.valid) {
      alert(valMsg);
      return false;
    }
    newId = addNewEntry(level, newVal, exc);
    sel.append(createOption(newId, true, newVal));
    aState[0] = true;
    assButt.removeAttribute("disabled");
  }
  newInpPanel.classList.remove("slide");
  outer.classList.remove("dim");
  for (sct of selects) { sct.classList.remove("dim") };
  newInp.removeAttribute("required");
  newInp.value = "";
  this.removeEventListener("click", handleSaveAndCancelEvt);
  toggleSelectsDisabled();
}

function assButtFunc(e) {
  // Add client/project/job data to punch
  console.log("Ass Butt");
}

function jobFunction(e) {
  let el = e.target;
  let id = el.id;
  let myVal = el.value;
  if (myVal !== "-1") {
    if (myVal == "more" || myVal == "less") {
      let optArray = toggleMoreItems(e);
      if (optArray) {
        for (o=0; o<optArray.length;o++) { this.append(optArray[o]); }
      }
      el.selectedIndex = 0;
    }
  } else if (myVal === "-1") {
    revealNewInput("job");
  } else {
    return;
  }
}

function prjFunction(e) {
  let el = e.target;
  let elOpt = el.options[el.selectedIndex];
  let classArr = [...elOpt.classList];
  let id = el.id;
  let myVal = el.value;
  clearOpts(el.id);
  if (myVal !== "-1") { 
    if (myVal == "more" || myVal == "less") {
      let optArray = toggleMoreItems(e);
      if (optArray) {
        for (o=0; o<optArray.length;o++) { this.append(optArray[o]); }
      }
      el.selectedIndex = 0;
    } else if ([...elOpt.classList].includes("unassigned")) {
      // loop mcl jobs and find jobs not assigned to this project that are not exclusive
      let oops = "edaisy";
    } else {
      thisObj = cliObj.projects.filter(p => p.id == parseInt(myVal));
      makeJobSelect("job", thisObj[0]);
    }
  } else if (myVal === "-1") {
    revealNewInput("project");
  } else {
    return;
  }
}

function cliFunction(e) {
  let el = e.target;
  let id = el.id;
  let myVal = el.value;
  clearOpts(el.id);
  if (myVal !== "-1") {
    makeClientObject(myVal);
    makeJobSelect("project", cliObj);
    aState[0] = true;
    assButt.removeAttribute("disabled");
  } else if (myVal === "-1") {
    revealNewInput("client");
    aState[0] = false;
    if (aState [0] == false && aState [1] == false && aState [2] == false) {
      assButt.setAttribute("disabled", "");
    }
  } else {
    aState[0] = false;
    if (aState [0] == false && aState [1] == false && aState [2] == false) {
      assButt.setAttribute("disabled", "");
    }
    return;
  }
}

let mcl = mainClientList;
makeJobSelect("client", mcl.clients);
const cliSelect = document.getElementById("clientSel");
makeClientObject(cliSelect.value);
const prjSelect = document.getElementById("projectSel");
const jobSelect = document.getElementById("jobSel");
const assButt = document.getElementById("assign");
let aState = [false,false,false];
if (aState [0] == false && aState [1] == false && aState [2] == false) {
  assButt.setAttribute("disabled", "");
}
cliSelect.addEventListener('input', cliFunction);
prjSelect.addEventListener('input', prjFunction);
jobSelect.addEventListener('input', jobFunction);
assButt.addEventListener('click', assButtFunc);
