// JavaScript Document

var dBucket = document.querySelector('#debug');
var kBucket = document.querySelector('#kebug');

var dbtn = document.querySelector('#delete');
var sbtn = document.querySelector('#show');
var sabtn = document.querySelector('#showAll');

sbtn.addEventListener('click', function (){
  let inStore = localStorage.getItem('punches');
  dBucket.textContent = inStore;
});

dbtn.addEventListener('click', function (){
  localStorage.clear();
  dBucket.textContent = "Data";
});
sabtn.addEventListener('click', function (){
  let len = localStorage.length;
  kBucket.textContent = "";
  /*for (var key in localStorage){
    kBucket.textContent += key;
}*/

  for (var i = 0; i < len; i++ ) {
    kBucket.textContent += localStorage.key( i ); 
    kBucket.textContent += "; ";
}
});

/**/