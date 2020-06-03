// JavaScript Document

const dm = {
  deleteBtn: document.getElementById('delete'),
  delModal: document.getElementById('deleteModal'),
  delPrompt: document.getElementById('deletePrompt'),
  delText: document.getElementById("confText"),
  confirmBtn: document.getElementById('confBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  confPrompt: document.getElementById('confPrompt'),
  confText: document.getElementById('confText')
};

dm.deleteBtn.addEventListener('click', displayConf);

function displayConf() {
  var dMod = dm.delModal;
  var dPrmp = dm.delPrompt;
  var cfBtn = dm.confirmBtn;
  var cnBtn = dm.cancelBtn;
  var cPrmp = dm.confPrompt;
  var stat = false;

  dMod.style.display = 'flex'; // set modal container to display block
  dMod.getBoundingClientRect(); //reflow
  dMod.classList.add('in'); //add target animation class
  dMod.addEventListener('transitionend', function dModEnd(e) { //add event listener to container transitionend
    if (e.propertyName == 'opacity') { //when ended if property match and stat false
      if (!stat) { // add event listeners to conf/canc buttons and set stat = true
        cnBtn.addEventListener('click', function cancelButton() { //CANCEL button
          dMod.classList.remove('in'); // remove in class from container >> hands back to transend event listener
          dPrmp.classList.add('out');
          stat = true;
          cnBtn.removeEventListener('click', cancelButton, false);
        }); //end cnBtn listenetr func
        cfBtn.addEventListener('click', function confirmButton() {
          //localStorage.removeItem('punches'); // delete punches
          dPrmp.classList.add('out'); // add 'out' class to dPrmp to fade it out
          dPrmp.addEventListener('transitionend', function dPrmpEnd(e) {
            if (e.propertyName == 'opacity') {
              cPrmp.classList.add('in');
              cPrmp.addEventListener('transitionend', function cPrmpEnd(e) {
                if (e.propertyName == 'opacity') {
                  window.setTimeout(function () {
                    cPrmp.classList.remove('in');
                    dMod.classList.remove('in'); // remove in class from container >> hands back to transend event listener
                    stat = true;
                    cPrmp.removeEventListener('transitionend', cPrmpEnd, false);
                    dPrmp.removeEventListener('transitionend', dPrmpEnd, false);
                    cfBtn.removeEventListener('click', confirmButton, false);
                  }, 1500);
                }
              }); // end cprmp transednd event listener
            }
          }); // end dprmp transednd event listener
        }); //end cfBtn listenetr func
      } else {
        dMod.style.display = 'none';
        dPrmp.classList.remove('out');
        dMod.removeEventListener('transitionend', dModEnd, false);
      } // end stat if
    } // end propertymatch if
  });
}
