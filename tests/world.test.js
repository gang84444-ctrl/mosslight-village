import test from 'node:test';
import assert from 'node:assert/strict';
import { createRoofGeometry, character, setCharacterColor } from '../src/world.js';
test('roof sits above walls without covering doors and windows',()=>{
  const g=createRoofGeometry();g.computeBoundingBox();
  assert.ok(g.boundingBox.min.y>=0);
  assert.ok(g.boundingBox.max.y<=1.7);
  assert.ok(g.boundingBox.max.x-g.boundingBox.min.x>=4.3);
  assert.ok(g.boundingBox.max.z-g.boundingBox.min.z>=3.5);
  g.dispose();
});
test('changing a remote outfit updates its body without recoloring another visitor',()=>{
  const a=character('#eaa06c'),b=character('#eaa06c');
  setCharacterColor(a,'#7faac1');
  assert.equal(a.children[0].material.color.getHexString(),'7faac1');
  assert.equal(b.children[0].material.color.getHexString(),'eaa06c');
});
