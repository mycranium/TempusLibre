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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toTitleCase(string) {
  let str = string.toLowerCase();
  let spl = str.split(" ");
  let nStr = "";
  for ( let i=0; i<spl.length; i++) {
    nStr += spl[i][0].toUpperCase() + spl[i].substring(1);
    if (i < spl.length - 1) {nStr += " ";} 
  }
  return nStr;
}

function makeNewId(arr) {
  let max = 0;
  for (let n=0; n<arr.length; n++) {
    if (arr[n].id > max) { max = arr[n].id; }
  }
  return (arr.length > max) ? arr.length : max + 1;
}

function animatePanels(level, dir="in") { // generalize to include warnings
  let panel = document.getElementById(level + "_panel");
  let wrap = eTargs.wrap;
  let asgnDis = (eTargs.assignBtn.hasAttribute('disabled')) ? true : false;
  if (dir == "in") {
    for (let sel of eTargs.sels) {
      sel.setAttribute('disabled', 'true');
    }
    panel.classList.add('over');
    wrap.classList.add("dim");
    panel.classList.add('in');
    if (!asgnDis) {eTargs.assignBtn.setAttribute('disabled', 'true');}
  } else {
    panel.classList.remove('in');
    wrap.classList.remove("dim");
    for (let sel of eTargs.sels) {
      sel.removeAttribute('disabled');
    }
    if (asgnDis) {eTargs.assignBtn.removeAttribute('disabled');}
    sleep(500).then(() => {
      panel.classList.remove('over');
    });
  }
}

function enableNewEntry(level, data) {
  animatePanels(level, "in");
  let sav = document.getElementById(level + "_save");
  let cxl = document.getElementById(level + "_cancel");
  let inp = document.getElementById(level + "_inp_new");
  inp.setAttribute('required', 'true');
  inp.removeAttribute('disabled');
  inp.addEventListener('input', inputEvtHandler);
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
  let iObj = (level == "project") ? {clientId: iArr[0].id, projectId: newId} : {projectId: iArr[0].id, jobId: newId};
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
    for (let client of mcl.clients) { eTargs.cSel.append(generateOptions(client)); }
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
  for (let i of iCon) {iNums.push((level == "project") ? i.projectId : i.jobId);}
  if (range) { iList = srcList.filter(src => iNums.includes(src.id) && src.id != 0); }
  else { iList = srcList.filter(src => iNums.includes(src.id) && src.id != 0 && !src.exc); }
  for (let item of iList) {sel.append(generateOptions(item, false, className));}
  sel.selectedIndex = 0;
}

function clearOptions(level, range=true) {
  let sel = document.getElementById(level + "_selector");
  let len = sel.options.length;
  for (let i = len - 1; i >= 0; i--) {
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

function inputEvtHandler(e)  {
  let btn = e.target.closest('.panel').querySelector('.input_btn.save');
  btn.removeAttribute('disabled');
}

function assignSecondaryEvtHandler(e) {
  let action = (e.target.id.includes("yes")) ? true : false;
  let asgnBtns = eTargs.assignPnl.querySelectorAll('.input_btn');
  let msg = eTargs.assignPnl.querySelector('p');
  if (action) {
    // make assignment
    for (let btn of asgnBtns) {
      btn.removeEventListener('click', assignSecondaryEvtHandler);
    }
  } else {
    //clear box
    animatePanels("warning", "out");
    
    for (let btn of asgnBtns) {
      btn.removeEventListener('click', assignSecondaryEvtHandler);
    }
    sleep(500).then(() => {
      msg.innerHTML = "";
      
    });
  }
}

function assignEvtHandler() {
  let u = [];
  let uFields, verb;
  for (let s=0; s<eTargs.sels.length; s++) {
    if (eTargs.sels[s].value == 0) {
      u[u.length] = toTitleCase(eTargs.sels[s].id.split("_")[0]);
    }
  }
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
  sleep(100).then(() => {
  animatePanels("warning", "in");
  let asgnBtns = eTargs.assignPnl.querySelectorAll('.input_btn');
  for (let btn of asgnBtns) {
    btn.addEventListener('click', assignSecondaryEvtHandler);
  }
  });
}

function handleSavCxlEvt(e) {
  let level = e.target.id.split("_")[0];
  let type = e.target.id.split("_")[1];
  let sel = document.getElementById(level + "_selector");
  let newInp = document.getElementById(level + "_inp_new");
  let myParent = e.target.closest('.settings_list');
  let btns = myParent.querySelectorAll('.input_btn');
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
  }
  animatePanels(level, "out");
  sleep(500).then(() => {
    newInp.removeAttribute("required");
    newInp.value = "";
    if (level != "client") {
      myParent.querySelector('.exc_chk').checked = true;
    }
    for (let btn of btns) {
      btn.removeEventListener("click", handleSavCxlEvt);
      if (btn.classList.contains("save")) {
        btn.setAttribute('disabled', 'true');
      }
    }
  });
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