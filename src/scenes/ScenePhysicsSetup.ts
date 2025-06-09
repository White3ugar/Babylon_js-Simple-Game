// import { Scene, Mesh, Vector3, PhysicsAggregate, PhysicsImpostor, MeshBuilder, StandardMaterial, Color3, Ray} from "@babylonjs/core";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
// import {onKeyboardEvent, visibleInInspector } from "./decorators";
import { fromChildren, onKeyboardEvent, visibleInInspector } from "./decorators";
import { Node } from "@babylonjs/core/node";
import * as BABYLON from "@babylonjs/core";
import * as GUI from '@babylonjs/gui'
import "@babylonjs/loaders"; // This registers the GLTF/GLB loader

/**
 * This represents a script that is attached to a node in the editor.
 * Available nodes are:
 *      - Meshes
 *      - Lights
 *      - Cameras
 *      - Transform nodes
 * 
 * You can extend the desired class according to the node type.
 * Example:
 *      export default class MyMesh extends Mesh {
 *          public onUpdate(): void {
 *              this.rotation.y += 0.04;
 *          }
 *      }
 * The function "onInitialize" is called immediately after the constructor is called.
 * The functions "onStart" and "onUpdate" are called automatically.
 */
export default class ScenePhysicsSetup extends BABYLON.TransformNode {
    
    // @visibleInInspector("Node", "Player")
    // private playerMesh: Mesh;
    // @visibleInInspector("Node", "Ground")
    // private groundMesh: Mesh;
    // private playerAggregate: PhysicsAggregate;
    //private scene: Scene;
    @visibleInInspector("Node", "Wreckage")
    private Wreckage: BABYLON.Mesh;
    @visibleInInspector("Node", "Ground")
    private ground: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    private ringUIMap = new Map<BABYLON.Mesh, GUI.Control[]>();
    private CatRingMap = new Map<BABYLON.Mesh, BABYLON.Mesh>();
    public static Instance: ScenePhysicsSetup;

    

    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    protected constructor() { }

    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    public onInitialize(): void {
        // ...
    }

    /**
     * Called on the node has been fully initialized and is ready.
     */
    public onInitialized(): void {
        // ...
    }

    /**
     * Called on the scene starts.
     */
    public onStart(): void {

        ScenePhysicsSetup.Instance = this;
        this.scene = this.ground.getScene();
        this.scene.lights.forEach(light => {
        if ('shadowEnabled' in light) {
            light.shadowEnabled = true;
            
            
        }
    });
        // this.Wreckage.physicsImpostor = new PhysicsImpostor(
        //     this.Wreckage,
        //     PhysicsImpostor.MeshImpostor,
        //     {
        //         mass: 0,
        //         friction:1,
        //         restitution:0
        //     },
        //     this.scene
        // );
        
        this.spawnRings(20);
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        // ...
    }

    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    public onStop(): void {
        // ...
    }
    

