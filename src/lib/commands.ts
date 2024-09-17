import { JobQueue } from './ericchase/Utility/JobQueue.js';
import type { CNodeRef } from './ericchase/Web API/Node_Utility.js';

export let karel_x = 0;
export let karel_y = 9;
export let karel_facing: 'east' | 'north' | 'south' | 'west' = 'east';

export const positions = new Map<{ x: number; y: number }, CNodeRef>();

export const GameLoop = new JobQueue(500);

export function ballsPresent() {}
export function facingEast() {}
export function facingNorth() {}
export function facingSouth() {}
export function facingWest() {}
export function frontIsBlocked() {}
export function frontIsClear() {}
export function leftIsBlocked() {}
export function leftIsClear() {}
export function move() {
  GameLoop.add(async () => {
    switch (karel_facing) {
      case 'east':
        karel_x += 1;
        break;
      case 'north':
        karel_y -= 1;
        break;
      case 'south':
        karel_y += 1;
        break;
      case 'west':
        karel_x -= 1;
        break;
    }
  });
}
export function noBallsPresent() {}
export function notFacingEast() {}
export function notFacingNorth() {}
export function notFacingSouth() {}
export function notFacingWest() {}
export function rightIsBlocked() {}
export function rightIsClear() {}
export function turnLeft() {}
export function turnRight() {}

export function addBall(ball: CNodeRef, x: number, y: number) {
  const atposition = positions.get({ x, y });
  if (atposition) {
    return atposition;
  }
  positions.set({ x, y }, ball);
  return ball;
}
export function takeBall(x: number, y: number) {
  if (positions.has({ x, y })) {
    positions.delete({ x, y });
  }
}

export function start(x: number, y: number) {
  karel_x = x;
  karel_y = y;
}
