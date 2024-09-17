import { ballsPresent, createFence, facingFence, frontIsBlocked, move, start, takeBall, turnLeft, turnRight } from './lib/commands.js';

// setup scene

createFence(1, 9);
createFence(4, 9);
createFence(5, 9);
createFence(8, 9);
createFence(9, 9);

// steps

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
