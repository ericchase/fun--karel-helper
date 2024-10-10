import { Broadcast } from './ericchase/Design Pattern/Observer/Broadcast.js';
import { Sleep } from './ericchase/Utility/Sleep.js';
import { NodeRef, type CNodeRef } from './ericchase/Web API/Node_Utility.js';

export let karel_x = 0;
export let karel_y = 0;
export let karel_facing: 'east' | 'north' | 'south' | 'west' = 'east';

const karel = NodeRef(document.querySelector('#karel'));
// const scene = NodeRef(document.querySelector('#scene')).as(HTMLElement);

let delay = 250;
const ballPosition = new Map<string, CNodeRef>();
const wallHPosition = new Map<string, CNodeRef>();
const wallVPosition = new Map<string, CNodeRef>();

let mapW = 0;
let mapH = 0;

const domParser = new DOMParser();
const parseHTML = (html: string) => {
  return domParser.parseFromString(html, 'text/html');
};

const onUpdate = new Broadcast<void>();
onUpdate.subscribe(() => {
  drawKarel();
});
drawKarel();

function drawKarel() {
  karel.style.left = `${4 + 4 + karel_x * 69}px`; // border + missing width/2
  karel.style.top = `${4 + 4 + karel_y * 69}px`; // border + missing height/2
}

export function setStepsPerSecond(steps: number) {
  delay = 1000 / steps;
}

export function drawMap(w: number, h: number) {
  mapW = w;
  mapH = h;

  // walls
  const border = NodeRef(parseHTML(`<div class="entity border"></div>`).body.children[0]);
  border.style.width = `${w * 69}px`;
  border.style.height = `${h * 69}px`;
  border.style.left = `${4}px`; // border
  border.style.top = `${4}px`; // border
  karel.as(HTMLElement).before(border.as(HTMLElement));

  // dots
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const dot = NodeRef(parseHTML(`<div class="entity dot"><img src="./assets/dot.png" alt="dot" /></div>`).body.children[0]);
      dot.style.left = `${4 + i * 69}px`;
      dot.style.top = `${4 + j * 69}px`;
      karel.as(HTMLElement).before(dot.as(HTMLElement));
    }
  }
}

export function drawBall(x: number, y: number) {
  const ball = addBall(NodeRef(parseHTML(`<div class="entity ball"><img src="./assets/ball.png" alt="ball" /></div>`).body.children[0]), x, y);
  karel.as(HTMLElement).before(ball.as(HTMLElement));
  ball.style.left = `${4 + 5 + x * 69}px`; // border + missing width/2
  ball.style.top = `${4 + 5 + y * 69}px`; // border + missing height/2
}
export function drawWallH(x: number, y: number) {
  const wallH = addWallH(NodeRef(parseHTML(`<div class="entity wallh"><img src="./assets/wallh.png" alt="wallh" /></div>`).body.children[0]), x, y);
  karel.as(HTMLElement).before(wallH.as(HTMLElement));
  wallH.style.left = `${4 + x * 69}px`; // border + missing width/2
  wallH.style.top = `${4 + y * 69}px`; // border + missing height/2
}
export function drawWallV(x: number, y: number) {
  const wallV = addWallV(NodeRef(parseHTML(`<div class="entity wallv"><img src="./assets/wallv.png" alt="wallv" /></div>`).body.children[0]), x, y);
  karel.as(HTMLElement).before(wallV.as(HTMLElement));
  wallV.style.left = `${4 + x * 69}px`; // border + missing width/2
  wallV.style.top = `${4 + y * 69}px`; // border + missing height/2
}

function xy(x: number, y: number) {
  return JSON.stringify({ x, y });
}

// ballPosition.get(xy(x, y));
// ballPosition.set(xy(x, y), data);
// ballPosition.delete(xy(x, y));

