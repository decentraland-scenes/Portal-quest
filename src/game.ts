import { DummyEnt, Portal, PortalColor } from './portal'
import { Card } from './card'
import { Gun } from './gun'
import { Sound } from './sound'
import * as utils from '@dcl/ecs-scene-utils'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { RemoteQuestTracker } from '@dcl/ecs-quests'
import { ProgressStatus } from 'dcl-quests-client/quests-client-amd'
import { query } from '@dcl/quests-query'

// Base
const base = new Entity()
base.addComponent(new GLTFShape('models/baseLight.glb'))
engine.addEntity(base)

// Walls
const walls = new Entity()
walls.addComponent(new GLTFShape('models/walls.glb'))
walls.addComponent(new Transform())
engine.addEntity(walls)

// Sounds
const teleportSound = new Sound(new AudioClip('sounds/teleport.mp3'))
const portalSuccessSound = new Sound(new AudioClip('sounds/portalSuccess.mp3'))
const portalFailSound = new Sound(new AudioClip('sounds/portalFail.mp3'))

// Portals
const portalOrange = new Portal(new GLTFShape('models/portalOrange.glb'))
const portalBlue = new Portal(new GLTFShape('models/portalBlue.glb'))
const DELAY_TIME = 1500 // In milliseconds
const RESET_SIZE = 2 // In meters

export enum taskIds {
  pickKey1 = 'af02dd74-07fe-4db9-8f8f-ee1e3dac6313',
  pickGun = '1ebb22a0-186f-4215-b39e-64fb31936dd7',
  makePortal = 'ce7424a5-e893-4a5d-b059-24506d6e4cf6',
  pickKey2 = '19866889-b356-47d5-a555-c4dfda300708',
}

export enum stepIds {
  blue = '932b3603-f1df-4183-bd19-cc59bee31adb',
  orange = 'ff41c163-4097-4b3f-8733-2aa24ffa3b1e',
}

let triggerBox = new utils.TriggerBoxShape(
  new Vector3(RESET_SIZE, RESET_SIZE, RESET_SIZE),
  Vector3.Zero()
)

portalBlue.addComponent(
  new utils.TriggerComponent(triggerBox, {
    onCameraEnter: () => {
      if (portalOrange.active) {
        teleportSound.getComponent(AudioSource).playOnce()
        movePlayerTo(
          portalOrange.getComponent(Transform).position,
          portalOrange.cameraTarget
        )
        triggerBox.size.setAll(0) // Resize the trigger so that the player doesn't port in and out constantly
        portalOrange.addComponentOrReplace(
          new utils.Delay(DELAY_TIME, () => {
            triggerBox.size.setAll(RESET_SIZE)
          })
        ) // Reset the trigger after 1.5 seconds
        portalBlue.addComponentOrReplace(
          new utils.Delay(DELAY_TIME, () => {
            triggerBox.size.setAll(RESET_SIZE)
          })
        )
      }
    },
  })
)
portalOrange.addComponent(
  new utils.TriggerComponent(triggerBox, {
    onCameraEnter: () => {
      if (portalBlue.active) {
        teleportSound.getComponent(AudioSource).playOnce()
        movePlayerTo(
          portalBlue.getComponent(Transform).position,
          portalBlue.cameraTarget
        )
        triggerBox.size.setAll(0)
        portalOrange.addComponentOrReplace(
          new utils.Delay(DELAY_TIME, () => {
            triggerBox.size.setAll(RESET_SIZE)
          })
        )
        portalBlue.addComponentOrReplace(
          new utils.Delay(DELAY_TIME, () => {
            triggerBox.size.setAll(RESET_SIZE)
          })
        )
      }
    },
  })
)

// Controls
const input = Input.instance
let activePortal = PortalColor.Blue

input.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, async (event) => {
  if (gun.hasGun) {
    //if (event.hit.meshName.match('lightWall_collider')) {
    // Only allow portals to appear on light walls
    if (event.hit.entityId != '' && event.hit.length < 30) {
      let offset = Vector3.Normalize(
        Camera.instance.position.clone().subtract(event.hit.hitPoint.clone())
      ).scale(0.1)

      let finalPosition = event.hit.hitPoint.add(offset)

      let dummy = new DummyEnt(finalPosition, event.hit.normal)

      portalSuccessSound.getComponent(AudioSource).playOnce()

      if (activePortal == PortalColor.Blue) {
        portalBlue.spawn(
          dummy.getComponent(Transform).position,
          dummy.getComponent(Transform).rotation,
          dummy.cameraTarget
        )
        let transform = portalBlue.getComponent(Transform)

        await client.makeProgress(taskIds.makePortal, {
          type: 'step-based',
          stepStatus: ProgressStatus.COMPLETED,
          stepId: stepIds.blue,
          arbitraryStateChanges: [
            {
              set: {
                bluePortal: {
                  position: {
                    x: transform.position.x,
                    y: transform.position.y,
                    z: transform.position.z,
                  },
                  rotation: {
                    x: transform.rotation.x,
                    y: transform.rotation.y,
                    z: transform.rotation.z,
                    w: transform.rotation.w,
                  },
                  cameraTarget: {
                    x: dummy.cameraTarget.x,
                    y: dummy.cameraTarget.y,
                    z: dummy.cameraTarget.z,
                  },
                },
              },
            },
          ],
        })
      } else {
        portalOrange.spawn(
          dummy.getComponent(Transform).position,
          dummy.getComponent(Transform).rotation,
          dummy.cameraTarget
        )

        let transform = portalOrange.getComponent(Transform)

        await client.makeProgress(taskIds.makePortal, {
          type: 'step-based',
          stepStatus: ProgressStatus.COMPLETED,
          stepId: stepIds.orange,
          arbitraryStateChanges: [
            {
              set: {
                orangePortal: {
                  position: {
                    x: transform.position.x,
                    y: transform.position.y,
                    z: transform.position.z,
                  },
                  rotation: {
                    x: transform.rotation.x,
                    y: transform.rotation.y,
                    z: transform.rotation.z,
                    w: transform.rotation.w,
                  },
                  cameraTarget: {
                    x: dummy.cameraTarget.x,
                    y: dummy.cameraTarget.y,
                    z: dummy.cameraTarget.z,
                  },
                },
              },
            },
          ],
        })
      }
    } else {
      portalFailSound.getComponent(AudioSource).playOnce()
    }
  }
})

