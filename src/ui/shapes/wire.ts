import { Shape, Point } from "./shape";
import { Layer, Dense } from "./layer";
import * as d3 from "d3";
import { windowProperties } from "../window";

export class Wire {
    static readonly defaultLocation: Point = new Point(200, 200);

    source: Layer;
    dest: Layer;
    line: d3.Selection<SVGGraphicsElement, {}, HTMLElement, any>;
    triangle: d3.Selection<SVGGraphicsElement, {}, HTMLElement, any>;

    static nextID: number = 0;
    id: number;

    constructor(source: Layer, dest: Layer) {
        this.source = source
        this.dest = dest
        this.id = Wire.nextID;
        Wire.nextID += 1;

        let sourceCenter = this.source.getPosition().add(this.source.center())
        let destCenter = this.dest.getPosition().add(this.dest.center())

        let newGroup = d3.select<SVGGraphicsElement, {}>("svg")
                        .append<SVGGraphicsElement>("g")

        this.line = newGroup.append<SVGGraphicsElement>("line")
                            .attr('x1',sourceCenter.x)
                            .attr('y1',sourceCenter.y)
                            .attr('x2',destCenter.x)
                            .attr('y2',destCenter.y)
                            .style('stroke','black')
                            .style('stroke-width',6)
        
        this.triangle = newGroup.append<SVGGraphicsElement>("polygon")
                                .attr("points", "0,16, 20,0, 0,-16")

        this.updatePosition()
        this.source.svgComponent.raise()
        this.dest.svgComponent.raise()

        this.line.on("click", () => {this.select()})
        this.triangle.on("click", () => {this.select()})
    }

    updatePosition() {
        let sourceCenter = this.source.getPosition().add(this.source.center())
        let destCenter = this.dest.getPosition().add(this.dest.center())
        this.line.attr('x1',sourceCenter.x)
                 .attr('y1',sourceCenter.y)
                 .attr('x2',destCenter.x)
                 .attr('y2',destCenter.y)
        let angle = Math.atan2(destCenter.y - sourceCenter.y, destCenter.x - sourceCenter.x) * 180 / Math.PI;//angle for tangent
        this.triangle.attr("transform", "translate(" + ((sourceCenter.x+destCenter.x)/2) + ","
                + ((sourceCenter.y+destCenter.y)/2) + ")rotate("+ angle + ")")
    }

    public select() {
        if (windowProperties.selectedElement != null) {
            if (windowProperties.selectedElement === this) {
                return
            }
            windowProperties.selectedElement.unselect()
        }
        windowProperties.selectedElement = this
        this.line.raise()
        this.source.svgComponent.raise()
        this.dest.svgComponent.raise()
        this.line.style("stroke", "yellow")
        this.triangle.style("fill", "yellow")
    }

    public unselect() {
        this.line.style("stroke", "black")
        this.triangle.style("fill", "black")
    }

    public delete() {
        this.line.remove()
        this.triangle.remove()
        this.source.children.delete(this.dest)
        this.dest.parents.delete(this.source)
        this.source.wires.delete(this)
        this.dest.wires.delete(this)
    }

}