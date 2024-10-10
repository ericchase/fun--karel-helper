// src/lib/ericchase/Design Pattern/Observer/Broadcast.ts
class Broadcast {
  subscriptionSet = new Set();
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  wait(untilValue) {
    return new Promise((resolve) => {
      this.subscribe((value, unsubscribe) => {
        if (value === untilValue) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
  send(value) {
    for (const callback of this.subscriptionSet) {
      callback(value, () => {
        this.subscriptionSet.delete(callback);
      });
    }
  }
  sendAndWait(value, untilValue) {
    const _ = this.wait(untilValue);
    this.send(value);
    return _;
  }
}

// src/lib/ericchase/Utility/Sleep.ts
async function Sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// src/lib/ericchase/Web API/Node_Utility.ts
function NodeRef(node) {
  return new CNodeRef(node);
}
class CNodeRef {
  node;
  constructor(node) {
    if (node === null) {
      throw new ReferenceError('Reference is null.');
    }
    if (node === undefined) {
      throw new ReferenceError('Reference is undefined.');
    }
    this.node = node;
  }
  as(constructor_ref) {
    if (this.node instanceof constructor_ref) return this.node;
    throw new TypeError(`Reference node is not ${constructor_ref}`);
  }
  is(constructor_ref) {
    return this.node instanceof constructor_ref;
  }
  passAs(constructor_ref, fn) {
    if (this.node instanceof constructor_ref) {
      fn(this.node);
    }
  }
  tryAs(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
  }
  get classList() {
    return this.as(HTMLElement).classList;
  }
  get className() {
    return this.as(HTMLElement).className;
  }
  get style() {
    return this.as(HTMLElement).style;
  }
  getAttribute(qualifiedName) {
    return this.as(HTMLElement).getAttribute(qualifiedName);
  }
  setAttribute(qualifiedName, value) {
    this.as(HTMLElement).setAttribute(qualifiedName, value);
  }
  getStyleProperty(property) {
    return this.as(HTMLElement).style.getPropertyValue(property);
  }
  setStyleProperty(property, value, priority) {
    this.as(HTMLElement).style.setProperty(property, value, priority);
  }
}

// src/lib/commands.ts
function drawKarel() {
  karel.style.left = `${4 + 4 + karel_x * 69}px`;
  karel.style.top = `${4 + 4 + karel_y * 69}px`;
}
function setStepsPerSecond(steps) {
  delay = 1000 / steps;
}
function drawMap(w, h) {
  mapW = w;
  mapH = h;
  const border = NodeRef(parseHTML(`<div class="entity border"></div>`).body.children[0]);
  border.style.width = `${w * 69}px`;
  border.style.height = `${h * 69}px`;
  border.style.left = `${4}px`;
  border.style.top = `${4}px`;
  karel.as(HTMLElement).before(border.as(HTMLElement));
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const dot = NodeRef(parseHTML(`<div class="entity dot"><img src="./assets/dot.png" alt="dot" /></div>`).body.children[0]);
      dot.style.left = `${4 + i * 69}px`;
      dot.style.top = `${4 + j * 69}px`;
      karel.as(HTMLElement).before(dot.as(HTMLElement));
    }
  }
}
function drawWallH(x, y) {
  const wallH = addWallH(NodeRef(parseHTML(`<div class="entity wallh"><img src="./assets/wallh.png" alt="wallh" /></div>`).body.children[0]), x, y);
  karel.as(HTMLElement).before(wallH.as(HTMLElement));
  wallH.style.left = `${4 + x * 69}px`;
  wallH.style.top = `${4 + y * 69}px`;
}
function xy(x, y) {
  return JSON.stringify({ x, y });
}
function frontIsClear() {
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
async function turnLeft() {
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
async function turnRight() {
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
function addWallH(wallH, x, y) {
  const ref = wallHPosition.get(xy(x, y));
  if (ref) return ref;
  wallHPosition.set(xy(x, y), wallH);
  return wallH;
}
function facingWallH() {
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
function facingWallV() {
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
async function start(x, y) {
  karel_x = x;
  karel_y = y;
  onUpdate.send();
}
async function move() {
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
var karel_x = 0;
var karel_y = 0;
var karel_facing = 'east';
var karel = NodeRef(document.querySelector('#karel'));
var delay = 250;
var ballPosition = new Map();
var wallHPosition = new Map();
var wallVPosition = new Map();
var mapW = 0;
var mapH = 0;
var domParser = new DOMParser();
var parseHTML = (html) => {
  return domParser.parseFromString(html, 'text/html');
};
var onUpdate = new Broadcast();
onUpdate.subscribe(() => {
  drawKarel();
});
drawKarel();

// src/dev_server/server-data.ts
var server_hostname = '127.0.0.1';
var server_port = '8000';
var server_http = `http://${server_hostname}:${server_port}`;
var server_ws = `ws://${server_hostname}:${server_port}`;

// src/dev_server/hotreload.ts
function onMessage(event) {
  if (event.data === 'reload') {
    window.location.reload();
  }
}
function onClose() {
  socket_cleanup();
}
function onError() {
  socket_cleanup();
}
function socket_cleanup() {
  if (socket) {
    socket.removeEventListener('message', onMessage);
    socket.removeEventListener('close', onClose);
    socket.removeEventListener('error', onError);
    socket_restart();
  }
}
function socket_restart() {
  console.log('socket_restart');
  socket = new WebSocket(server_ws);
  if (socket) {
    socket.addEventListener('message', onMessage);
    socket.addEventListener('close', onClose);
    socket.addEventListener('error', onError);
  }
}
var socket = undefined;

// src/index.module.ts
socket_restart();
drawMap(8, 8);
(() => {
  for (let i = 0; i < 7; i++) {
    drawWallH(i, 1);
  }
  for (let i = 0; i < 4; i++) {
    drawWallH(i, 2);
  }
  for (let i = 5; i < 8; i++) {
    drawWallH(i, 2);
  }
  for (let i = 1; i < 8; i++) {
    drawWallH(i, 3);
  }
  for (let i = 0; i < 1; i++) {
    drawWallH(i, 4);
  }
  for (let i = 2; i < 8; i++) {
    drawWallH(i, 4);
  }
  for (let i = 0; i < 5; i++) {
    drawWallH(i, 5);
  }
  for (let i = 6; i < 8; i++) {
    drawWallH(i, 5);
  }
  for (let i = 0; i < 2; i++) {
    drawWallH(i, 6);
  }
  for (let i = 3; i < 8; i++) {
    drawWallH(i, 6);
  }
  for (let i = 0; i < 7; i++) {
    drawWallH(i, 7);
  }
})();
setStepsPerSecond(10);
try {
  await start(0, 7);
  while (true) {
    while (frontIsClear()) {
      await move();
    }
    await turnLeft();
    await move();
    await turnLeft();
    while (frontIsClear()) {
      await move();
    }
    await turnRight();
    await turnRight();
    await move();
    await move();
    await turnLeft();
    await move();
    await turnLeft();
    while (frontIsClear()) {
      await move();
    }
    await turnRight();
    await turnRight();
    while (frontIsClear()) {
      await move();
    }
    await turnLeft();
    await turnLeft();
    await move();
    await move();
    await turnRight();
    await move();
    await turnRight();
    while (frontIsClear()) {
      await move();
    }
    await turnLeft();
    await turnLeft();
    while (frontIsClear()) {
      await move();
    }
    await turnRight();
    await turnRight();
    await move();
    await turnLeft();
    await move();
    await turnRight();
    while (frontIsClear()) {
      await move();
    }
    await turnLeft();
    await turnLeft();
    while (frontIsClear()) {
      await move();
    }
    await turnRight();
    await move();
    await turnRight();
    while (frontIsClear()) {
      await move();
    }
    await turnLeft();
    await turnLeft();
    await move();
    await move();
    await move();
    await turnRight();
    await move();
    await turnLeft();
    while (frontIsClear()) {
      await move();
    }
    await turnRight();
    await turnRight();
    while (frontIsClear()) {
      await move();
    }
    await turnLeft();
    await move();
    await turnLeft();
    while (frontIsClear()) {
      await move();
    }
    break;
  }
  console.log('done');
} catch (error) {
  console.error(error);
}

//# debugId=4C6E34634333596964756E2164756E21
//# sourceMappingURL=index.module.js.map
