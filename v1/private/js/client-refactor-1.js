const eTargs = {
  /* divs */
  wrap: document.getElementById("selectsContainer"),
  cPnl: document.getElementById("client_panel"),
  pPnl: document.getElementById("project_panel"),
  jPnl: document.getElementById("job_panel"),
  /* selects */
  sels: document.querySelectorAll("select.selector"),
  cSel: document.getElementById("client_selector"),
  pSel: document.getElementById("project_selector"),
  jSel: document.getElementById("job_selector"),
  /* inputs */
  cInpNew: document.getElementById("client_inp_new"),
  pInpNew: document.getElementById("project_inp_new"),
  jInpNew: document.getElementById("job_inp_new"),
  pExcChk: document.getElementById("project_chk"),
  jExcChk: document.getElementById("job_chk"),
  /* buttons */
  cSav: document.getElementById("client_save"),
  cCxl: document.getElementById("client_cancel"),
  pSav: document.getElementById("project_save"),
  pCxl: document.getElementById("project_cancel"),
  jSav: document.getElementById("job_save"),
  jCxl: document.getElementById("job_cancel"),
  assignBtn: document.getElementById("assign"),
  assignPnl: document.getElementById("warning_panel"),
  assignPar: document.getElementById("unspec_warn")
}
let mcl = mainClientList;

function toTitleCase(string) {
  let str = string.toLowerCase();
  let spl = str.split(" ");
  let nStr = "";
  for (i=0; i<spl.length; i++) {
    nStr += spl[i][0].toUpperCase() + spl[i].substring(1);
    if (i < spl.length - 1) {nStr += " ";} 
  }
  return nStr;
}

function makeNewId(arr) {
  let max = 0;
  for (n=0; n<arr.length; n++) {
    if (arr[n].id > max) { max = arr[n].id; }
  }
  return (arr.length > max) ? arr.length : max + 1;
}

function animatePanels(level, dir="in") { // generalize to include warnings
  let panel = document.getElementById(level + "_panel");
  let wrap = eTargs.wrap;
  let disEl = (level == "warning") ? eTargs.assignBtn : document.getElementById(level + "_inp_new");
  if (dir == "in") {
    panel.classList.add("slide");
    wrap.classList.add("dim");
    disEl.toggleAttribute("disabled");
    for (sel of eTargs.sels) {
      sel.classList.add("dim");
      sel.toggleAttribute("disabled");
    }
  } else {
    panel.classList.remove("slide");
    wrap.classList.remove("dim");
    disEl.toggleAttribute("disabled");
    for (sel of eTargs.sels) {
      sel.classList.remove("dim");
      sel.toggleAttribute("disabled");
    }
  }
}

function enableNewEntry(level, data) {
  animatePanels(level, "in");
  let sav = document.getElementById(level + "_save");
  let cxl = document.getElementById(level + "_cancel");
  sav.addEventListener('click', handleSavCxlEvt);
  cxl.addEventListener('click', handleSavCxlEvt);
}

function addNewEntry(level, val, exclusive = true) { // val is text input value
  let newId = 0;
  if (level == "client") {
    newId = makeNewId(mcl.clients);
    mcl.clients.push({name: val, id: newId});
    return newId;
  }
  let upVal = (level == "project") ? eTargs.cSel.value : eTargs.pSel.value;
  let upList = (level == "project") ? mcl.clients : mcl.projects;
  let iList = (level == "project") ? mcl.projects : mcl.jobs;
  let iCon = (level == "project") ? mcl.clientConnector : mcl.projectConnector;
  let iArr = upList.filter(item => item.id == upVal);
  
  newId = makeNewId(iList);
  iList.push({name: val, exc: exclusive, id: newId});
  let iObj = (level == "project") ? {clientId: iArr[0].id, projectId: newId} : {projectId: iArr[0].id, jobId: NewId};
  iCon.push(iObj);
  return newId;
/*  let cl = document.getElementById("clientSel").value;
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
      break;
    case ("job"):
    let myProj = mcl.projects.filter(prjs => prjs.id == pr);
      newId = makeNewId(mcl.jobs);
      mcl.jobs.push({name: val, exc:exclusive, id: newId});
      mcl.projectConnector.push({projectId: myProj[0].id, jobId: newId});
      break; */
}

