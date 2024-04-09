// JavaScript Document

const clients = [
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
  const newProject = document.getElementById('projectNew');
  newProject.value = "";
  newProject.disabled = true;
  document.getElementById('projectSel').disabled = true;
  const newJob = document.getElementById('jobNew');
  newJob.value = "";
  newJob.disabled = true;
  document.getElementById('jobSel').disabled = true;
//  document.getElementById('assign').disabled = true;
  //  console.log(level);
  popSelect(level, content);
}

function Job(jobName, jobId) {
  this.name = jobName;
  this.id = jobId;
}

function popSelect(level, content) {
  const selId = level + "Sel";
  const optArr = content.map(v => `<option value=\"${v.name}\">${v.name}</option>`);
  const defArr = [`<option value="default">Select or Add New ${level}</option>`, '<option value="new">Add New</option>'];
  const selector = document.getElementById(selId)
  selector.innerHTML = defArr.concat(optArr).join("\n");
  selector.disabled = false;
}

function enableNextInput(level) {
//console.log(level);
  var thisInput = document.getElementById(level + "New");
  var nextLevel = "";
  if (level == "client") {
    nextLevel = "project";
  } else if (level == "project") {
    nextLevel = "job"
  } else if (level == "job") {
    nextLevel = "done";
  }
  thisInput.disabled = false;
  thisInput.focus();
  thisInput.addEventListener('change', function () {
    if (nextLevel == "done") {
      document.getElementById('assign').disabled = false;
    } else {
      enableNextInput(nextLevel);
    }
  });
}

document.getElementById('clientSel').addEventListener('input', function () {
  if (this.value == "new") { ////////////////////////////
    enableNextInput("client");
  } else { //////////////////////////////
    let theClient = clients.filter(c => c.name == this.value)[0].projects;
    //    console.log(theClient);
    popSelect("project", theClient);
  } ////////////////////////////////////
});


      //level, content
      //get selector value
      //if new enable project input addeventlistener change enable next input
      //else populate next selector and add event litener
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
