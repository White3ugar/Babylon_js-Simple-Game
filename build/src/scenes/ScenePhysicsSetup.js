"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {onKeyboardEvent, visibleInInspector } from "./decorators";
var decorators_1 = require("./decorators");
var BABYLON = require("@babylonjs/core");
var GUI = require("@babylonjs/gui");
require("@babylonjs/loaders"); // This registers the GLTF/GLB loader
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
var ScenePhysicsSetup = /** @class */ (function (_super) {
    __extends(ScenePhysicsSetup, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function ScenePhysicsSetup() {
        var _this = this;
        _this.ringUIMap = new Map();
        _this.CatRingMap = new Map();
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    ScenePhysicsSetup.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    ScenePhysicsSetup.prototype.onInitialized = function () {
        // ...
    };
    /**
     * Called on the scene starts.
     */
    ScenePhysicsSetup.prototype.onStart = function () {
        ScenePhysicsSetup.Instance = this;
        this.scene = this.ground.getScene();
        this.scene.lights.forEach(function (light) {
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
    };
    /**
     * Called each frame.
     */
    ScenePhysicsSetup.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    ScenePhysicsSetup.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param name defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    ScenePhysicsSetup.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case "removeRing":
                // Do something...
                var mesh_1 = data;
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
                setTimeout(function () {
                    mesh_1.dispose();
                }, 2000);
                break;
        }
    };
    ScenePhysicsSetup.prototype.spawnRings = function (count) {
        return __awaiter(this, void 0, void 0, function () {
            var boundingInfo, min, max, ringPrefab, catPrefab, catRoot, scene, material, advancedTexture, i, x, z, ray, hit, y, catClone;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //const bounds = 50; // Adjust this based on your terrain size
                        this.ground.computeWorldMatrix(true);
                        this.ground.refreshBoundingInfo();
                        boundingInfo = this.ground.getBoundingInfo();
                        min = boundingInfo.boundingBox.minimumWorld;
                        max = boundingInfo.boundingBox.maximumWorld;
                        console.log("Ground Bounds:", min, max);
                        ringPrefab = BABYLON.MeshBuilder.CreateTorus("ring", {
                            diameter: 1.5,
                            thickness: 0.1,
                            tessellation: 24,
                        }, this.scene);
                        scene = this.getScene();
                        return [4 /*yield*/, BABYLON.SceneLoader.ImportMeshAsync("", "assets/Cat/", "cat.glb", this.scene).then(function (result) {
                                console.log("Import success:", result);
                                catRoot = new BABYLON.TransformNode("catRoot", scene);
                                result.meshes.forEach(function (mesh) {
                                    if (mesh instanceof BABYLON.Mesh) {
                                        mesh.parent = catRoot;
                                    }
                                });
                                var scale = 0.006;
                                catRoot.scaling = new BABYLON.Vector3(scale, scale, scale); // ⬅️ Scale down the prefab
                                catRoot.position = new BABYLON.Vector3(0, 5.4, 0); // Center the prefab
                                catRoot.rotationQuaternion = BABYLON.Quaternion.Identity(); // Reset rotation
                                catRoot.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(90, 90, 0); // Rotate 180 degrees around Y-axis
                                catPrefab = catRoot;
                                catPrefab.setEnabled(false);
                                // ✅ Log the value here
                                console.log("catPrefab:", catPrefab);
                            }).catch(function (error) {
                                console.error("ImportMeshAsync failed:", error);
                            })];
                    case 1:
                        _a.sent();
                        material = new BABYLON.StandardMaterial("ringMat", this.scene);
                        material.diffuseColor = BABYLON.Color3.Random();
                        material.emissiveColor = BABYLON.Color3.White();
                        ringPrefab.material = material;
                        ringPrefab.setEnabled(false);
                        advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
                        for (i = 0; i < count; i++) {
                            x = Math.random() * (max.x - min.x) + min.x;
                            z = Math.random() * (max.z - min.z) + min.z;
                            ray = new BABYLON.Ray(new BABYLON.Vector3(x, 500, z), BABYLON.Vector3.Down(), 1000);
                            hit = this.scene.pickWithRay(ray, function (mesh) { return mesh === _this.ground; });
                            console.log("T1rying position: x=".concat(x.toFixed(2), " z=").concat(z.toFixed(2)));
                            if ((hit === null || hit === void 0 ? void 0 : hit.hit) && hit.pickedPoint) {
                                console.log("Hit at:", hit.pickedPoint);
                                y = hit.pickedPoint.y + 0.4;
                                catClone = catPrefab.clone("catClone" + i);
                                catClone.setEnabled(true); // Make sure the clone is visible
                                // Apply shadows
                                catClone.getChildMeshes().forEach(function (mesh) {
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
                            }
                            else {
                                console.warn("No hit for ray at:", x, z);
                            }
                        }
                        // Optional: remove the original ring prefab
                        ringPrefab.dispose();
                        catPrefab.dispose();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, decorators_1.visibleInInspector)("Node", "Wreckage")
    ], ScenePhysicsSetup.prototype, "Wreckage", void 0);
    __decorate([
        (0, decorators_1.visibleInInspector)("Node", "Ground")
    ], ScenePhysicsSetup.prototype, "ground", void 0);
    return ScenePhysicsSetup;
}(BABYLON.TransformNode));
exports.default = ScenePhysicsSetup;
//# sourceMappingURL=ScenePhysicsSetup.js.map