function getList(level, range=true) {
  let sel, upVal, srcList, connList;
  let iNums = [];
  let iCon = [];
  let iList = [];
  let className = (range) ? "assigned" : "unassigned";
  if (level == "client") {
    for (client of mcl.clients) { eTargs.cSel.append(generateOptions(client)); }
    return;
  } else if (level == "project") {
    sel = eTargs.pSel;
    upVal = eTargs.cSel.value;
    srcList = mcl.projects;
    connList = mcl.clientConnector;
  } else {
    sel = eTargs.jSel;
    upVal = eTargs.pSel.value;
    srcList = mcl.jobs;
    connList = mcl.projectConnector;
  }
  if (range) {
    clearOptions(level, true);
    iCon = connList.filter(item => ((level == "project") ? item.clientId : item.projectId) == upVal);
  } else {
    clearOptions(level, false);
    iCon = connList.filter(item => ((level == "project") ? item.clientId : item.projectId) != upVal);
  }
  for (i of iCon) {iNums.push((level == "project") ? i.projectId : i.jobId);}
  if (range) { iList = srcList.filter(src => iNums.includes(src.id) && src.id != 0); }
  else { iList = srcList.filter(src => iNums.includes(src.id) && src.id != 0 && !src.exc); }
  for (item of iList) {sel.append(generateOptions(item, false, className));}
  sel.selectedIndex = 0;
}

function clearOptions(level, range=true) {
  let sel = document.getElementById(level + "_selector");
  let len = sel.options.length;
  for (i = len - 1; i >= 0; i--) {
    if (!range) {
      let myList = [...sel[i].classList];
      if (sel[i].value == "more") {
        sel[i].value = "less";
        sel[i].text = "less...";
      } else if (sel[i].value == "less")  {
        sel[i].value = "more";
        sel[i].text = "more...";
      }
      if (myList.includes("unassigned")) {
        sel.remove(i);
      }
    } else if (range) {
      if (sel[i].value == "less") {
        sel[i].value = "more";
        sel[i].text = "more...";
      }
      if (parseInt(sel[i].value)) {
        if (parseInt(sel[i].value) >= 0) {
          sel.remove(i);
        }
      }
    }
  }
}

function generateOptions(item, selected = false, className = "") {
  let newOpt = document.createElement("option");
  let newText = document.createTextNode(item.name);
  newOpt.setAttribute("value", item.id);
  newOpt.append(newText);
  if (selected) { newOpt.setAttribute("selected", "true"); }
  if (className != "") { newOpt.setAttribute("class", className); }
  return newOpt;
}

function assignEvtHandler() {
  let u = [];
  let uFields, verb;
  let panel = eTargs.assignPnl;
  for (s=0; s<eTargs.sels.length; s++) {
    if (eTargs.sels[s].value == 0) { u[u.length] = toTitleCase(eTargs.sels[s].id.split("_")[0]); }
  }
  console.log(u);
  if (u.length === 1) {
    uFields = u[0];
    verb = "is";
  } else if (u.length === 2) {
    uFields = u[0] + " and " + u[1];
    verb = "are";
  } else if (u.length === 3) {
    uFields = "All fields";
    verb = "are";
  }
  let msg = `${uFields} ${verb} unspecified. Assign anyway?`;
  let newTxt = document.createTextNode(msg);
  eTargs.assignPar.append(newTxt);
  animatePanels("warning", "in");
}


function handleSavCxlEvt(e) {
  let level = e.target.id.split("_")[0];
  let type = e.target.id.split("_")[1];
  let sel = document.getElementById(level + "_selector");
  let newInp = document.getElementById(level + "_inp_new");
  let exc = false;
  
  if (level != "client") {
    let newExc = document.getElementById(level + "_chk");
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
    let newId = addNewEntry(level, newVal, exc);
    sel.append(generateOptions({id: newId, name: newVal}, true));
//    aState[0] = true;
//    assButt.removeAttribute("disabled");
  }
  animatePanels(level, "out");
  newInp.removeAttribute("required");
  newInp.value = "";
  this.removeEventListener("click", handleSavCxlEvt);
}

function jobEvtHandler(e) {
  if (e.target.value == "-1") {
    enableNewEntry("job", e.target);
  } else if (e.target.value == "more") {
    getList("job", false);
  } else if (e.target.value == "less") {
    clearOptions("job", false);
    e.target.selectedIndex = 0;
  }
}

function projectEvtHandler(e) {
  if (e.target.value == "-1") {
    enableNewEntry("project", e.target);
  } else if (e.target.value == "more") {
    getList("project", false);
    clearOptions("job", true);
  } else if (e.target.value == "less") {
    clearOptions("project", false);
    clearOptions("job", true);
    e.target.selectedIndex = 0;
  } else {
    getList("job", true);
  }
}

function clientEvtHandler(e) {
  if (e.target.value == "-1") { enableNewEntry("client", e.target); }
  getList("project", true);
}

getList("client");
eTargs.cSel.addEventListener('input', clientEvtHandler);
eTargs.pSel.addEventListener('input', projectEvtHandler);
eTargs.jSel.addEventListener('input', jobEvtHandler);
eTargs.assignBtn.addEventListener('click', assignEvtHandler);