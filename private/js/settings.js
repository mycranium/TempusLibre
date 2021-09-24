var settingsObj = {
  buttons: document.getElementsByClassName('cssBtn'),
  alertContainers: [document.getElementById("clipAlert"), document.getElementById("alertText")]
};

function Setting() {
  this.style = "lilac";
  this.dateTime = {
    dateStyle: "0",
    clockType: "0",    
    dateOrder: "0",  
    timeFirst: "0",
    dateYear: "0",  
    dateDay: "0",
    dateAbbr: "0",
    datePunct: "0"
  };
}
const dtInputs = {
  clockType: document.getElementsByName('clockType'),
  dateOrder: document.getElementsByName('dateOrder'),
  timeFirst: document.getElementsByName('timeFirst'),
  dateStyle: document.getElementsByName('dateStyle'),
  dateYear: document.getElementsByName('dateYear'),
  datePunct: document.getElementsByName('datePunct'),
  dateDay: document.getElementsByName('dateDay'),
  dateAbbr: document.getElementsByName('dateAbbr')
};
document.body.onload = setButtonHandlers(settingsObj.buttons);
document.body.onload = setupDt(dtInputs);
function setButtonHandlers(btns) {
  var numBtns = btns.length;
  for (var i = 0; i < numBtns; i++) {
    btns[i].addEventListener('click', function () {
      setSetting("style", this.id);
      switch_style(this.id);
    });
  }
}

function setSetting(field, settingValue) { // Converted to use data obj
  let workSettings = data.settings("settings", "get");
  if (!workSettings) {
    var mySettings = new Setting;
    mySettings[field] = settingValue;
    localStorage.setItem('settings', JSON.stringify(mySettings));
    displayAlert(msgObject["saveMsg"], true, settingsObj.alertContainers);
  } else {
    workSettings[field] = settingValue;
    localStorage.setItem('settings', JSON.stringify(workSettings));
    displayAlert(msgObject["saveMsg"], true, settingsObj.alertContainers);

  }
}
function getVal(input) {
  var thisVal = "0";
  input.forEach(v => {
    thisVal = (v.checked) ? v.value : thisVal;
  });
  return thisVal;
}
function getAllVals(obj) {
  var myKeys = Object.keys(obj);
  var setObj = {};
  myKeys.map(k => {
    setObj[k] = getVal(obj[k]);
  });
  return setObj;
}
function setupDt(obj) {
  if (data.settings('dateTime')) {
    let workSettings = data.settings('dateTime', 'get');
    var myKeys = Object.keys(workSettings);
    myKeys.map(k => {
      let storedVal = parseInt(workSettings[k], 10);
      let c = obj[k].length;
      if (c === 1) {
        if (storedVal === 1) {
          obj[k][0].click();
        }
      } else {
        obj[k][storedVal].click();
      }
    });
  }
}
document.getElementById('saveDateTimeBtn').addEventListener('click', function () {
  setSetting('dateTime', getAllVals(dtInputs));
});
document.getElementById('logSettings').addEventListener('click', function () {
  if (data.settings('dateTime')) {
  console.log(getFormattedDate(Date.now()));
  } else {
    console.log("No stored dateTime preferences")
  }
});
