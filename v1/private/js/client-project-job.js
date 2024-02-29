// JavaScript Document

const clients = [
  {
    name: "Unspecified",
    id: 0,
    projects: [{
        name: "Relentless",
        id: 10,
        jobs: [{
            name: "Chapter 1",
            id: 100
          },
          {
            name: "Chapter 2",
            id: 101
          },
          {
            name: "Chapter 3",
            id: 102
          }
        ]
      },
      {
        name: "Home Depot",
        id: 11,
        jobs: [{
            name: "Turf Builder",
            id: 103
          },
          {
            name: "Kitchen Tile",
            id: 104
          },
          {
            name: "Appliances",
            id: 105
          }
        ]
      },
      {
        name: "Quarantine",
        id: 12,
        jobs: [{
            name: "Ghostbusters",
            id: 106
          },
          {
            name: "Workouts",
            id: 107
          },
          {
            name: "Masks",
            id: 108
          }
        ]
      }
    ]
  },
  {
    name: "Tesh",
    id: 0,
    projects: [{
        name: "Relentless",
        id: 10,
        jobs: [{
            name: "Chapter 1",
            id: 100
          },
          {
            name: "Chapter 2",
            id: 101
          },
          {
            name: "Chapter 3",
            id: 102
          }
        ]
      },
      {
        name: "Home Depot",
        id: 11,
        jobs: [{
            name: "Turf Builder",
            id: 103
          },
          {
            name: "Kitchen Tile",
            id: 104
          },
          {
            name: "Appliances",
            id: 105
          }
        ]
      },
      {
        name: "Quarantine",
        id: 12,
        jobs: [{
            name: "Ghostbusters",
            id: 106
          },
          {
            name: "Workouts",
            id: 107
          },
          {
            name: "Masks",
            id: 108
          }
        ]
      }
    ]
  },
  {
    name: "John",
    id: 1,
    projects: [{
        name: "John Tells All",
        id: 20,
        jobs: [{
            name: "Fast Devops",
            id: 200
          },
          {
            name: "Minimizing Lag-Gap",
            id: 201
          },
          {
            name: "Branding",
            id: 202
          }
        ]
      },
      {
        name: "The Five Symbols",
        id: 21,
        jobs: [{
            name: "Graphics",
            id: 203
          },
          {
            name: "Proofreading",
            id: 204
          },
          {
            name: "Layout",
            id: 205
          }
        ]
      }
    ]
  },
  {
    name: "Mike",
    id: 2,
    projects: [{
        name: "Tempus Libre",
        id: 30,
        jobs: [{
            name: "Programming",
            id: 300
          },
          {
            name: "Styling",
            id: 301
          },
          {
            name: "HTML",
            id: 302
          }
        ]
      },
      {
        name: "Text Animators",
        id: 31,
        jobs: [{
            name: "Writing",
            id: 303
          },
          {
            name: "Recording",
            id: 304
          },
          {
            name: "Animating",
            id: 305
          }
        ]
      },
      {
        name: "Unity",
        id: 32,
        jobs: [{
            name: "Save My Baby",
            id: 306
          },
          {
            name: "Ruby Rocket",
            id: 307
          },
          {
            name: "Wiener Drag",
            id: 308
          }
        ]
      }
    ]
  }
]

document.body.onload = setupPage("client", clients);
//document.body.onload = popSelect("project", clients[0].projects);
//document.body.onload = popSelect("job", clients[0].projects[0].jobs);
function setupPage(level, content) {
  const newClient = document.getElementById('clientNew');
  newClient.value = "";
  newClient.disabled = true;
  const newProject = document.getElementById('projectsNew');
  newProject.value = "";
  newProject.disabled = true;
  document.getElementById('projectsSel').disabled = true;
  const newJob = document.getElementById('jobsNew');
  newJob.value = "";
  newJob.disabled = true;
  document.getElementById('jobsSel').disabled = true;
//  document.getElementById('assign').disabled = true;
  //  console.log(level);
  popSelect(level, content);
}

function Job(jobName, jobId) {
  this.name = jobName;
  this.id = jobId;
}

