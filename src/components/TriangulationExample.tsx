import { useEffect } from "react";

let selectedPoint = -1;

function TriangulationExample() {
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div className="w-500px exampleActivity centered">
        <canvas id="polygonExampleCanvas" height="500px" width="700px" />
      </div>
    </div>
  );
}

function init() {
  let canvas = document.getElementById(
    "polygonExampleCanvas"
  ) as HTMLCanvasElement;
  if (canvas == null) return;

  // Example polygon points
  //   let polygon = [
  //     { x: 150, y: 200 },
  //     { x: 250, y: 200 },
  //     { x: 300, y: 100 },
  //     { x: 200, y: 50 },
  //     { x: 200, y: 150 },
  //   ];

  let polygon = [
    { x: 200, y: 150 },
    { x: 200, y: 50 },
    { x: 300, y: 100 },
    { x: 250, y: 200 },
    { x: 150, y: 200 },
  ];

  let xOffset = 150;
  let yOffset = 100;

  for (let i = 0; i < polygon.length; i++) {
    polygon[i].x += xOffset;
    polygon[i].y += yOffset;
  }

  drawPolygon(polygon);

  canvas.addEventListener("mousedown", (event) => {
    let x = event.offsetX;
    let y = event.offsetY;

    selectedPoint = -1;

    for (let i = 0; i < polygon.length; i++) {
      let point = polygon[i];
      if (Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5) {
        // Point clicked, remove it
        selectedPoint = i;
        return;
      }
    }
  });

  canvas.addEventListener("mouseup", (event) => {
    selectedPoint = -1;
  });

  canvas.addEventListener("mousemove", (event) => {
    let x = event.offsetX;
    let y = event.offsetY;

    if (selectedPoint >= 0) {
      // Move the selected point
      polygon[selectedPoint].x = x;
      polygon[selectedPoint].y = y;
      drawPolygon(polygon);
    }
  });
}

function isAngleGreaterThan180(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): boolean {
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
  const cross = v1.x * v2.y - v1.y * v2.x;
  return cross > 0; // true if angle > 180°
}

function drawPolygon(polygon: string | any[]) {
  let canvas = document.getElementById(
    "polygonExampleCanvas"
  ) as HTMLCanvasElement;
  if (canvas == null) return;
  let paint = canvas.getContext("2d");
  if (paint == null) return;

  paint.clearRect(0, 0, canvas.width, canvas.height);
  paint.imageSmoothingEnabled = true;

  let polygon2 = [];

  for (let i = 0; i < polygon.length; i++) {
    polygon2.push({ x: polygon[i].x, y: polygon[i].y });
  }

  //Draw the Triangles
  let triangles = getTrianglesFromPolygon(polygon2);
  for (let triangle of triangles) {
    paint.strokeStyle = "gray";
    paint.beginPath();
    paint.moveTo(triangle[0].x, triangle[0].y);
    paint.lineTo(triangle[1].x, triangle[1].y);
    paint.lineTo(triangle[2].x, triangle[2].y);
    paint.closePath();
    paint.stroke();
  }

  // Draw the polygon
  paint.beginPath();
  paint.moveTo(polygon[0].x, polygon[0].y);
  for (let i = 1; i < polygon.length; i++) {
    paint.lineTo(polygon[i].x, polygon[i].y);
  }
  paint.closePath();
  paint.strokeStyle = "white";
  paint.lineWidth = 2;
  paint.stroke();

  for (let i = 0; i < polygon.length; i++) {
    paint.fillStyle = "white";
    paint.beginPath();
    paint.arc(polygon[i].x, polygon[i].y, 5, 0, Math.PI * 2);
    paint.stroke();
    paint.fillStyle = "rgb(58, 59, 60)";
    paint.beginPath();
    paint.arc(polygon[i].x, polygon[i].y, 3, 0, Math.PI * 2);
    paint.fill();
  }
}

function getTrianglesFromPolygon(
  points: { x: number; y: number }[]
): { x: number; y: number }[][] {
  let triangles = [];

  let currentIndex = 0;
  let itters = 0;
  while (points.length > 3) {
    itters++;
    if (itters > 1000) return triangles;
    if (currentIndex >= points.length) currentIndex = 0;

    let prevIndex = currentIndex == 0 ? points.length - 1 : currentIndex - 1;
    let futureIndex = currentIndex == points.length - 1 ? 0 : currentIndex + 1;

    let p1 = points[prevIndex];
    let p2 = points[currentIndex];
    let p3 = points[futureIndex];

    if (isAngleGreaterThan180(p1, p2, p3)) {
      currentIndex++;
      continue;
    }

    let skip = false;
    for (let i = 0; i < points.length; i++) {
      if (i == prevIndex || i == currentIndex || i == futureIndex) continue;
      if (pointInTriangle(points[i], { p1, p2, p3 })) {
        skip = true;
        break;
      }
    }

    if (skip) {
      currentIndex++;
      continue;
    }

    //System.out.println(p1 + " | " + p2 + " | " + p3);

    //System.out.println(currentIndex);

    triangles.push([p1, p2, p3]);
    remove(points, currentIndex);
    currentIndex = 0;
  }

  triangles.push([points[0], points[1], points[2]]);

  return triangles;
}

function remove(points: { x: number; y: number }[], index: number) {
  if (index < 0 || index >= points.length) return;
  for (let i = index; i < points.length - 1; i++) {
    points[i] = points[i + 1];
  }
  points.pop();
}

function pointInTriangle(
  point: { x: number; y: number },
  triangle: {
    p1: { x: number; y: number };
    p2: { x: number; y: number };
    p3: { x: number; y: number };
  }
): boolean {
  let dX = point.x - triangle.p2.x;
  let dY = point.y - triangle.p2.y;
  let dX1 = triangle.p1.x - triangle.p2.x;
  let dY1 = triangle.p1.y - triangle.p2.y;
  let dX2 = triangle.p3.x - triangle.p2.x;
  let dY2 = triangle.p3.y - triangle.p2.y;

  let dot00 = dX1 * dX1 + dY1 * dY1;
  let dot01 = dX1 * dX2 + dY1 * dY2;
  let dot02 = dX1 * dX + dY1 * dY;
  let dot11 = dX2 * dX2 + dY2 * dY2;
  let dot12 = dX2 * dX + dY2 * dY;

  let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return u >= 0 && v >= 0 && u + v <= 1;
}

function getTheta(point: { x: number; y: number }): number {
  let possibleAngles = [];

  let beta = Math.acos(point.x);
  possibleAngles.push(beta);
  possibleAngles.push(2 * Math.PI - beta);

  beta = Math.asin(point.y);

  //System.out.println(beta);
  //System.out.println(possibleAngles);

  if (beta < 0) beta = Math.PI * 2 + beta;

  for (let theta of possibleAngles) {
    if (Math.floor(theta * 1000) == Math.floor(beta * 1000)) return theta;
  }

  return Math.PI - beta;
}

export default TriangulationExample;