export function facingEast() {}
export function facingNorth() {}
export function facingSouth() {}
export function facingWest() {}
export function frontIsBlocked() {
  return !frontIsClear();
}
export function frontIsClear() {
  if (facingWallH() || facingWallV()) {
    return false;
  }
  switch (karel_facing) {
    case 'north':
      if (karel_y === 0) return false;
      break;
    case 'south':
      if (karel_y === mapH - 1) return false;
      break;
    case 'west':
      if (karel_x === 0) return false;
      break;
    case 'east':
      if (karel_x === mapW - 1) return false;
      break;
  }
  return true;
}
export function leftIsBlocked() {}
export function leftIsClear() {}
export function notFacingEast() {}
export function notFacingNorth() {}
export function notFacingSouth() {}
export function notFacingWest() {}
export function rightIsBlocked() {}
export function rightIsClear() {}
export async function turnLeft() {
  await Sleep(delay / 2);
  switch (karel_facing) {
    case 'north':
      karel_facing = 'west';
      karel.style.transform = 'rotate(180deg)';
      break;
    case 'south':
      karel_facing = 'east';
      karel.style.transform = 'rotate(0deg)';
      break;
    case 'west':
      karel_facing = 'south';
      karel.style.transform = 'rotate(90deg)';
      break;
    case 'east':
      karel_facing = 'north';
      karel.style.transform = 'rotate(270deg)';
      break;
  }
  await Sleep(delay / 2);
}
export async function turnRight() {
  console.log('turnRight');
  await Sleep(delay / 2);
  switch (karel_facing) {
    case 'north':
      karel_facing = 'east';
      karel.style.transform = 'rotate(0deg)';
      break;
    case 'south':
      karel_facing = 'west';
      karel.style.transform = 'rotate(180deg)';
      break;
    case 'west':
      karel_facing = 'north';
      karel.style.transform = 'rotate(270deg)';
      break;
    case 'east':
      karel_facing = 'south';
      karel.style.transform = 'rotate(90deg)';
      break;
  }
  await Sleep(delay / 2);
}

export function addBall(ball: CNodeRef, x: number, y: number) {
  const ref = ballPosition.get(xy(x, y));
  if (ref) return ref;
  ballPosition.set(xy(x, y), ball);
  return ball;
}
export function ballsPresent() {
  return ballPosition.get(xy(karel_x, karel_y));
}
export function noBallsPresent() {
  return !ballsPresent();
}
export async function takeBall() {
  const ref = ballPosition.get(xy(karel_x, karel_y));
  if (ref) {
    ballPosition.delete(xy(karel_x, karel_y));
    await Sleep(delay);
    ref.as(Element).remove();
  } else {
    throw 'There is no ball!';
  }
}

export function addWallH(wallH: CNodeRef, x: number, y: number) {
  const ref = wallHPosition.get(xy(x, y));
  if (ref) return ref;
  wallHPosition.set(xy(x, y), wallH);
  return wallH;
}
export function addWallV(wallV: CNodeRef, x: number, y: number) {
  const ref = wallVPosition.get(xy(x, y));
  if (ref) return ref;
  wallVPosition.set(xy(x, y), wallV);
  return wallV;
}
export function facingWallH() {
  switch (karel_facing) {
    case 'north':
      if (wallHPosition.get(xy(karel_x, karel_y))) return true;
      break;
    case 'south':
      if (wallHPosition.get(xy(karel_x, karel_y))) return true;
      break;
  }
  return false;
}
export function facingWallV() {
  switch (karel_facing) {
    case 'west':
      if (wallVPosition.get(xy(karel_x - 1, karel_y))) return true;
      break;
    case 'east':
      if (wallVPosition.get(xy(karel_x + 1, karel_y))) return true;
      break;
  }
  return false;
}

export async function start(x: number, y: number) {
  karel_x = x;
  karel_y = y;
  onUpdate.send();
}

export async function move() {
  if (frontIsClear() === false) {
    throw 'Karel ran into something!';
  }
  switch (karel_facing) {
    case 'north':
      karel_y -= 1;
      break;
    case 'south':
      karel_y += 1;
      break;
    case 'west':
      karel_x -= 1;
      break;
    case 'east':
      karel_x += 1;
      break;
  }
  await Sleep(delay);
  onUpdate.send();
}
