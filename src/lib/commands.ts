import { Sleep } from './ericchase/Algorithm/Sleep.js';
import { Broadcast } from './ericchase/Design Pattern/Observer/Broadcast.js';
import { NodeRef, type CNodeRef } from './ericchase/Web API/Node_Utility.js';

const karel = NodeRef(document.querySelector('#karel'));
// const scene = NodeRef(document.querySelector('#scene')).as(HTMLElement);

function drawKarel() {
  karel.style.left = `${4 + 4 + karel_x * 69}px`; // border + missing width/2
  karel.style.top = `${4 + 4 + karel_y * 69}px`; // border + missing height/2
}

const domParser = new DOMParser();
const parseHTML = (html: string) => {
  return domParser.parseFromString(html, 'text/html');
};

export function createBall(x: number, y: number) {
  const ball = addBall(NodeRef(parseHTML(`<div class="entity ball"><img src="./assets/ball.png" alt="ball" /></div>`).body.children[0]), x, y);
  karel.as(HTMLElement).before(ball.as(HTMLElement));
  ball.style.left = `${4 + 5 + x * 69}px`; // border + missing width/2
  ball.style.top = `${4 + 5 + y * 69}px`; // border + missing height/2
}
export function createFence(x: number, y: number) {
  const fence = addFence(NodeRef(parseHTML(`<div class="entity fence"><img src="./assets/fence.png" alt="fence" /></div>`).body.children[0]), x, y);
  karel.as(HTMLElement).before(fence.as(HTMLElement));
  fence.style.left = `${4 + 1 + x * 69}px`; // border + missing width/2
  fence.style.top = `${4 + 0 + y * 69}px`; // border + missing height/2
}

const onUpdate = new Broadcast<void>();
onUpdate.subscribe(() => {
  drawKarel();
});

export let karel_x = 0;
export let karel_y = 0;
export let karel_facing: 'east' | 'north' | 'south' | 'west' = 'east';

const delay = 250;
const ballPosition = new Map<string, CNodeRef>();
const fencePosition = new Map<string, CNodeRef>();

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
  if (facingFence()) {
    return false;
  }
  switch (karel_facing) {
    case 'north':
      if (karel_y === 0) return false;
      break;
    case 'south':
      if (karel_y === 9) return false;
      break;
    case 'west':
      if (karel_x === 0) return false;
      break;
    case 'east':
      if (karel_x === 9) return false;
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

export function addFence(fence: CNodeRef, x: number, y: number) {
  const ref = fencePosition.get(xy(x, y));
  if (ref) return ref;
  fencePosition.set(xy(x, y), fence);
  return fence;
}
export function facingFence() {
  switch (karel_facing) {
    // case 'north':
    //   if (fencePosition.get(xy(karel_x, karel_y - 1))) return true;
    //   break;
    // case 'south':
    //   if (fencePosition.get(xy(karel_x, karel_y + 1))) return true;
    //   break;
    case 'west':
      if (fencePosition.get(xy(karel_x - 1, karel_y))) return true;
      break;
    case 'east':
      if (fencePosition.get(xy(karel_x + 1, karel_y))) return true;
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
