import * as tf from '@tensorflow/tfjs';
import { Layer } from "../layer";
import { Point, Rectangle } from "../shape";
import { defaults } from '../../../model/build_network';
import { IMAGE_H, IMAGE_W, NUM_TRAIN_ELEMENTS } from '../../../model/data';

export class Input extends Layer {
    layerType = "Input"
    readonly tfjsEmptyLayer = tf.input;

    defaultLocation = new Point(100, document.getElementById("svg").getBoundingClientRect().height/2)

	constructor(invisible=false){
        super([new Rectangle(new Point(0,0), 40, 40, '#806CB7')], new Point(100, document.getElementById("svg").getBoundingClientRect().height/2), invisible)
    }
    
    getHoverText(): string { return "Input" }

    delete() {}

    public generateTfjsLayer(){ 
        // TODO make this a member variable
        this.tfjsLayer = this.tfjsEmptyLayer({shape: [IMAGE_H, IMAGE_W, 1]})
    }

    public lineOfPython(): string {
        return `Input(shape=(${IMAGE_H},${IMAGE_W}, 1))`
    }

    public clone() {
        let newLayer = new Input(true)

        return newLayer
    }
}