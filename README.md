# portal-quest

A simpe example scene that uses quests

This quest includes some single tasks, a step based task, and stores arbritrary state that gives the game continuity if you come back. It also gives away a POAP reward when the quest is finished.

Check the file `quest-example.json` to see what was uploaded to the quests server to match this scene.

> Note: This quest includes a reward, the reward must be first created in the server with a separate request, and then linked to the quest by id.

## Quest library

### Install

To install the library in a Decentraland scene, run:
`npm i dcl-ecs-quests -B`

Then open your scene’s tsconfig.json file, and add the following to the paths object:

```json
  "dcl-quests-client/quests-client-amd": [
        "./node_modules/dcl-quests-client/quests-client-amd"
      ],
```

Finally, run dcl start or dcl build on your project for all the internal files of the library to get properly built.

Then on your scene’s Typescript files import the library by writing the following:

```ts
import { RemoteQuestTracker } from 'dcl-ecs-quests'
import { ProgressStatus } from 'dcl-quests-client/quests-client-amd'
```

### Initiate a quest tracker

All interactions with the quest server and the quest UI are handled by a quest tracker object.

To initiate a quest tracker, create a new RemoteQuestTracker object, passing at least a quest ID, referencing a quest that’s already created in the quests server.

```ts
async function handleQuests() {
  let client = await new RemoteQuestTracker(
    '4e72efcb-4f92-4eed-ad6b-ec683d42bd76'
  )
}
```

> Note: Since the constructor of RemoteQuestTracker is asynchronous, you should run it inside an async function or an async block. All examples from now on will be assumed to run asynchronously.
