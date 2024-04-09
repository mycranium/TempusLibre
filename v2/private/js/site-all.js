// JavaScript Document

/////////////////////////////////
//
// COMMON
//
/////////////////////////////////

var msgObject = { // Global message strings
  saveMsg: ["Settings not saved.", "Settings saved."],
  getStoredMsg: ["The stored data does not have the expected entries. No Punch data appears to be stored.", ""],
  noStoredMsg: ["There are no stored settings.", ""],
  noPunchesMsg: ["There are no stored punches.", ""],
  noValidMsg: ["There is no valid data in localStorage.", ""],
  multiOpenMsg: ["There are multiple open punches.", ""],
  dataCopied: ["Data not copied to clipboard.", "Data copied to clipboard."],
  wrongData: ["The selected data is the wrong type.", ""],
  wrongStat: ["Something's wrong, You are not punched in.", ""],
  punchStatus: ["You are punched OUT", "You are punched IN"],
  dev: false
};

const data = {
  hasPunches: function () {
    if (localStorage.hasOwnProperty('punches')) {
      let myPunches = JSON.parse(localStorage.getItem('punches'));
      if (myPunches[0].hasOwnProperty('punchId')) {
        return true;
      }
    } else {
      return false;
    }
  },
  settings: function (action = "check") {
    if (localStorage.hasOwnProperty('settings')) {
      let mySettings = JSON.parse(localStorage.getItem('settings'));
      if (mySettings.hasOwnProperty('style')) {
        return (action == "check") ? true : mySettings;
      }
    } else {
      return false;
    }
  },
  lastPunch: function () {
    if (this.hasPunches()) {
      return this.getPunches()[0];
    } else {
      return false;
    }
  },
  punchedIn: function () {
    if (this.lastPunch.status == ('In')) {
      return true;
    } else {
      return false;
    }
  },
  getPunches: function (field = "time", order = "Desc") {
    if (this.hasPunches()) {
      let myPunches = JSON.parse(localStorage.getItem('punches'));
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
    } else {
      return false;
    }
  },
  checkForInMulti: function (retType = "bool") { // Maybe use for data management
    let punches = this.getPunches();
    if (punches) {
      let result = punches.filter(punch => punch.status == "In");
      if (result.length > 0) {
        punches.map(punch => {
          if (punch.status == "In") {
            punch.status = "Out";
            punch.outTime = Date.now();
          }
        });
        if (retType == "latest") {
          return punches[0];
        } else if (retType == "all") {
          return punches;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};


document.body.onload = setStyleFromStorage();

//
// Style Switcher
//
function setStyleFromStorage() { // converted to use data obj
  let workSettings = data.settings("get");
  let css_title = (workSettings) ? workSettings.style : "default";
  if (css_title.length) {
    switch_style(css_title);
  }
}

function switch_style(css_title) {
  let link_tag = document.getElementsByTagName("link");
  for (let i = 0; i < link_tag.length; i++) {
    if ((link_tag[i].rel.indexOf("stylesheet") != -1) && link_tag[i].title) {
      link_tag[i].disabled = true;
      if (link_tag[i].title == css_title) {
        link_tag[i].disabled = false;
      }
    }
  }
}

//
// Slide-in alert display
//
function displayAlert(obj, stat, containers) {
  let msg = (!stat) ? obj[0] : obj[1]; // Set a message text
  if (msg == "") return false;
  let newClass = (!stat) ? "failure" : "success"; // determine a new class for the container
  if (containers[0] !== null) {
    let cont = containers[0]; //document.getElementById("clipAlert");
    let alertText = containers[1]; //document.getElementById("alertText");
    alertText.textContent = msg; // put the correct text in the p
    cont.classList.add(newClass);
    cont.style.display = 'block';
    cont.getBoundingClientRect();
    cont.classList.add('slideIn');
    cont.addEventListener('animationend', function transDone() {
      cont.classList.remove('slideIn');
      cont.style.display = 'none';
      cont.classList.remove(newClass);
      cont.removeEventListener('animationend', transDone, false);
    });
  }
}

//
// SHARED
//
function getSetStat(field) {
  if (field == "Unassigned" || field == "") {
    return false;
  }
  return true;
}

//
// PUNCH DISPLAY - punch-view.html etc.
// Refactor this to remove stringify function into own func
function getAndShowPunches(obj, field, range) {
  if (data.hasPunches) {
    let punchTable = ""; // Set variable to build HTML string
    let punchList = "";
    let punchCSV = "In Date&#x0009;In Time&#x0009;Out Date&#x0009;Out Time&#x0009;Dur: H:M&#x0009;Dur: Min&#x0009;Client&#x0009;Project&#x0009;Job&#x0009;Status";
    if (range == "latest") {
      let myPunch = data.lastPunch();
      htmlStringify(myPunch);
      obj.sortDate.disabled = true;
      obj.sortClient.disabled = true;
      obj.all.disabled = false;
      obj.latest.disabled = true;
      obj.copyBtn.disabled = false;
      obj.clear.disabled = false;
    } else {
      var sortField = (field == "time") ? obj.dateOrderDir : obj.clientOrderDir;
      var sortdir = sortField.textContent;
      var myPunches = data.getPunches(field, sortdir);
      if (!myPunches) return false; // Return false if getSortedPunches returns false
      sortField.textContent = (sortdir == "Asc") ? "Desc" : "Asc";
      myPunches.forEach(htmlStringify); // Iterate the array
      obj.sortDate.disabled = false;
      obj.sortClient.disabled = false;
      obj.all.disabled = true;
      obj.latest.disabled = false;
      obj.copyBtn.disabled = false;
      obj.clear.disabled = false;
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
      punchList += "<ul class='punchPod'>\n<li class='col0'>" + inTime + "</li><li class='col1'>" + inDate + "</li><li class='col2'>" + outTime + "</li><li class='col3'>" + outDate + "</li><li class='col4'>" + duration[0] + "</li><li class='col6'>" + punch.status + "</li><li class='col7'>" + punch.client + "</li><li class='col8'>" + punch.project + "</li><li class='col9'>" + punch.job + "</li>\n</ul>\n";
      punchCSV += "\n" + inDate + "&#x0009;" + inTime + "&#x0009;" + outDate + "&#x0009;" + outTime + "&#x0009;" + duration[0] + "&#x0009;" + duration[1] + "&#x0009;" + escapeCommas(punch.client) + "&#x0009;" + escapeCommas(punch.project) + "&#x0009;" + escapeCommas(punch.job) + "&#x0009;" + punch.status;
    }
    obj.tableCont.innerHTML = punchTable;
    obj.listCont.innerHTML = punchList;
    obj.copyCont.innerHTML = punchCSV;
    obj.clear.disabled = false;
    return true;
  } else {
    return false;
  }
}

// PUNCH DISPLAY AREAS - MESSAGES
function clearDisplays(obj) {
  if (obj.tableCont != "undefined" && obj.tableCont) {
    obj.tableCont.innerHTML = "";
    obj.listCont.innerHTML = "";
    obj.copyCont.value = "";
  }
}

function escapeCommas(str) {
  if (str.indexOf(",") != -1) {
    let esStr = "\"" + str + "\"";
    return esStr;
  } else {
    return str;
  }
}

//
// DATE AND TIME FORMATTING
//
function getFormattedDate(timeMS) {
  let outArray = [];
  let myDate = new Date(timeMS);
  let dateString = myDate.getFullYear() + "-";
  let timeString = "";
  let myMonth = myDate.getMonth() + 1;
  let myDay = myDate.getDate();
  let hours = myDate.getHours();
  let minutes = myDate.getMinutes();
  dateString += (myMonth < 10) ? "0" + myMonth + "-" : myMonth + "-";
  dateString += (myDay < 10) ? "0" + myDay : myDay;
  timeString += (hours < 10) ? "0" + hours + ":" : hours + ":";
  timeString += (minutes < 10) ? "0" + minutes : minutes
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