function popSelect(level, content) {
  let selId = level + "Sel";
  let optArr = content.map(v => `<option class=\"dynamic\" value=\"${v.name}\">${v.name}</option>`);
  let defArr = [`<option value="default">Select or Add New ${level}</option>`, '<option value="new">Add New</option>'];
  let selector = document.getElementById(selId)
  selector.innerHTML = defArr.concat(optArr).join("\n");
  selector.disabled = false;
  addListeners(level);
}

function enableNextInput(level) {
  var thisInput = document.getElementById(level + "New");
  var nextLevel = "";
  var thirdLevel = ""
  if (level == "client") {
    nextLevel = "projects";
    thirdLevel = "jobs";
  } else if (level == "projects") {
    nextLevel = "jobs"
    thirdLevel = "done";
  } else if (level == "jobs") {
    nextLevel = "done";
  }
  thisInput.disabled = false;
  if (nextLevel != "done") {
    let nextSel = document.querySelector('#' + nextLevel + "Sel");
    let dels = nextSel.getElementsByClassName('dynamic');
    nextSel.disabled = true;
    let delLen = dels.length;
    for (d = 0; d < delLen; d++) {
      dels[0].remove();
    }
    if (level == "client") {
      let thirdSel = document.querySelector('#' + thirdLevel + "Sel");
      let sels = thirdSel.getElementsByClassName('dynamic');
      thirdSel.disabled = true;
      let selLen = sels.length;
      for (s = 0; s < selLen; s++) {
        sels[0].remove();
      }
    }
  }
  thisInput.focus();
  thisInput.addEventListener('change', function () {
    if (nextLevel == "done") {
      document.getElementById('assign').disabled = false;
    } else {
      enableNextInput(nextLevel);
    }
  });
}

function addListeners(elemName) {
  let elemID = elemName + "Sel";
  document.getElementById(elemID).addEventListener('input', function () {
    if (this.value == "new") {
      enableNextInput(this.name);
    } else if (elemName != "jobs") {
      let nextName;
      var theList;
      if (this.name === "client") {
        nextName = "projects";
        theList = clients.filter(c => c.name == this.value)[0].projects;
      } else if (this.name === "projects") {
        let pjct = document.getElementById("clientSel").value;
        let pjctList = clients.filter(c => c.name == pjct)[0].projects;
        theList = pjctList.filter(p => p.name == this.value)[0].jobs;
        nextName = "jobs";
      }
      popSelect(nextName, theList);
    }
    let myNew = document.getElementById(elemName + "New");
    myNew.value="";
    myNew.disabled=true;
  });
}

/*document.getElementById('clientSel').addEventListener('input', function () {
  if (this.value == "new") { ////////////////////////////
    enableNextInput("client");
  } else { //////////////////////////////
    let theClient = clients.filter(c => c.name == this.value)[0].projects;
    //    console.log(theClient);
    popSelect("project", theClient);
  } ////////////////////////////////////
});*/


      //level, content
      //get selector value
      //if new enable project input addeventlistener change enable next input
      //else populate next selector and add event listener
      //if level != job recurse
      // if new function enable next input and add event listener
      // else populate next selector and enable it

      //if client txtsrc = input then all entries are new
      ////get data
      ////count clients
      ////create jobs array
      ////generate job with new id
      ////add to jobs array
      ////create proj array
      ////add proj with new id, jobs array
      ////add client with new id, projects array
      ////store data
      //else if project txtsrc = input then proj & job are new, client exists
      ////get data
      ////get client
      ////count projects store num
      ////create jobs array
      ////generate job with new id
      ////add to jobs array
      ////add proj with new id, jobs array
      ////add to client projects array
      ////store data
      // else job txtsrc = input then job is new, client & proj exist
      ////get data
      ////get client
      ////get project
      ////count jobs
      ////generate job with new id
      ////add to jobs array
      ////store data
      //else all exist


      //gather client,project/job entries
      //
      //function Punch(punch_Id, inPunch) { // Definition for Punch object
      //  this.punchId = punch_Id;
      //  this.inTime = inPunch;
      //  this.outTime = "Unassigned";
      //  this.client = 'Unassigned';
      //  this.project = 'Unassigned';
      //  this.job = 'Unassigned';
      //  this.status = 'Out';
      //}