// Swap between portal colors when pressing the E key
input.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (): void => {
  if (activePortal == PortalColor.Blue) {
    activePortal = PortalColor.Orange
    gunBlueGlow.getComponent(Transform).scale.setAll(0)
    gunOrangeGlow.getComponent(Transform).scale.setAll(1)
  } else {
    activePortal = PortalColor.Blue
    gunBlueGlow.getComponent(Transform).scale.setAll(1)
    gunOrangeGlow.getComponent(Transform).scale.setAll(0)
  }
})

let client: RemoteQuestTracker

export async function handleQuests() {
  //let q = await getQuests()

  client = await new RemoteQuestTracker('4e72efcb-4f92-4eed-ad6b-ec683d42bd76')

  const q = await client.getCurrentStatePromise()
  //let q = await client.refresh()
  log('QUEST ', q)

  if (q.progressStatus == ProgressStatus.NOT_STARTED) {
    client.startQuest()
  }

  gun = new Gun(
    new GLTFShape('models/portalGun.glb'),
    new Transform({ position: new Vector3(8, 1.5, 4.5) }),
    gunBlueGlow,
    gunOrangeGlow,
    client
  )

  if (q.progressStatus != ProgressStatus.COMPLETED) {
    // for (let task of q.tasks) {
    //   if (
    //     task.id == '1ebb22a0-186f-4215-b39e-64fb31936dd7' &&
    //     task.progressStatus == ProgressStatus.COMPLETED
    //   ) {
    //     log('already has gun')
    //     hasGun = true
    //   } else if (
    //     task.id == 'af02dd74-07fe-4db9-8f8f-ee1e3dac6313' &&
    //     task.progressStatus == ProgressStatus.COMPLETED
    //   ) {
    //     log('already has key')
    //     hasKey1 = true
    //   } else if (
    //     task.id == '19866889-b356-47d5-a555-c4dfda300708' &&
    //     task.progressStatus == ProgressStatus.COMPLETED
    //   ) {
    //     log('already has key')
    //     hasKey2 = true
    //   }
    // }

    // if already has gun
    if (query(q).isTaskCompleted(taskIds.pickGun)) {
      gun.pickUp()
    }

    // if key not yet collected
    if (!query(q).isTaskCompleted(taskIds.pickKey1)) {
      const card = new Card(
        new GLTFShape('models/card.glb'),
        new Transform({ position: new Vector3(12, 1.5, 4.5) }),
        client,
        taskIds.pickKey1
      )
    }

    if (!query(q).isTaskCompleted(taskIds.pickKey2)) {
      const card = new Card(
        new GLTFShape('models/card.glb'),
        new Transform({ position: new Vector3(8, 6.75, 13.5) }),
        client,
        taskIds.pickKey2
      )
    }
  }

  // if portals already set
  if (q.arbitraryState.bluePortal) {
    portalBlue.spawn(
      new Vector3(
        q.arbitraryState.bluePortal.position.x,
        q.arbitraryState.bluePortal.position.y,
        q.arbitraryState.bluePortal.position.z
      ),
      new Quaternion(
        q.arbitraryState.bluePortal.rotation.x,
        q.arbitraryState.bluePortal.rotation.y,
        q.arbitraryState.bluePortal.rotation.z,
        q.arbitraryState.bluePortal.rotation.w
      ),
      new Vector3(
        q.arbitraryState.bluePortal.cameraTarget.x,
        q.arbitraryState.bluePortal.cameraTarget.y,
        q.arbitraryState.bluePortal.cameraTarget.z
      )
    )
  }

  if (q.arbitraryState.orangePortal) {
    portalOrange.spawn(
      new Vector3(
        q.arbitraryState.orangePortal.position.x,
        q.arbitraryState.orangePortal.position.y,
        q.arbitraryState.orangePortal.position.z
      ),
      new Quaternion(
        q.arbitraryState.orangePortal.rotation.x,
        q.arbitraryState.orangePortal.rotation.y,
        q.arbitraryState.orangePortal.rotation.z,
        q.arbitraryState.orangePortal.rotation.w
      ),
      new Vector3(
        q.arbitraryState.orangePortal.cameraTarget.x,
        q.arbitraryState.orangePortal.cameraTarget.y,
        q.arbitraryState.orangePortal.cameraTarget.z
      )
    )
  }
}

// Gun
const gunBlueGlow = new Entity()
gunBlueGlow.addComponent(new Transform())
gunBlueGlow.addComponent(new GLTFShape('models/portalGunBlueGlow.glb'))
const gunOrangeGlow = new Entity()
gunOrangeGlow.addComponent(new Transform())
gunOrangeGlow.addComponent(new GLTFShape('models/portalGunOrangeGlow.glb'))
gunOrangeGlow.getComponent(Transform).scale.setAll(0) // Hide orange glow

let gun: Gun

handleQuests()
