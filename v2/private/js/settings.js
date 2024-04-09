var settingsObj = {
  buttons: document.getElementsByClassName('cssBtn'),
  alertContainers: [document.getElementById("clipAlert"), document.getElementById("alertText")]
};

function Setting() {
  this.style = "lilac";
  this.clock = "24";
  this.dateFmt = "ymd";
}

document.body.onload = setButtonHandlers(settingsObj.buttons);

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
  let workSettings = data.settings("get");
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