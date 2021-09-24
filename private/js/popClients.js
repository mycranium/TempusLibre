// JavaScript Document
document.getElementById('popBtn').addEventListener('click', function () {
      localStorage.setItem('clients', JSON.stringify([{
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
        ]));
      });
