// JavaScript Document
var pv = {
  copyCont: document.getElementById("toCopy"),
  copyBtn: document.getElementById("copyToClip"),
  latest: document.getElementById("viewLatest"),
  all: document.getElementById("viewAll"),
  clear: document.getElementById("clearDisplay"),
  sortDate: document.getElementById("sortDate"),
  sortClient: document.getElementById("sortClient"),
  dateOrderDir: document.getElementById("dateOrder"),
  clientOrderDir: document.getElementById("clientOrder"),
  tableCont: document.getElementById("tableContainer"),
  listCont: document.getElementById("listContainer"),
  alertContainers: [document.getElementById("clipAlert"), document.getElementById("alertText")]
};

document.body.onload = setupViewPage();

function setupViewPage() { // THIS PAGE ONLY Converted to use data object
  //  pv.sortDate.disabled = true;
  //  pv.sortClient.disabled = true;
  //  pv.copyBtn.disabled = true;
  if (!data.hasPunches()) {
    if (msgObject.dev) displayAlert(msgObject["noPunchesMsg"], false, pv.alertContainers);
    clearDisplays(pv);
    return false;
  } else {
    pv.latest.disabled = false;
    pv.all.disabled = false;
  }
}

pv.all.addEventListener('click', function () { // Retrieve and display the localStorage data
  getAndShowPunches(pv, "time", "all");
});

pv.latest.addEventListener('click', function () {
  getAndShowPunches(pv, "time", "latest");
  //  pv.sortDate.disabled = true;
  //  pv.sortClient.disabled = true;
});

pv.clear.addEventListener('click', function () {
  clearDisplays(pv);
  pv.copyBtn.disabled = true;
  pv.clear.disabled = true;
  pv.all.disabled = false;
  pv.sortDate.disabled = true;
  pv.sortClient.disabled = true;
});

pv.sortDate.addEventListener('click', function () {
  getAndShowPunches(pv, "time", "all");
});

pv.sortClient.addEventListener('click', function () {
  getAndShowPunches(pv, "client", "all");
});

pv.copyBtn.addEventListener('click', function () {
  var el = pv.copyCont;
  navigator.clipboard.writeText(el.innerHTML).then(function () {
    displayAlert(msgObject["dataCopied"], true, pv.alertContainers);
  }, function () {
    displayAlert(msgObject["dataCopied"], false, pv.alertContainers);
  });
});
