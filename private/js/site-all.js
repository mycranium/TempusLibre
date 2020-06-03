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
  punchStatus: ["You are punched IN", "You are punched OUT"],
  dev: false
};

document.body.onload = setStyleFromStorage();

//
// Style Switcher
//
function setStyleFromStorage() {
  let workSettings = getStoredSettings();
  let css_title = workSettings.style;
  if (css_title.length) {
    switch_style(css_title);
  }
}

function getStoredSettings() { // 
  let workArray = JSON.parse(localStorage.getItem('settings'));
  if (typeof workArray == 'object' && workArray.hasOwnProperty('style')) { // If parsed data is an object and there are more than 0 entries
    return workArray; // Data is as expected. Retun the array of punch objects.
  } else { // Data doesn't contain the correct data type
    return false;
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
  let msgArray = obj;
  let msg = (!stat) ? msgArray[0] : msgArray[1]; // Set a message text
  if (msg == "") return false;
  let newClass = (!stat) ? "failure" : "success"; // determine a new class for the container
  if (containers[0] !== null) {
    let cont = containers[0]; //document.getElementById("clipAlert");
    let alertText = containers[1]; //document.getElementById("alertText");
    var state = 0;
    alertText.textContent = msg; // put the correct text in the p
    cont.classList.toggle(newClass);
    cont.style.display = 'block';
    cont.getBoundingClientRect();
    cont.classList.toggle('in');
    cont.addEventListener('transitionend', function transDone(e) {
      if (e.propertyName == 'top') {
        if (state == 0) {
          window.setTimeout(function () {
            cont.classList.toggle('in');
          }, 1000);
          state = 1;
        } else if (state == 1) {
          cont.style.display = 'none';
          cont.classList.remove(newClass);
          cont.removeEventListener('transitionend', transDone, false);
        }
      }
    });
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
