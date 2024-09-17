// src/lib/ericchase/Algorithm/Sleep.ts
async function Sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

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
function createFence(x, y) {
  const fence = addFence(NodeRef(parseHTML(`<div class="entity fence"><img src="./assets/fence.png" alt="fence" /></div>`).body.children[0]), x, y);
  karel.as(HTMLElement).before(fence.as(HTMLElement));
  fence.style.left = `${4 + 1 + x * 69}px`;
  fence.style.top = `${4 + 0 + y * 69}px`;
}
function xy(x, y) {
  return JSON.stringify({ x, y });
}
function frontIsBlocked() {
  return !frontIsClear();
}
function frontIsClear() {
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
function ballsPresent() {
  return ballPosition.get(xy(karel_x, karel_y));
}
async function takeBall() {
  const ref = ballPosition.get(xy(karel_x, karel_y));
  if (ref) {
    ballPosition.delete(xy(karel_x, karel_y));
    await Sleep(delay);
    ref.as(Element).remove();
  } else {
    throw 'There is no ball!';
  }
}
function addFence(fence, x, y) {
  const ref = fencePosition.get(xy(x, y));
  if (ref) return ref;
  fencePosition.set(xy(x, y), fence);
  return fence;
}
function facingFence() {
  switch (karel_facing) {
    case 'west':
      if (fencePosition.get(xy(karel_x - 1, karel_y))) return true;
      break;
    case 'east':
      if (fencePosition.get(xy(karel_x + 1, karel_y))) return true;
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
var karel = NodeRef(document.querySelector('#karel'));
var domParser = new DOMParser();
var parseHTML = (html) => {
  return domParser.parseFromString(html, 'text/html');
};
var onUpdate = new Broadcast();
onUpdate.subscribe(() => {
  drawKarel();
});
var karel_x = 0;
var karel_y = 0;
var karel_facing = 'east';
var delay = 250;
var ballPosition = new Map();
var fencePosition = new Map();

// src/index.bundle.ts
createFence(1, 9);
createFence(4, 9);
createFence(5, 9);
createFence(8, 9);
createFence(9, 9);
await start(0, 9);
while (true) {
  if (ballsPresent()) {
    await takeBall();
  }
  if (facingFence()) {
    await turnLeft();
    await move();
    await turnRight();
    await move();
    await turnRight();
    await move();
    await turnLeft();
  } else if (frontIsBlocked()) {
    break;
  } else {
    await move();
  }
}
console.log('ended');

//# debugId=334F0D7D6B54FE4164756E2164756E21
//# sourceMappingURL=index.bundle.js.map
