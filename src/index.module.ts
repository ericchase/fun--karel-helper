import { drawMap, drawWallH, frontIsClear, move, setStepsPerSecond, start, turnLeft, turnRight } from './lib/commands.js';

import { socket_restart } from './dev_server/hotreload.js';
socket_restart();

// setup scene

drawMap(8, 8);

(() => {
  // y = 1
  for (let i = 0; i < 7; i++) {
    drawWallH(i, 1);
  }
  // y = 2
  for (let i = 0; i < 4; i++) {
    drawWallH(i, 2);
  }
  for (let i = 5; i < 8; i++) {
    drawWallH(i, 2);
  }
  // y = 3
  for (let i = 1; i < 8; i++) {
    drawWallH(i, 3);
  }
  // y = 4
  for (let i = 0; i < 1; i++) {
    drawWallH(i, 4);
  }
  for (let i = 2; i < 8; i++) {
    drawWallH(i, 4);
  }
  // y = 5
  for (let i = 0; i < 5; i++) {
    drawWallH(i, 5);
  }
  for (let i = 6; i < 8; i++) {
    drawWallH(i, 5);
  }
  // y = 6
  for (let i = 0; i < 2; i++) {
    drawWallH(i, 6);
  }
  for (let i = 3; i < 8; i++) {
    drawWallH(i, 6);
  }
  // y = 7
  for (let i = 0; i < 7; i++) {
    drawWallH(i, 7);
  }
})();

setStepsPerSecond(10);

// steps

try {
  await start(0, 7);
  while (true) {
    // floor 1
    while (frontIsClear()) {
      await move();
    }
    await turnLeft();
    await move();
    await turnLeft();
    // floor 2
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
    // floor 3
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
    // floor 4
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
    // floor 5
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
    // floor 6
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
    // floor 7
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
    // floor 8
    while (frontIsClear()) {
      await move();
    }
    break;
  }
  console.log('done');
} catch (error) {
  console.error(error);
}
