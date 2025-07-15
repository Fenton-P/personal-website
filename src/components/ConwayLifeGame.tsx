import { useEffect } from "react";

function ConwayLifeGame() {
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="w-500px exampleActivity centered">
      <button onClick={onStart}>Start!</button>
      <canvas id="conwayLifeCanvas" height="500px" width="698px" />
    </div>
  );
}

let DELAY = 100;
let looping = true;
const CELLSIZE = 20;

function onStart() {
  looping = false;
  resetPositions();
  setTimeout(startLooper, 500);
}

function startLooper() {
  looping = true;
  looper();
}

function resetPositions() {
  let startingCells = 50;
  let spreadX = 10;
  let offsetX = 10;
  let spreadY = 7;
  let offsetY = 6;

  cells = [];

  if (startingCells > (spreadX - 1) * (spreadY - 1))
    startingCells = (spreadX - 1) * (spreadY - 1);

  for (let i = 0; i < startingCells; i++) {
    let x = Math.floor(Math.random() * spreadX) + offsetX;
    let y = Math.floor(Math.random() * spreadY) + offsetY;

    if (contains(cells, { x: x, y: y })) {
      startingCells++;
    } else cells.push({ x: x, y: y });
  }
}

function looper() {
  if (!looping) return;
  update();
  setTimeout(looper, DELAY);
}

function update() {
  let newCells = [];

  for (let cell of cells) {
    for (let c of getNeighbors(cell)) {
      newCells.push(c);
    }
  }

  let prevCells = cells;
  cells = [];
  console.log(prevCells);

  for (let i = 0; i < newCells.length; i++) {
    let currCell = newCells[i];
    let count = 1;

    for (let j = i + 1; j < newCells.length; j++) {
      if (newCells[j].x == currCell.x && newCells[j].y == currCell.y) {
        count++;
        remove(newCells, j);
        j--;
      }
    }

    if (count == 3 || (count == 2 && contains(prevCells, currCell)))
      cells.push(currCell);
  }

  renderCells();
}

function remove(points: { x: number; y: number }[], index: number) {
  if (index < 0 || index >= points.length) return;
  for (let i = index; i < points.length - 1; i++) {
    points[i] = points[i + 1];
  }
  points.pop();
}

function getNeighbors(cell: { x: number; y: number }) {
  let temp = [];

  temp.push({ x: cell.x + 1, y: cell.y + 1 });
  temp.push({ x: cell.x + 1, y: cell.y });
  temp.push({ x: cell.x + 1, y: cell.y - 1 });
  temp.push({ x: cell.x, y: cell.y + 1 });
  temp.push({ x: cell.x, y: cell.y - 1 });
  temp.push({ x: cell.x - 1, y: cell.y + 1 });
  temp.push({ x: cell.x - 1, y: cell.y });
  temp.push({ x: cell.x - 1, y: cell.y - 1 });

  return temp;
}

let cells: { x: number; y: number }[] = [];
let paint: CanvasRenderingContext2D | null;

function init() {
  let canvas = document.getElementById("conwayLifeCanvas") as HTMLCanvasElement;
  if (canvas == null) return;

  paint = canvas.getContext("2d");
  if (paint == null) return;

  resetPositions();

  renderCells();
}

function renderCells() {
  if (paint == null) return;

  paint.fillStyle = "rgb(40, 40, 40)";
  paint.fillRect(0, 0, 700, 500);

  paint.fillStyle = "white";
  for (let c of cells) {
    paint.fillRect(CELLSIZE * c.x, CELLSIZE * c.y, CELLSIZE, CELLSIZE);
  }
}

function contains(
  cells: { x: number; y: number }[],
  cell: { x: number; y: number }
) {
  for (let c of cells) {
    if (c.x == cell.x && c.y == cell.y) return true;
  }

  return false;
}

export default ConwayLifeGame;
