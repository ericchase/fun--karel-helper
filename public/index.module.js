// src/lib/ericchase/Design Pattern/Observer/Broadcast.ts
class Broadcast {
  subscriptionSet = new Set;
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
      throw new ReferenceError("Reference is null.");
    }
    if (node === undefined) {
      throw new ReferenceError("Reference is undefined.");
    }
    this.node = node;
  }
  as(constructor_ref) {
    if (this.node instanceof constructor_ref)
      return this.node;
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
  for (let j = 0;j < h; j++) {
    for (let i = 0;i < w; i++) {
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
    case "north":
      if (karel_y === 0)
        return false;
      break;
    case "south":
      if (karel_y === mapH - 1)
        return false;
      break;
    case "west":
      if (karel_x === 0)
        return false;
      break;
    case "east":
      if (karel_x === mapW - 1)
        return false;
      break;
  }
  return true;
}
async function turnLeft() {
  await Sleep(delay / 2);
  switch (karel_facing) {
    case "north":
      karel_facing = "west";
      karel.style.transform = "rotate(180deg)";
      break;
    case "south":
      karel_facing = "east";
      karel.style.transform = "rotate(0deg)";
      break;
    case "west":
      karel_facing = "south";
      karel.style.transform = "rotate(90deg)";
      break;
    case "east":
      karel_facing = "north";
      karel.style.transform = "rotate(270deg)";
      break;
  }
  await Sleep(delay / 2);
}
async function turnRight() {
  console.log("turnRight");
  await Sleep(delay / 2);
  switch (karel_facing) {
    case "north":
      karel_facing = "east";
      karel.style.transform = "rotate(0deg)";
      break;
    case "south":
      karel_facing = "west";
      karel.style.transform = "rotate(180deg)";
      break;
    case "west":
      karel_facing = "north";
      karel.style.transform = "rotate(270deg)";
      break;
    case "east":
      karel_facing = "south";
      karel.style.transform = "rotate(90deg)";
      break;
  }
  await Sleep(delay / 2);
}
function addWallH(wallH, x, y) {
  const ref = wallHPosition.get(xy(x, y));
  if (ref)
    return ref;
  wallHPosition.set(xy(x, y), wallH);
  return wallH;
}
function facingWallH() {
  switch (karel_facing) {
    case "north":
      if (wallHPosition.get(xy(karel_x, karel_y)))
        return true;
      break;
    case "south":
      if (wallHPosition.get(xy(karel_x, karel_y)))
        return true;
      break;
  }
  return false;
}
function facingWallV() {
  switch (karel_facing) {
    case "west":
      if (wallVPosition.get(xy(karel_x - 1, karel_y)))
        return true;
      break;
    case "east":
      if (wallVPosition.get(xy(karel_x + 1, karel_y)))
        return true;
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
    throw "Karel ran into something!";
  }
  switch (karel_facing) {
    case "north":
      karel_y -= 1;
      break;
    case "south":
      karel_y += 1;
      break;
    case "west":
      karel_x -= 1;
      break;
    case "east":
      karel_x += 1;
      break;
  }
  await Sleep(delay);
  onUpdate.send();
}
var karel_x = 0;
var karel_y = 0;
var karel_facing = "east";
var karel = NodeRef(document.querySelector("#karel"));
var delay = 250;
var ballPosition = new Map;
var wallHPosition = new Map;
var wallVPosition = new Map;
var mapW = 0;
var mapH = 0;
var domParser = new DOMParser;
var parseHTML = (html) => {
  return domParser.parseFromString(html, "text/html");
};
var onUpdate = new Broadcast;
onUpdate.subscribe(() => {
  drawKarel();
});
drawKarel();

// src/dev_server/server-data.ts
var server_hostname = "127.0.0.1";
var server_port = "8000";
var server_http = `http://${server_hostname}:${server_port}`;
var server_ws = `ws://${server_hostname}:${server_port}`;

// src/dev_server/hotreload.ts
function onMessage(event) {
  if (event.data === "reload") {
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
    socket.removeEventListener("message", onMessage);
    socket.removeEventListener("close", onClose);
    socket.removeEventListener("error", onError);
    socket_restart();
  }
}
function socket_restart() {
  console.log("socket_restart");
  socket = new WebSocket(server_ws);
  if (socket) {
    socket.addEventListener("message", onMessage);
    socket.addEventListener("close", onClose);
    socket.addEventListener("error", onError);
  }
}
var socket = undefined;

// src/index.module.ts
socket_restart();
drawMap(8, 8);
(() => {
  for (let i = 0;i < 7; i++) {
    drawWallH(i, 1);
  }
  for (let i = 0;i < 4; i++) {
    drawWallH(i, 2);
  }
  for (let i = 5;i < 8; i++) {
    drawWallH(i, 2);
  }
  for (let i = 1;i < 8; i++) {
    drawWallH(i, 3);
  }
  for (let i = 0;i < 1; i++) {
    drawWallH(i, 4);
  }
  for (let i = 2;i < 8; i++) {
    drawWallH(i, 4);
  }
  for (let i = 0;i < 5; i++) {
    drawWallH(i, 5);
  }
  for (let i = 6;i < 8; i++) {
    drawWallH(i, 5);
  }
  for (let i = 0;i < 2; i++) {
    drawWallH(i, 6);
  }
  for (let i = 3;i < 8; i++) {
    drawWallH(i, 6);
  }
  for (let i = 0;i < 7; i++) {
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
  console.log("done");
} catch (error) {
  console.error(error);
}

//# debugId=4C6E34634333596964756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi5cXHNyY1xcbGliXFxlcmljY2hhc2VcXERlc2lnbiBQYXR0ZXJuXFxPYnNlcnZlclxcQnJvYWRjYXN0LnRzIiwgIi4uXFxzcmNcXGxpYlxcZXJpY2NoYXNlXFxVdGlsaXR5XFxTbGVlcC50cyIsICIuLlxcc3JjXFxsaWJcXGVyaWNjaGFzZVxcV2ViIEFQSVxcTm9kZV9VdGlsaXR5LnRzIiwgIi4uXFxzcmNcXGxpYlxcY29tbWFuZHMudHMiLCAiLi5cXHNyY1xcZGV2X3NlcnZlclxcc2VydmVyLWRhdGEudHMiLCAiLi5cXHNyY1xcZGV2X3NlcnZlclxcaG90cmVsb2FkLnRzIiwgIi4uXFxzcmNcXGluZGV4Lm1vZHVsZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsKICAgICJleHBvcnQgdHlwZSBTdWJzY3JpcHRpb25DYWxsYmFjazxWYWx1ZT4gPSAodmFsdWU6IFZhbHVlLCB1bnN1YnNjcmliZTogKCkgPT4gdm9pZCkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIEJyb2FkY2FzdDxWYWx1ZT4ge1xuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uU2V0ID0gbmV3IFNldDxTdWJzY3JpcHRpb25DYWxsYmFjazxWYWx1ZT4+KCk7XG4gIHN1YnNjcmliZShjYWxsYmFjazogU3Vic2NyaXB0aW9uQ2FsbGJhY2s8VmFsdWU+KTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25TZXQuYWRkKGNhbGxiYWNrKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25TZXQuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICB9O1xuICB9XG4gIHdhaXQodW50aWxWYWx1ZTogVmFsdWUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlKCh2YWx1ZSwgdW5zdWJzY3JpYmUpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bnRpbFZhbHVlKSB7XG4gICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHNlbmQodmFsdWU6IFZhbHVlKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiB0aGlzLnN1YnNjcmlwdGlvblNldCkge1xuICAgICAgY2FsbGJhY2sodmFsdWUsICgpID0+IHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25TZXQuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBzZW5kQW5kV2FpdCh2YWx1ZTogVmFsdWUsIHVudGlsVmFsdWU6IFZhbHVlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgXyA9IHRoaXMud2FpdCh1bnRpbFZhbHVlKTtcbiAgICB0aGlzLnNlbmQodmFsdWUpO1xuICAgIHJldHVybiBfO1xuICB9XG59XG4iLAogICAgImV4cG9ydCBhc3luYyBmdW5jdGlvbiBTbGVlcChtczogbnVtYmVyKSB7XG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG4iLAogICAgImV4cG9ydCBjbGFzcyBDTm9kZVJlZiB7XG4gIG5vZGU6IE5vZGU7XG5cbiAgY29uc3RydWN0b3Iobm9kZT86IE5vZGUgfCBudWxsKSB7XG4gICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignUmVmZXJlbmNlIGlzIG51bGwuJyk7XG4gICAgfVxuICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignUmVmZXJlbmNlIGlzIHVuZGVmaW5lZC4nKTtcbiAgICB9XG4gICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgfVxuXG4gIGFzPFQgZXh0ZW5kcyBhYnN0cmFjdCBuZXcgKC4uLmFyZ3M6IGFueSkgPT4gYW55Pihjb25zdHJ1Y3Rvcl9yZWY6IFQpOiBJbnN0YW5jZVR5cGU8VD4ge1xuICAgIGlmICh0aGlzLm5vZGUgaW5zdGFuY2VvZiBjb25zdHJ1Y3Rvcl9yZWYpIHJldHVybiB0aGlzLm5vZGUgYXMgSW5zdGFuY2VUeXBlPFQ+O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFJlZmVyZW5jZSBub2RlIGlzIG5vdCAke2NvbnN0cnVjdG9yX3JlZn1gKTtcbiAgfVxuICBpczxUIGV4dGVuZHMgYWJzdHJhY3QgbmV3ICguLi5hcmdzOiBhbnkpID0+IGFueT4oY29uc3RydWN0b3JfcmVmOiBUKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubm9kZSBpbnN0YW5jZW9mIGNvbnN0cnVjdG9yX3JlZjtcbiAgfVxuICBwYXNzQXM8VCBleHRlbmRzIGFic3RyYWN0IG5ldyAoLi4uYXJnczogYW55KSA9PiBhbnk+KGNvbnN0cnVjdG9yX3JlZjogVCwgZm46IChyZWZlcmVuY2U6IEluc3RhbmNlVHlwZTxUPikgPT4gdm9pZCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm5vZGUgaW5zdGFuY2VvZiBjb25zdHJ1Y3Rvcl9yZWYpIHtcbiAgICAgIGZuKHRoaXMubm9kZSBhcyBJbnN0YW5jZVR5cGU8VD4pO1xuICAgIH1cbiAgfVxuICB0cnlBczxUIGV4dGVuZHMgYWJzdHJhY3QgbmV3ICguLi5hcmdzOiBhbnkpID0+IGFueT4oY29uc3RydWN0b3JfcmVmOiBUKTogSW5zdGFuY2VUeXBlPFQ+IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5ub2RlIGluc3RhbmNlb2YgY29uc3RydWN0b3JfcmVmKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlIGFzIEluc3RhbmNlVHlwZTxUPjtcbiAgICB9XG4gIH1cblxuICBnZXQgY2xhc3NMaXN0KCkge1xuICAgIHJldHVybiB0aGlzLmFzKEhUTUxFbGVtZW50KS5jbGFzc0xpc3Q7XG4gIH1cbiAgZ2V0IGNsYXNzTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hcyhIVE1MRWxlbWVudCkuY2xhc3NOYW1lO1xuICB9XG4gIGdldCBzdHlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hcyhIVE1MRWxlbWVudCkuc3R5bGU7XG4gIH1cblxuICBnZXRBdHRyaWJ1dGUocXVhbGlmaWVkTmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuYXMoSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShxdWFsaWZpZWROYW1lKTtcbiAgfVxuICBzZXRBdHRyaWJ1dGUocXVhbGlmaWVkTmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5hcyhIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKHF1YWxpZmllZE5hbWUsIHZhbHVlKTtcbiAgfVxuICBnZXRTdHlsZVByb3BlcnR5KHByb3BlcnR5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmFzKEhUTUxFbGVtZW50KS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KTtcbiAgfVxuICBzZXRTdHlsZVByb3BlcnR5KHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudWxsLCBwcmlvcml0eT86IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuYXMoSFRNTEVsZW1lbnQpLnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5LCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gTm9kZVJlZihub2RlPzogTm9kZSB8IG51bGwpOiBDTm9kZVJlZiB7XG4gIHJldHVybiBuZXcgQ05vZGVSZWYobm9kZSk7XG59XG5cbmV4cG9ydCBjbGFzcyBDTm9kZUxpc3RSZWYgZXh0ZW5kcyBBcnJheTxDTm9kZVJlZj4ge1xuICBjb25zdHJ1Y3Rvcihub2Rlcz86IE5vZGVMaXN0IHwgTm9kZVtdIHwgbnVsbCkge1xuICAgIGlmIChub2RlcyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdSZWZlcmVuY2UgbGlzdCBpcyBudWxsLicpO1xuICAgIH1cbiAgICBpZiAobm9kZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdSZWZlcmVuY2UgbGlzdCBpcyB1bmRlZmluZWQuJyk7XG4gICAgfVxuICAgIHN1cGVyKCk7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIEFycmF5LmZyb20obm9kZXMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLnB1c2gobmV3IENOb2RlUmVmKG5vZGUpKTtcbiAgICAgIH0gY2F0Y2ggKF8pIHt9XG4gICAgfVxuICB9XG5cbiAgYXM8VCBleHRlbmRzIGFic3RyYWN0IG5ldyAoLi4uYXJnczogYW55KSA9PiBhbnk+KGNvbnN0cnVjdG9yX3JlZjogVCk6IEFycmF5PEluc3RhbmNlVHlwZTxUPj4ge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigocmVmKSA9PiByZWYuaXMoY29uc3RydWN0b3JfcmVmKSkubWFwKChyZWYpID0+IHJlZi5hcyhjb25zdHJ1Y3Rvcl9yZWYpKTtcbiAgfVxuXG4gIHBhc3NFYWNoQXM8VCBleHRlbmRzIGFic3RyYWN0IG5ldyAoLi4uYXJnczogYW55KSA9PiBhbnk+KGNvbnN0cnVjdG9yX3JlZjogVCwgZm46IChyZWZlcmVuY2U6IEluc3RhbmNlVHlwZTxUPikgPT4gdm9pZCk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgcmVmIG9mIHRoaXMpIHtcbiAgICAgIHJlZi5wYXNzQXMoY29uc3RydWN0b3JfcmVmLCBmbik7XG4gICAgfVxuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gTm9kZUxpc3RSZWYobm9kZXM/OiBOb2RlTGlzdCB8IE5vZGVbXSB8IG51bGwpOiBDTm9kZUxpc3RSZWYge1xuICByZXR1cm4gbmV3IENOb2RlTGlzdFJlZihub2Rlcyk7XG59XG5cbi8vIEFQSSBkZXNpZ25lZCBieSBOT09CIChodHRwczovL2dpdGh1Yi5jb20vTk9PQjI4NjgpXG5leHBvcnQgZnVuY3Rpb24gU2VsZWN0RWxlbWVudHMoLi4uc2VsZWN0b3JzOiBzdHJpbmdbXSkge1xuICByZXR1cm4gTm9kZUxpc3RSZWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMuam9pbignLCcpKSk7XG59XG4iLAogICAgImltcG9ydCB7IEJyb2FkY2FzdCB9IGZyb20gJy4vZXJpY2NoYXNlL0Rlc2lnbiBQYXR0ZXJuL09ic2VydmVyL0Jyb2FkY2FzdC5qcyc7XG5pbXBvcnQgeyBTbGVlcCB9IGZyb20gJy4vZXJpY2NoYXNlL1V0aWxpdHkvU2xlZXAuanMnO1xuaW1wb3J0IHsgTm9kZVJlZiwgdHlwZSBDTm9kZVJlZiB9IGZyb20gJy4vZXJpY2NoYXNlL1dlYiBBUEkvTm9kZV9VdGlsaXR5LmpzJztcblxuZXhwb3J0IGxldCBrYXJlbF94ID0gMDtcbmV4cG9ydCBsZXQga2FyZWxfeSA9IDA7XG5leHBvcnQgbGV0IGthcmVsX2ZhY2luZzogJ2Vhc3QnIHwgJ25vcnRoJyB8ICdzb3V0aCcgfCAnd2VzdCcgPSAnZWFzdCc7XG5cbmNvbnN0IGthcmVsID0gTm9kZVJlZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcja2FyZWwnKSk7XG4vLyBjb25zdCBzY2VuZSA9IE5vZGVSZWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NjZW5lJykpLmFzKEhUTUxFbGVtZW50KTtcblxubGV0IGRlbGF5ID0gMjUwO1xuY29uc3QgYmFsbFBvc2l0aW9uID0gbmV3IE1hcDxzdHJpbmcsIENOb2RlUmVmPigpO1xuY29uc3Qgd2FsbEhQb3NpdGlvbiA9IG5ldyBNYXA8c3RyaW5nLCBDTm9kZVJlZj4oKTtcbmNvbnN0IHdhbGxWUG9zaXRpb24gPSBuZXcgTWFwPHN0cmluZywgQ05vZGVSZWY+KCk7XG5cbmxldCBtYXBXID0gMDtcbmxldCBtYXBIID0gMDtcblxuY29uc3QgZG9tUGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuY29uc3QgcGFyc2VIVE1MID0gKGh0bWw6IHN0cmluZykgPT4ge1xuICByZXR1cm4gZG9tUGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sLCAndGV4dC9odG1sJyk7XG59O1xuXG5jb25zdCBvblVwZGF0ZSA9IG5ldyBCcm9hZGNhc3Q8dm9pZD4oKTtcbm9uVXBkYXRlLnN1YnNjcmliZSgoKSA9PiB7XG4gIGRyYXdLYXJlbCgpO1xufSk7XG5kcmF3S2FyZWwoKTtcblxuZnVuY3Rpb24gZHJhd0thcmVsKCkge1xuICBrYXJlbC5zdHlsZS5sZWZ0ID0gYCR7NCArIDQgKyBrYXJlbF94ICogNjl9cHhgOyAvLyBib3JkZXIgKyBtaXNzaW5nIHdpZHRoLzJcbiAga2FyZWwuc3R5bGUudG9wID0gYCR7NCArIDQgKyBrYXJlbF95ICogNjl9cHhgOyAvLyBib3JkZXIgKyBtaXNzaW5nIGhlaWdodC8yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdGVwc1BlclNlY29uZChzdGVwczogbnVtYmVyKSB7XG4gIGRlbGF5ID0gMTAwMCAvIHN0ZXBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd01hcCh3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICBtYXBXID0gdztcbiAgbWFwSCA9IGg7XG5cbiAgLy8gd2FsbHNcbiAgY29uc3QgYm9yZGVyID0gTm9kZVJlZihwYXJzZUhUTUwoYDxkaXYgY2xhc3M9XCJlbnRpdHkgYm9yZGVyXCI+PC9kaXY+YCkuYm9keS5jaGlsZHJlblswXSk7XG4gIGJvcmRlci5zdHlsZS53aWR0aCA9IGAke3cgKiA2OX1weGA7XG4gIGJvcmRlci5zdHlsZS5oZWlnaHQgPSBgJHtoICogNjl9cHhgO1xuICBib3JkZXIuc3R5bGUubGVmdCA9IGAkezR9cHhgOyAvLyBib3JkZXJcbiAgYm9yZGVyLnN0eWxlLnRvcCA9IGAkezR9cHhgOyAvLyBib3JkZXJcbiAga2FyZWwuYXMoSFRNTEVsZW1lbnQpLmJlZm9yZShib3JkZXIuYXMoSFRNTEVsZW1lbnQpKTtcblxuICAvLyBkb3RzXG4gIGZvciAobGV0IGogPSAwOyBqIDwgaDsgaisrKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3OyBpKyspIHtcbiAgICAgIGNvbnN0IGRvdCA9IE5vZGVSZWYocGFyc2VIVE1MKGA8ZGl2IGNsYXNzPVwiZW50aXR5IGRvdFwiPjxpbWcgc3JjPVwiLi9hc3NldHMvZG90LnBuZ1wiIGFsdD1cImRvdFwiIC8+PC9kaXY+YCkuYm9keS5jaGlsZHJlblswXSk7XG4gICAgICBkb3Quc3R5bGUubGVmdCA9IGAkezQgKyBpICogNjl9cHhgO1xuICAgICAgZG90LnN0eWxlLnRvcCA9IGAkezQgKyBqICogNjl9cHhgO1xuICAgICAga2FyZWwuYXMoSFRNTEVsZW1lbnQpLmJlZm9yZShkb3QuYXMoSFRNTEVsZW1lbnQpKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdCYWxsKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gIGNvbnN0IGJhbGwgPSBhZGRCYWxsKE5vZGVSZWYocGFyc2VIVE1MKGA8ZGl2IGNsYXNzPVwiZW50aXR5IGJhbGxcIj48aW1nIHNyYz1cIi4vYXNzZXRzL2JhbGwucG5nXCIgYWx0PVwiYmFsbFwiIC8+PC9kaXY+YCkuYm9keS5jaGlsZHJlblswXSksIHgsIHkpO1xuICBrYXJlbC5hcyhIVE1MRWxlbWVudCkuYmVmb3JlKGJhbGwuYXMoSFRNTEVsZW1lbnQpKTtcbiAgYmFsbC5zdHlsZS5sZWZ0ID0gYCR7NCArIDUgKyB4ICogNjl9cHhgOyAvLyBib3JkZXIgKyBtaXNzaW5nIHdpZHRoLzJcbiAgYmFsbC5zdHlsZS50b3AgPSBgJHs0ICsgNSArIHkgKiA2OX1weGA7IC8vIGJvcmRlciArIG1pc3NpbmcgaGVpZ2h0LzJcbn1cbmV4cG9ydCBmdW5jdGlvbiBkcmF3V2FsbEgoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgY29uc3Qgd2FsbEggPSBhZGRXYWxsSChOb2RlUmVmKHBhcnNlSFRNTChgPGRpdiBjbGFzcz1cImVudGl0eSB3YWxsaFwiPjxpbWcgc3JjPVwiLi9hc3NldHMvd2FsbGgucG5nXCIgYWx0PVwid2FsbGhcIiAvPjwvZGl2PmApLmJvZHkuY2hpbGRyZW5bMF0pLCB4LCB5KTtcbiAga2FyZWwuYXMoSFRNTEVsZW1lbnQpLmJlZm9yZSh3YWxsSC5hcyhIVE1MRWxlbWVudCkpO1xuICB3YWxsSC5zdHlsZS5sZWZ0ID0gYCR7NCArIHggKiA2OX1weGA7IC8vIGJvcmRlciArIG1pc3Npbmcgd2lkdGgvMlxuICB3YWxsSC5zdHlsZS50b3AgPSBgJHs0ICsgeSAqIDY5fXB4YDsgLy8gYm9yZGVyICsgbWlzc2luZyBoZWlnaHQvMlxufVxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdXYWxsVih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICBjb25zdCB3YWxsViA9IGFkZFdhbGxWKE5vZGVSZWYocGFyc2VIVE1MKGA8ZGl2IGNsYXNzPVwiZW50aXR5IHdhbGx2XCI+PGltZyBzcmM9XCIuL2Fzc2V0cy93YWxsdi5wbmdcIiBhbHQ9XCJ3YWxsdlwiIC8+PC9kaXY+YCkuYm9keS5jaGlsZHJlblswXSksIHgsIHkpO1xuICBrYXJlbC5hcyhIVE1MRWxlbWVudCkuYmVmb3JlKHdhbGxWLmFzKEhUTUxFbGVtZW50KSk7XG4gIHdhbGxWLnN0eWxlLmxlZnQgPSBgJHs0ICsgeCAqIDY5fXB4YDsgLy8gYm9yZGVyICsgbWlzc2luZyB3aWR0aC8yXG4gIHdhbGxWLnN0eWxlLnRvcCA9IGAkezQgKyB5ICogNjl9cHhgOyAvLyBib3JkZXIgKyBtaXNzaW5nIGhlaWdodC8yXG59XG5cbmZ1bmN0aW9uIHh5KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IHgsIHkgfSk7XG59XG5cbi8vIGJhbGxQb3NpdGlvbi5nZXQoeHkoeCwgeSkpO1xuLy8gYmFsbFBvc2l0aW9uLnNldCh4eSh4LCB5KSwgZGF0YSk7XG4vLyBiYWxsUG9zaXRpb24uZGVsZXRlKHh5KHgsIHkpKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZhY2luZ0Vhc3QoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGZhY2luZ05vcnRoKCkge31cbmV4cG9ydCBmdW5jdGlvbiBmYWNpbmdTb3V0aCgpIHt9XG5leHBvcnQgZnVuY3Rpb24gZmFjaW5nV2VzdCgpIHt9XG5leHBvcnQgZnVuY3Rpb24gZnJvbnRJc0Jsb2NrZWQoKSB7XG4gIHJldHVybiAhZnJvbnRJc0NsZWFyKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbnRJc0NsZWFyKCkge1xuICBpZiAoZmFjaW5nV2FsbEgoKSB8fCBmYWNpbmdXYWxsVigpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN3aXRjaCAoa2FyZWxfZmFjaW5nKSB7XG4gICAgY2FzZSAnbm9ydGgnOlxuICAgICAgaWYgKGthcmVsX3kgPT09IDApIHJldHVybiBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3NvdXRoJzpcbiAgICAgIGlmIChrYXJlbF95ID09PSBtYXBIIC0gMSkgcmV0dXJuIGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnd2VzdCc6XG4gICAgICBpZiAoa2FyZWxfeCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZWFzdCc6XG4gICAgICBpZiAoa2FyZWxfeCA9PT0gbWFwVyAtIDEpIHJldHVybiBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGxlZnRJc0Jsb2NrZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGxlZnRJc0NsZWFyKCkge31cbmV4cG9ydCBmdW5jdGlvbiBub3RGYWNpbmdFYXN0KCkge31cbmV4cG9ydCBmdW5jdGlvbiBub3RGYWNpbmdOb3J0aCgpIHt9XG5leHBvcnQgZnVuY3Rpb24gbm90RmFjaW5nU291dGgoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIG5vdEZhY2luZ1dlc3QoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIHJpZ2h0SXNCbG9ja2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiByaWdodElzQ2xlYXIoKSB7fVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHR1cm5MZWZ0KCkge1xuICBhd2FpdCBTbGVlcChkZWxheSAvIDIpO1xuICBzd2l0Y2ggKGthcmVsX2ZhY2luZykge1xuICAgIGNhc2UgJ25vcnRoJzpcbiAgICAgIGthcmVsX2ZhY2luZyA9ICd3ZXN0JztcbiAgICAgIGthcmVsLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoMTgwZGVnKSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzb3V0aCc6XG4gICAgICBrYXJlbF9mYWNpbmcgPSAnZWFzdCc7XG4gICAgICBrYXJlbC5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKDBkZWcpJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3dlc3QnOlxuICAgICAga2FyZWxfZmFjaW5nID0gJ3NvdXRoJztcbiAgICAgIGthcmVsLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoOTBkZWcpJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Vhc3QnOlxuICAgICAga2FyZWxfZmFjaW5nID0gJ25vcnRoJztcbiAgICAgIGthcmVsLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoMjcwZGVnKSc7XG4gICAgICBicmVhaztcbiAgfVxuICBhd2FpdCBTbGVlcChkZWxheSAvIDIpO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHR1cm5SaWdodCgpIHtcbiAgY29uc29sZS5sb2coJ3R1cm5SaWdodCcpO1xuICBhd2FpdCBTbGVlcChkZWxheSAvIDIpO1xuICBzd2l0Y2ggKGthcmVsX2ZhY2luZykge1xuICAgIGNhc2UgJ25vcnRoJzpcbiAgICAgIGthcmVsX2ZhY2luZyA9ICdlYXN0JztcbiAgICAgIGthcmVsLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoMGRlZyknO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc291dGgnOlxuICAgICAga2FyZWxfZmFjaW5nID0gJ3dlc3QnO1xuICAgICAga2FyZWwuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSgxODBkZWcpJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3dlc3QnOlxuICAgICAga2FyZWxfZmFjaW5nID0gJ25vcnRoJztcbiAgICAgIGthcmVsLnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoMjcwZGVnKSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdlYXN0JzpcbiAgICAgIGthcmVsX2ZhY2luZyA9ICdzb3V0aCc7XG4gICAgICBrYXJlbC5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKDkwZGVnKSc7XG4gICAgICBicmVhaztcbiAgfVxuICBhd2FpdCBTbGVlcChkZWxheSAvIDIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQmFsbChiYWxsOiBDTm9kZVJlZiwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgY29uc3QgcmVmID0gYmFsbFBvc2l0aW9uLmdldCh4eSh4LCB5KSk7XG4gIGlmIChyZWYpIHJldHVybiByZWY7XG4gIGJhbGxQb3NpdGlvbi5zZXQoeHkoeCwgeSksIGJhbGwpO1xuICByZXR1cm4gYmFsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBiYWxsc1ByZXNlbnQoKSB7XG4gIHJldHVybiBiYWxsUG9zaXRpb24uZ2V0KHh5KGthcmVsX3gsIGthcmVsX3kpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub0JhbGxzUHJlc2VudCgpIHtcbiAgcmV0dXJuICFiYWxsc1ByZXNlbnQoKTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0YWtlQmFsbCgpIHtcbiAgY29uc3QgcmVmID0gYmFsbFBvc2l0aW9uLmdldCh4eShrYXJlbF94LCBrYXJlbF95KSk7XG4gIGlmIChyZWYpIHtcbiAgICBiYWxsUG9zaXRpb24uZGVsZXRlKHh5KGthcmVsX3gsIGthcmVsX3kpKTtcbiAgICBhd2FpdCBTbGVlcChkZWxheSk7XG4gICAgcmVmLmFzKEVsZW1lbnQpLnJlbW92ZSgpO1xuICB9IGVsc2Uge1xuICAgIHRocm93ICdUaGVyZSBpcyBubyBiYWxsISc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFdhbGxIKHdhbGxIOiBDTm9kZVJlZiwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgY29uc3QgcmVmID0gd2FsbEhQb3NpdGlvbi5nZXQoeHkoeCwgeSkpO1xuICBpZiAocmVmKSByZXR1cm4gcmVmO1xuICB3YWxsSFBvc2l0aW9uLnNldCh4eSh4LCB5KSwgd2FsbEgpO1xuICByZXR1cm4gd2FsbEg7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkV2FsbFYod2FsbFY6IENOb2RlUmVmLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICBjb25zdCByZWYgPSB3YWxsVlBvc2l0aW9uLmdldCh4eSh4LCB5KSk7XG4gIGlmIChyZWYpIHJldHVybiByZWY7XG4gIHdhbGxWUG9zaXRpb24uc2V0KHh5KHgsIHkpLCB3YWxsVik7XG4gIHJldHVybiB3YWxsVjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmYWNpbmdXYWxsSCgpIHtcbiAgc3dpdGNoIChrYXJlbF9mYWNpbmcpIHtcbiAgICBjYXNlICdub3J0aCc6XG4gICAgICBpZiAod2FsbEhQb3NpdGlvbi5nZXQoeHkoa2FyZWxfeCwga2FyZWxfeSkpKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3NvdXRoJzpcbiAgICAgIGlmICh3YWxsSFBvc2l0aW9uLmdldCh4eShrYXJlbF94LCBrYXJlbF95KSkpIHJldHVybiB0cnVlO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZhY2luZ1dhbGxWKCkge1xuICBzd2l0Y2ggKGthcmVsX2ZhY2luZykge1xuICAgIGNhc2UgJ3dlc3QnOlxuICAgICAgaWYgKHdhbGxWUG9zaXRpb24uZ2V0KHh5KGthcmVsX3ggLSAxLCBrYXJlbF95KSkpIHJldHVybiB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZWFzdCc6XG4gICAgICBpZiAod2FsbFZQb3NpdGlvbi5nZXQoeHkoa2FyZWxfeCArIDEsIGthcmVsX3kpKSkgcmV0dXJuIHRydWU7XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdGFydCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICBrYXJlbF94ID0geDtcbiAga2FyZWxfeSA9IHk7XG4gIG9uVXBkYXRlLnNlbmQoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1vdmUoKSB7XG4gIGlmIChmcm9udElzQ2xlYXIoKSA9PT0gZmFsc2UpIHtcbiAgICB0aHJvdyAnS2FyZWwgcmFuIGludG8gc29tZXRoaW5nISc7XG4gIH1cbiAgc3dpdGNoIChrYXJlbF9mYWNpbmcpIHtcbiAgICBjYXNlICdub3J0aCc6XG4gICAgICBrYXJlbF95IC09IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzb3V0aCc6XG4gICAgICBrYXJlbF95ICs9IDE7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd3ZXN0JzpcbiAgICAgIGthcmVsX3ggLT0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Vhc3QnOlxuICAgICAga2FyZWxfeCArPSAxO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgYXdhaXQgU2xlZXAoZGVsYXkpO1xuICBvblVwZGF0ZS5zZW5kKCk7XG59XG4iLAogICAgImV4cG9ydCBjb25zdCBzZXJ2ZXJfaG9zdG5hbWUgPSAnMTI3LjAuMC4xJztcbmV4cG9ydCBjb25zdCBzZXJ2ZXJfcG9ydCA9ICc4MDAwJztcblxuZXhwb3J0IGNvbnN0IHNlcnZlcl9odHRwID0gYGh0dHA6Ly8ke3NlcnZlcl9ob3N0bmFtZX06JHtzZXJ2ZXJfcG9ydH1gO1xuZXhwb3J0IGNvbnN0IHNlcnZlcl93cyA9IGB3czovLyR7c2VydmVyX2hvc3RuYW1lfToke3NlcnZlcl9wb3J0fWA7XG4iLAogICAgImltcG9ydCB7IHNlcnZlcl93cyB9IGZyb20gJy4vc2VydmVyLWRhdGEuanMnO1xuXG5sZXQgc29ja2V0OiBXZWJTb2NrZXQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbmZ1bmN0aW9uIG9uTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50PGFueT4pIHtcbiAgaWYgKGV2ZW50LmRhdGEgPT09ICdyZWxvYWQnKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9XG59XG5mdW5jdGlvbiBvbkNsb3NlKCkge1xuICBzb2NrZXRfY2xlYW51cCgpO1xufVxuZnVuY3Rpb24gb25FcnJvcigpIHtcbiAgc29ja2V0X2NsZWFudXAoKTtcbn1cblxuZnVuY3Rpb24gc29ja2V0X2NsZWFudXAoKSB7XG4gIGlmIChzb2NrZXQpIHtcbiAgICBzb2NrZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG9uTWVzc2FnZSk7XG4gICAgc29ja2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgb25DbG9zZSk7XG4gICAgc29ja2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgc29ja2V0X3Jlc3RhcnQoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc29ja2V0X3Jlc3RhcnQoKSB7XG4gIGNvbnNvbGUubG9nKCdzb2NrZXRfcmVzdGFydCcpO1xuICBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNlcnZlcl93cyk7XG4gIGlmIChzb2NrZXQpIHtcbiAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG9uTWVzc2FnZSk7XG4gICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgb25DbG9zZSk7XG4gICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gIH1cbn1cbiIsCiAgICAiaW1wb3J0IHsgZHJhd01hcCwgZHJhd1dhbGxILCBmcm9udElzQ2xlYXIsIG1vdmUsIHNldFN0ZXBzUGVyU2Vjb25kLCBzdGFydCwgdHVybkxlZnQsIHR1cm5SaWdodCB9IGZyb20gJy4vbGliL2NvbW1hbmRzLmpzJztcblxuaW1wb3J0IHsgc29ja2V0X3Jlc3RhcnQgfSBmcm9tICcuL2Rldl9zZXJ2ZXIvaG90cmVsb2FkLmpzJztcbnNvY2tldF9yZXN0YXJ0KCk7XG5cbi8vIHNldHVwIHNjZW5lXG5cbmRyYXdNYXAoOCwgOCk7XG5cbigoKSA9PiB7XG4gIC8vIHkgPSAxXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDEpO1xuICB9XG4gIC8vIHkgPSAyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDIpO1xuICB9XG4gIGZvciAobGV0IGkgPSA1OyBpIDwgODsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDIpO1xuICB9XG4gIC8vIHkgPSAzXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgODsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDMpO1xuICB9XG4gIC8vIHkgPSA0XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDQpO1xuICB9XG4gIGZvciAobGV0IGkgPSAyOyBpIDwgODsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDQpO1xuICB9XG4gIC8vIHkgPSA1XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDUpO1xuICB9XG4gIGZvciAobGV0IGkgPSA2OyBpIDwgODsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDUpO1xuICB9XG4gIC8vIHkgPSA2XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDYpO1xuICB9XG4gIGZvciAobGV0IGkgPSAzOyBpIDwgODsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDYpO1xuICB9XG4gIC8vIHkgPSA3XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgZHJhd1dhbGxIKGksIDcpO1xuICB9XG59KSgpO1xuXG5zZXRTdGVwc1BlclNlY29uZCgxMCk7XG5cbi8vIHN0ZXBzXG5cbnRyeSB7XG4gIGF3YWl0IHN0YXJ0KDAsIDcpO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIC8vIGZsb29yIDFcbiAgICB3aGlsZSAoZnJvbnRJc0NsZWFyKCkpIHtcbiAgICAgIGF3YWl0IG1vdmUoKTtcbiAgICB9XG4gICAgYXdhaXQgdHVybkxlZnQoKTtcbiAgICBhd2FpdCBtb3ZlKCk7XG4gICAgYXdhaXQgdHVybkxlZnQoKTtcbiAgICAvLyBmbG9vciAyXG4gICAgd2hpbGUgKGZyb250SXNDbGVhcigpKSB7XG4gICAgICBhd2FpdCBtb3ZlKCk7XG4gICAgfVxuICAgIGF3YWl0IHR1cm5SaWdodCgpO1xuICAgIGF3YWl0IHR1cm5SaWdodCgpO1xuICAgIGF3YWl0IG1vdmUoKTtcbiAgICBhd2FpdCBtb3ZlKCk7XG4gICAgYXdhaXQgdHVybkxlZnQoKTtcbiAgICBhd2FpdCBtb3ZlKCk7XG4gICAgYXdhaXQgdHVybkxlZnQoKTtcbiAgICAvLyBmbG9vciAzXG4gICAgd2hpbGUgKGZyb250SXNDbGVhcigpKSB7XG4gICAgICBhd2FpdCBtb3ZlKCk7XG4gICAgfVxuICAgIGF3YWl0IHR1cm5SaWdodCgpO1xuICAgIGF3YWl0IHR1cm5SaWdodCgpO1xuICAgIHdoaWxlIChmcm9udElzQ2xlYXIoKSkge1xuICAgICAgYXdhaXQgbW92ZSgpO1xuICAgIH1cbiAgICBhd2FpdCB0dXJuTGVmdCgpO1xuICAgIGF3YWl0IHR1cm5MZWZ0KCk7XG4gICAgYXdhaXQgbW92ZSgpO1xuICAgIGF3YWl0IG1vdmUoKTtcbiAgICBhd2FpdCB0dXJuUmlnaHQoKTtcbiAgICBhd2FpdCBtb3ZlKCk7XG4gICAgYXdhaXQgdHVyblJpZ2h0KCk7XG4gICAgLy8gZmxvb3IgNFxuICAgIHdoaWxlIChmcm9udElzQ2xlYXIoKSkge1xuICAgICAgYXdhaXQgbW92ZSgpO1xuICAgIH1cbiAgICBhd2FpdCB0dXJuTGVmdCgpO1xuICAgIGF3YWl0IHR1cm5MZWZ0KCk7XG4gICAgd2hpbGUgKGZyb250SXNDbGVhcigpKSB7XG4gICAgICBhd2FpdCBtb3ZlKCk7XG4gICAgfVxuICAgIGF3YWl0IHR1cm5SaWdodCgpO1xuICAgIGF3YWl0IHR1cm5SaWdodCgpO1xuICAgIGF3YWl0IG1vdmUoKTtcbiAgICBhd2FpdCB0dXJuTGVmdCgpO1xuICAgIGF3YWl0IG1vdmUoKTtcbiAgICBhd2FpdCB0dXJuUmlnaHQoKTtcbiAgICAvLyBmbG9vciA1XG4gICAgd2hpbGUgKGZyb250SXNDbGVhcigpKSB7XG4gICAgICBhd2FpdCBtb3ZlKCk7XG4gICAgfVxuICAgIGF3YWl0IHR1cm5MZWZ0KCk7XG4gICAgYXdhaXQgdHVybkxlZnQoKTtcbiAgICB3aGlsZSAoZnJvbnRJc0NsZWFyKCkpIHtcbiAgICAgIGF3YWl0IG1vdmUoKTtcbiAgICB9XG4gICAgYXdhaXQgdHVyblJpZ2h0KCk7XG4gICAgYXdhaXQgbW92ZSgpO1xuICAgIGF3YWl0IHR1cm5SaWdodCgpO1xuICAgIC8vIGZsb29yIDZcbiAgICB3aGlsZSAoZnJvbnRJc0NsZWFyKCkpIHtcbiAgICAgIGF3YWl0IG1vdmUoKTtcbiAgICB9XG4gICAgYXdhaXQgdHVybkxlZnQoKTtcbiAgICBhd2FpdCB0dXJuTGVmdCgpO1xuICAgIGF3YWl0IG1vdmUoKTtcbiAgICBhd2FpdCBtb3ZlKCk7XG4gICAgYXdhaXQgbW92ZSgpO1xuICAgIGF3YWl0IHR1cm5SaWdodCgpO1xuICAgIGF3YWl0IG1vdmUoKTtcbiAgICBhd2FpdCB0dXJuTGVmdCgpO1xuICAgIC8vIGZsb29yIDdcbiAgICB3aGlsZSAoZnJvbnRJc0NsZWFyKCkpIHtcbiAgICAgIGF3YWl0IG1vdmUoKTtcbiAgICB9XG4gICAgYXdhaXQgdHVyblJpZ2h0KCk7XG4gICAgYXdhaXQgdHVyblJpZ2h0KCk7XG4gICAgd2hpbGUgKGZyb250SXNDbGVhcigpKSB7XG4gICAgICBhd2FpdCBtb3ZlKCk7XG4gICAgfVxuICAgIGF3YWl0IHR1cm5MZWZ0KCk7XG4gICAgYXdhaXQgbW92ZSgpO1xuICAgIGF3YWl0IHR1cm5MZWZ0KCk7XG4gICAgLy8gZmxvb3IgOFxuICAgIHdoaWxlIChmcm9udElzQ2xlYXIoKSkge1xuICAgICAgYXdhaXQgbW92ZSgpO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuICBjb25zb2xlLmxvZygnZG9uZScpO1xufSBjYXRjaCAoZXJyb3Ip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VTtBQUVoQixXQUFPLGFBQWEsR0FBRztBQUNyQixZQUFNLEtBQUs7QUFBQSxJQUNiO0FBQ0EsVUFBTSxTQUFTO0FBQ2YsVUFBTSxTQUFTO0FBQ2YsVUFBTSxLQUFLO0FBQ1gsVUFBTSxLQUFLO0FBQ1gsVUFBTSxLQUFLO0FBQ1gsVUFBTSxVQUFVO0FBQ2hCLFVBQU0sS0FBSztBQUNYLFVBQU0sU0FBUztBQUVmLFdBQU8sYUFBYSxHQUFHO0FBQ3JCLFlBQU0sS0FBSztBQUFBLElBQ2I7QUFDQSxVQUFNLFVBQVU7QUFDaEIsVUFBTSxVQUFVO0FBQ2hCLFdBQU8sYUFBYSxHQUFHO0FBQ3JCLFlBQU0sS0FBSztBQUFBLElBQ2I7QUFDQSxVQUFNLFNBQVM7QUFDZixVQUFNLEtBQUs7QUFDWCxVQUFNLFNBQVM7QUFFZixXQUFPLGFBQWEsR0FBRztBQUNyQixZQUFNLEtBQUs7QUFBQSxJQUNiO0FBQ0E7QUFBQSxFQUNGO0FBQ0EsVUFBUSxJQUFJLE1BQU07QUFBQSxTQUNYLE9BQVA7QUFDQSxVQUFRLE1BQU0sS0FBSztBQUFBOyIsCiAgImRlYnVnSWQiOiAiNEM2RTM0NjM0MzMzNTk2OTY0NzU2RTIxNjQ3NTZFMjEiLAogICJuYW1lcyI6IFtdCn0=