    /**
     * Called on a message has been received and sent from a graph.
     * @param name defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    public onMessage(name: string, data: any, sender: any): void {
        switch (name) {
            case "removeRing":
                // Do something...
                const mesh = data as BABYLON.Mesh;
                // const catRing = this.CatRingMap.get(mesh);
                // const gui = this.ringUIMap.get(catRing);

                // if (gui) {
                //     gui.forEach(control => control.dispose());
                //     this.ringUIMap.delete(catRing);
                // }

                // if (catRing) {
                //     this.CatRingMap.delete(mesh);
                //     catRing.dispose();
                // }
                setTimeout(() => {
                    mesh.dispose();
                }, 2200);
                break;
        }
    }

    private async spawnRings(count: number): Promise<void> {
    //const bounds = 50; // Adjust this based on your terrain size
    this.ground.computeWorldMatrix(true);
    this.ground.refreshBoundingInfo();
    const boundingInfo = this.ground.getBoundingInfo();
    const min = boundingInfo.boundingBox.minimumWorld;
    //const min = new BABYLON.Vector3(-20, 0, -150);
    //const max = new BABYLON.Vector3(20, 0, 150);
    const max = boundingInfo.boundingBox.maximumWorld;
    console.log("Ground Bounds:", min, max);

    const ringPrefab = BABYLON.MeshBuilder.CreateTorus("ring", {
        diameter: 1.5,
        thickness: 0.1,
        tessellation: 24,
    }, this.scene);

    // const catPrefab = BABYLON.SceneLoader.ImportMeshAsync(
    //     "",
    //     "./assets/Cat/",
    //     "cat.glb",
    //     this.scene
    // );
    let catPrefab;
    let catRoot;
    let scene = this.getScene();
        await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            "assets/Cat/",
            "cat.glb",
            this.scene
        ).then((result) => {
            console.log("Import success:", result);
            catRoot = new BABYLON.TransformNode("catRoot", scene);
            result.meshes.forEach((mesh) => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.parent = catRoot;
                }
            });

            const scale = 0.006;
            catRoot.scaling = new BABYLON.Vector3(scale,scale,scale); // ⬅️ Scale down the prefab
            catRoot.position = new BABYLON.Vector3(0, 5.4, 0); // Center the prefab
            catRoot.rotationQuaternion = BABYLON.Quaternion.Identity(); // Reset rotation
            catRoot.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(90, 90, 0); // Rotate 180 degrees around Y-axis
            
            catPrefab = catRoot;
            catPrefab.setEnabled(false);

            // ✅ Log the value here
            console.log("catPrefab:", catPrefab);
        }).catch((error) => {
            console.error("ImportMeshAsync failed:", error);
        });

        // const result = await BABYLON.SceneLoader.ImportMeshAsync(
        // "",
        // "assets/Cat/",
        // "cat (2).glb",
        // scene
        // );
        // console.log("Import success:", result);
    

    const material = new BABYLON.StandardMaterial("ringMat", this.scene);
    material.diffuseColor = BABYLON.Color3.Random();
    material.emissiveColor = BABYLON.Color3.White();
    ringPrefab.material = material;
    ringPrefab.setEnabled(false);

    // Create full-screen UI only once
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    for (let i = 0; i < count; i++) {
        const x = Math.random() * (max.x - min.x) + min.x;
        const z = Math.random() * (max.z - min.z) + min.z;

        // Cast a ray downward to find height
        const ray = new BABYLON.Ray(new BABYLON.Vector3(x, 500, z), BABYLON.Vector3.Down(), 1000);
        const hit = this.scene.pickWithRay(ray, (mesh) => mesh === this.ground);
        console.log(`T1rying position: x=${x.toFixed(2)} z=${z.toFixed(2)}`);

        if (hit?.hit && hit.pickedPoint) {
            console.log("Hit at:", hit.pickedPoint);

            const y = hit.pickedPoint.y + 0.4; // Slightly above ground
            //const ringInstance = ringPrefab.clone(`ringInstance_${i}`);

            
            const catClone = catPrefab.clone("catClone" + i);

            catClone.setEnabled(true); // Make sure the clone is visible
            // Apply shadows
            catClone.getChildMeshes().forEach((mesh) => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.isVisible = true;
                    mesh.alwaysSelectAsActiveMesh = true;
                    mesh.receiveShadows = true;
                    if (mesh.material instanceof BABYLON.PBRMaterial) {
                        mesh.material.directIntensity = 10;
                    }
                }
            });

            //ringInstance.position = new BABYLON.Vector3(x, y, z);
            catClone.position = new BABYLON.Vector3(x, y, z); // Position cat slightly above the ring
            //ringInstance.setEnabled(true);

            // // Rectangle label
            // const rect = new GUI.Rectangle();
            // rect.width = 0.2;
            // rect.height = "40px";
            // rect.cornerRadius = 20;
            // rect.color = "Orange";
            // rect.thickness = 4;
            // rect.background = "green";
            // advancedTexture.addControl(rect);
            // rect.linkWithMesh(ringInstance);
            // rect.linkOffsetY = -150;
            // rect.isVisible = true;

            // const label = new GUI.TextBlock();
            // label.text = "Pick";
            // rect.addControl(label);

            // // Ellipse marker
            // const ellipse = new GUI.Ellipse();
            // ellipse.width = "40px";
            // ellipse.height = "40px";
            // ellipse.color = "Orange";
            // ellipse.thickness = 4;
            // ellipse.background = "green";
            // advancedTexture.addControl(ellipse);
            // ellipse.linkWithMesh(ringInstance);
            // ellipse.isVisible = true;

            // // Line between ellipse and rectangle
            // const line = new GUI.Line();
            // line.lineWidth = 4;
            // line.color = "Orange";
            // line.y2 = 20;
            // line.linkOffsetY = -20;
            // advancedTexture.addControl(line);
            // line.linkWithMesh(ringInstance);
            // line.connectedControl = rect;
            // line.isVisible = true;

            // const guiControls = [rect, label, ellipse, line];
            // this.ringUIMap.set(ringInstance, guiControls);
            // this.CatRingMap.set(catClone, ringInstance);

        }else{
            console.warn("No hit for ray at:", x, z);
        }
    }

    // Optional: remove the original ring prefab
    ringPrefab.dispose();
    catPrefab.dispose();
    }

}
