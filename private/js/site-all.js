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
  settingsSaved: ["Settings not saved", "Settings saved."],
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
  settings: function (field = "settings", action = "check") {
    if (localStorage.hasOwnProperty('settings')) {
      let mySettings = JSON.parse(localStorage.getItem('settings'));
      if (field == "settings") {
        return (action == "check") ? true : mySettings;
      } else if (mySettings.hasOwnProperty(field)) {
        return (action == "check") ? true : mySettings[field];
      } else {
        return false;
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
  let workSettings = data.settings("style", "get");
  let css_title = (workSettings) ? workSettings : "default";
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
    var timeOrder = parseInt(data.settings("dateTime", "get").timeFirst, 10);
    let punchTable = ""; // Set variable to build HTML string
    let punchList = "";
    let dtFrag = (timeOrder) ? "Date/Time" : "Time/Date";
    let punchCSV = `In ${dtFrag}&#x0009;Out ${dtFrag}&#x0009;Dur: H:M&#x0009;Client&#x0009;Project&#x0009;Job&#x0009;Status`;
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
      let inObj = getFormattedDate(punch.inTime);
      let in0 = (timeOrder) ? inObj.displayDate : inObj.displayTime;
      let in1 = (timeOrder) ? inObj.displayTime : inObj.displayDate;
      let dInString = `${inObj.dataDate}, ${inObj.dataTime}`;
      let out0 = "Unassigned";
      let out1 = "Unassigned";
      let dOutString = "Unassigned";
      let duration = ["N/A", "N/A"];
      if (getSetStat(punch.outTime)) {
        let outObj = getFormattedDate(punch.outTime);
        out0 = (timeOrder) ? outObj.displayDate : outObj.displayTime;
        out1 = (timeOrder) ? outObj.displayTime : outObj.displayDate;
        dOutString = `${outObj.dataDate} ${outObj.dataTime}`;
        duration = getDuration(punch.inTime, punch.outTime);
      }
      punchTable += "<tr>\n<td>" + in0 + ", " + in1 + "</td>\n<td>" + out0 + ", " + out1 + "</td>\n<td>" + duration[0] + "</td>\n<td>" + punch.client + "</td>\n<td>" + punch.project + "</td>\n<td>" + punch.job + "</td>\n<td>" + punch.status + "</td>\n</tr>\n"
      punchList += "<ul class='punchPod'>\n<li class='col0'>" + in0 + "</li><li class='col1'>" + in1 + "</li><li class='col2'>" + out0 + "</li><li class='col3'>" + out1 + "</li><li class='col4'>" + duration[0] + "</li><li class='col6'>" + punch.status + "</li><li class='col7'>" + punch.client + "</li><li class='col8'>" + punch.project + "</li><li class='col9'>" + punch.job + "</li>\n</ul>\n";
      punchCSV += "\n" + dInString + "&#x0009;" + dOutString + "&#x0009;" + duration[0] + "&#x0009;" + escapeCommas(punch.client) + "&#x0009;" + escapeCommas(punch.project) + "&#x0009;" + escapeCommas(punch.job) + "&#x0009;" + punch.status;
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
  let srcData = data.settings('dateTime', 'get');
  let style = parseInt(srcData.dateStyle);
  let clock = parseInt(srcData.clockType);
  let order = parseInt(srcData.dateOrder);
//  let first = parseInt(srcData.timeFirst);
  let yearDig = parseInt(srcData.dateYear);
  let useDay = parseInt(srcData.dateDay);
  let useAbbr = parseInt(srcData.dateAbbr);
  let punc = (parseInt(srcData.datePunct) === 0) ? "-" : "/";
  punc = (style === 0) ? punc : " ";
  let punc2 = (style === 0) ? punc : ", ";
  let myDate = new Date(timeMS);
  let sYear = myDate.getFullYear();
  let sMonth = myDate.getMonth();
  let sDate = myDate.getDate();
  let sHours = myDate.getHours();
  let sMinutes = myDate.getMinutes();

  let dYear = (yearDig) ? sYear.toString(10).slice(-2) : sYear.toString(10);
  let dMonth = fmtMonth(sMonth, style, useAbbr);
  let dDay = getDayName(myDate.getDay(), useAbbr, useDay);
  let dDate = (sDate < 10) ? "0" + sDate.toString(10) : sDate.toString(10);

  let outObj = {};
  outObj.displayTime = fmtTime(sHours, sMinutes, clock);
  switch (order) {
    case 0:
      outObj.displayDate = `${dDay}${dYear}${punc2}${dMonth}${punc}${dDate}`;
      break;
    case 1:
      outObj.displayDate = `${dDay}${dYear}${punc2}${dDate}${punc}${dMonth}`;
      break;
    case 2:
      outObj.displayDate = `${dDay}${dMonth}${punc}${dDate}${punc2}${dYear}`;
      break;
    case 3:
      outObj.displayDate = `${dDay}${dDate}${punc}${dMonth}${punc2}${dYear}`;
      break;
    default:
     outObj.displayDate = `${dDay}${dYear}${punc}${dMonth}${punc2}${dDate}`;
  }
  outObj.dataTime = fmtTime(sHours, sMinutes, false);
  outObj.dataDate = `${sYear}-${sMonth + 1}-${sDate}`;

  function getDayName(dayNum, abbr, useDayName) {
    if (!useDayName) {
      return "";
    } else {
      let days = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
      };
      return (abbr) ? days[dayNum].slice(0, 3) + ", " : days[dayNum] + ", ";
    }
  }

  function fmtMonth(moNum, dStyle, abbr) {
    if (!dStyle) {
      moNum += 1;
      return (moNum < 10) ? "0" + moNum.toString(10) : moNum.toString(10);
    } else {
      let months = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
      };
      return (abbr) ? months[moNum].slice(0, 3) : months[moNum];
    }
  }

  function fmtTime(hours, minutes, clockType = false) {
    let dayPart = "";
    if (clockType) {
      if (hours > 12) {
        hours -= 12;
        dayPart = " PM";
      } else {
        dayPart = " AM";
      }
    }
    let hPrefix = (hours < 10) ? "0" : "";
    let mPrefix = (minutes < 10) ? "0" : "";
    return hPrefix + hours.toString(10) + ":" + mPrefix + minutes.toString(10) + dayPart;
  }
  return outObj;
}
//function letFormattedDate(timeMS) {
//  let outArray = [];
//  let myDate = new Date(timeMS);
//  let dateString = myDate.getFullYear() + "-";
//  let timeString = "";
//  let myMonth = myDate.getMonth() + 1;
//  let myDay = myDate.getDate();
//  let hours = myDate.getHours();
//  let minutes = myDate.getMinutes();
//  dateString += (myMonth < 10) ? "0" + myMonth + "-" : myMonth + "-";
//  dateString += (myDay < 10) ? "0" + myDay : myDay;
//  timeString += (hours < 10) ? "0" + hours + ":" : hours + ":";
//  timeString += (minutes < 10) ? "0" + minutes : minutes
//  outArray.push(dateString, timeString);
//  return outArray;
//}

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
