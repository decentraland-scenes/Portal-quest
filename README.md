# portal-quest
 A simpe example scene that uses quests
 
 This quest includes some single tasks, a step based task, and stores arbritrary state that gives the game continuity if you come back. It also gives away a POAP reward when the quest is finished.
 
 
 
 Quest structure:
 
 ´´´
 {
 id: "4e72efcb-4f92-4eed-ad6b-ec683d42bd76",
 name: "Portal puzzle reloaded",
 description: "A super tough puzzle thing",
 thumbnailEntry: "https://github.com/decentraland-scenes/Block-dog/blob/master/screenshot/screenshot.png?raw=true",
 thumbnailBanner: "https://github.com/decentraland-scenes/Block-dog/blob/master/screenshot/screenshot.png?raw=true",
 requirements: [ ],
 active: true,
 visibility: "visible",
 deletedAt: null,
 tasks: 
  [
   {
    id: "1ebb22a0-186f-4215-b39e-64fb31936dd7",
    description: "Pick up gun",
    coordinates: "-133,-40",
    required: true,
    section: "Easy",
    progressMode: 
     {
      type: "single"
     },
    requirements: [ ],
    validations: [ ],
    deletedAt: null,
    previousTask: null,
    rewards: [ ],
    steps: [ ],
   },
   {
    id: "ce7424a5-e893-4a5d-b059-24506d6e4cf6",
    description: "Create a wormhole",
    coordinates: "-133,-40",
    required: true,
    section: "Hard... ish",
    progressMode: 
     {
      type: "step-based",
      unit: "portals",
     },
    requirements: 
     [
      {
       type: "completedPrevious"
      }
     ],
    validations: [ ],
    deletedAt: null,
    previousTask: 
     {
      id: "1ebb22a0-186f-4215-b39e-64fb31936dd7",
      description: "Pick up gun",
      coordinates: "-133,-40",
      required: true,
      section: "Easy",
      progressMode: 
       {
        type: "single"
       },
      requirements: [ ],
      validations: [ ],
      deletedAt: null,
     },
    rewards: [ ],
    steps: 
     [
      {
       id: "ff41c163-4097-4b3f-8733-2aa24ffa3b1e",
       validations: [ ],
       description: null,
       deletedAt: null,
      },
      {
       id: "932b3603-f1df-4183-bd19-cc59bee31adb",
       validations: [ ],
       description: null,
       deletedAt: null,
      },
     ],
   },
   {
    id: "19866889-b356-47d5-a555-c4dfda300708",
    description: "Get Key High Up",
    coordinates: "-133,-40",
    required: true,
    section: "Hard... ish",
    progressMode: 
     {
      type: "single"
     },
    requirements: 
     [
      {
       type: "completedPrevious"
      }
     ],
    validations: [ ],
    deletedAt: null,
    previousTask: 
     {
      id: "ce7424a5-e893-4a5d-b059-24506d6e4cf6",
      description: "Create a wormhole",
      coordinates: "-133,-40",
      required: true,
      section: "Hard... ish",
      progressMode: 
       {
        type: "step-based",
        unit: "portals",
       },
      requirements: 
       [
        {
         type: "completedPrevious"
        }
       ],
      validations: [ ],
      deletedAt: null,
     },
     rewards: [ ],
     steps: [ ],
    },
   {
    id: "af02dd74-07fe-4db9-8f8f-ee1e3dac6313",
    description: "Get key on ground",
    coordinates: "-133,-40",
    required: true,
    section: "Easy",
    progressMode: 
     {
      type: "single"
     },
    requirements: [ ],
    validations: [ ],
    deletedAt: null,
    previousTask: null,
    rewards: [ ],
    steps: [ ],
    },
   ],
   rewards: 
    [
     {
     id: "1addb24b-64ab-4632-bab1-b91905baab53",
     type: "poap",
     name: "mypoap",
     metadata: { },
     deletedAt: null,
     imageUrl: "https://storage.googleapis.com/poapmedia/decentraland-1st-anniversary-party-2021-logo-1613742619448.png",
     flow: 
      {
       id: "12768e40-d541-4cfe-9b97-c12916d522e6",
       type: "poap",
       serverBaseUrl: null,
       deletedAt: null,
       campaingKey: null,
       event: "wtfrnfts1",
      },
     }
   ],
},
´´´
