import { useEffect } from "react";

class Line {
    public a: number;
    public b: number;
    public c: number;

    constructor(public p1: {x: number, y: number}, public p2: {x: number, y: number}) {
        this.p1 = p1;
        this.p2 = p2;

        this.a = 0;
        this.b = 0;
        this.c = 0;
        
        this.updateABC();
    }

    updateABC() {
        this.a = this.p2.y - this.p1.y;
        this.b = this.p1.x - this.p2.x;
        this.c = this.p2.x * this.p1.y - this.p1.x * this.p2.y;
    }
}

function PointOnPolygon() {
    useEffect(() => {
    init();
  }, []);

    return (
        <div>
            <div className="w-500px exampleActivity centered">
                <canvas id="polygonExampleCanvas" height="500px" width="700px" />
            </div>
        </div>
    )
}

function init() {
    let canvas = document.getElementById("polygonExampleCanvas") as HTMLCanvasElement;
    if(canvas == null) return;
    let paint = canvas.getContext("2d");
    if(paint == null) return;

    let polygon = [
        {x: 200, y: 150},
        {x: 200, y: 50},
        {x: 300, y: 100},
        {x: 250, y: 200},
        {x: 150, y: 200}
    ];

    let xOffset = 150;
    let yOffset = 100;

    for(let i = 0;i<polygon.length;i++) {
        polygon[i].x += xOffset;
        polygon[i].y += yOffset;
    }

    paint.imageSmoothingEnabled = true;
    drawPolygon(paint, polygon)
    
    canvas.addEventListener("mousemove", (event) => {
        let x = event.offsetX;
        let y = event.offsetY;

        let point = getPointOnPolygon(polygon, {x: x, y: y});
        if(paint == null) return;
        drawPointOnPolygon(paint, polygon, point);
    });
}

function drawPointOnPolygon(paint: CanvasRenderingContext2D, polygon: {x: number, y: number}[], point: {scale: number, p1: number, p2: number}) {
    let vector = {
        x: polygon[point.p2].x - polygon[point.p1].x,
        y: polygon[point.p2].y - polygon[point.p1].y
    }

    vector.x *= point.scale;
    vector.y *= point.scale;

    vector.x += polygon[point.p1].x;
    vector.y += polygon[point.p1].y;

    paint.clearRect(0, 0, 500, 700);
    drawPolygon(paint, polygon);
    //paint.fillArc(vector.x - 5, vector.y - 5, 10, 10);
    paint.beginPath();
    paint.arc(vector.x, vector.y, 5, 0, Math.PI * 2);
    paint.fillStyle="white";
    paint.fill();
    paint.beginPath();
    paint.arc(vector.x, vector.y, 3, 0, Math.PI * 2);
    paint.fillStyle = "darkgray";
    paint.fill();
}

function getPointOnPolygon(polygon: {x: number, y: number}[], z: {x: number, y: number}) {
    let L = [];

    for(let i = 0;i<polygon.length;i++) {
        let p1 = polygon[i];
        let p2 = polygon[(i + 1) % polygon.length];

        L.push(new Line(p1, p2));
    }

    let R: number[] = [];

    for(let i = 0;i<L.length;i++) {
        let min = 1000;
        let index = -1;

        for(let j = 0;j<L.length;j++) {
            if(contains(R, j)) continue;

            let distance = getDistanceToLine(z, L[j]);

            if(distance < min) {
                min = distance;
                index = j;
            }
        }

        R.push(index);
    }

    for(let i = 0;i<R.length;i++) {
        let closestPoint = getClosestPointOnLine(L[R[i]], z);

        if(!betweenPoints(polygon[R[i]], polygon[(R[i] + 1) % polygon.length], closestPoint)) continue;

        let smallestPointDistance = 10000;
        let index = 0;
        
        for(let j = 0;j<polygon.length;j++) {
            let point = polygon[j];
            let distance = Math.sqrt(Math.pow(point.x - z.x, 2) + Math.pow(point.y - z.y, 2));
            
            if(distance < smallestPointDistance) {
                smallestPointDistance = distance;
                index = j;
            }
        }
        
        if(smallestPointDistance < Math.sqrt(Math.pow(z.x - closestPoint.x, 2) + Math.pow(z.y - closestPoint.y, 2))) {
            break;
        }

        let scalar = Math.sqrt(Math.pow(closestPoint.x - polygon[R[i]].x, 2) + Math.pow(closestPoint.y - polygon[R[i]].y, 2)) / Math.sqrt(Math.pow(polygon[R[i]].x - polygon[(R[i] + 1) % polygon.length].x, 2) + Math.pow(polygon[R[i]].y - polygon[(R[i] + 1) % polygon.length].y, 2));
        return {
            scale: scalar,
            p1: R[i],
            p2: (R[i] + 1) % polygon.length
        };
    }

    let smallestPointDistance = 10000;
    let index = 0;
    
    for(let j = 0;j<polygon.length;j++) {
        let point = polygon[j];
        let distance = Math.sqrt(Math.pow(point.x - z.x, 2) + Math.pow(point.y - z.y, 2));
        
        if(distance < smallestPointDistance) {
            smallestPointDistance = distance;
            index = j;
        }
    }

    return {
        scale: 0,
        p1: index,
        p2: (index + 1) % polygon.length
    }
}

function betweenPoints(p1: {x: number, y: number}, p2: {x: number, y: number}, point: {x: number, y: number}) {
    let d1 = Math.sqrt(Math.pow(p1.x - point.x, 2) + Math.pow(p1.y - point.y, 2));
    let d2 = Math.sqrt(Math.pow(p2.x - point.x, 2) + Math.pow(p2.y - point.y, 2));
    let d3 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    return d1 < d3 && d2 < d3;
}

function getClosestPointOnLine(line: Line, point: {x: number, y: number}) {
    line.updateABC();
    let x = (Math.pow(line.b, 2) * point.x - line.c * line.a - point.y * line.b * line.a) / (Math.pow(line.b, 2) + Math.pow(line.a, 2));
	let y = line.b != 0 ? - (line.a * x + line.c) / line.b : point.y;
		
	return {x: x, y: y};
}

function getDistanceToLine(point: {x: number, y: number}, line: Line) {
    let numerator = Math.abs(line.a * point.x + line.b * point.y + line.c);
    let denominator = Math.sqrt(line.a * line.a + line.b * line.b);
    
    return numerator / denominator;
}

function contains(arr: number[], value: number) {
    for(let i = 0;i<arr.length;i++) {
        if(arr[i] == value) return true;
    }
    return false;
}

function drawPolygon(paint: CanvasRenderingContext2D, polygon: {x: number, y: number}[]) {
    paint.clearRect(0, 0, 500, 500);
    paint.beginPath();
    paint.moveTo(polygon[0].x, polygon[0].y);
    for(let i = 1;i<polygon.length;i++) {
        paint.lineTo(polygon[i].x, polygon[i].y);
    }
    paint.closePath();
    paint.strokeStyle = "white";
    paint.lineWidth = 2;
    paint.stroke();
}

export default PointOnPolygon;