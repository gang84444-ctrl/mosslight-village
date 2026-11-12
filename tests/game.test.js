import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, move, harvest, place, restore, walkable } from '../src/game.js';

test('movement stops at the coast and inside buildings', () => {
  const s = createState();
  s.player = { x: 0, z: 0 };
  move(s, 100, 0, []);
  assert.deepEqual(s.player, { x: 0, z: 0 });
  move(s, 1, 0, [{ x: 1, z: 0, r: 1 }]);
  assert.equal(s.player.x, 0);
  move(s, 1, 1, []);
  assert.deepEqual(s.player, { x: 1, z: 1 });
  assert.equal(walkable(NaN, 0, []), false);
});
test('nearby harvest rewards once and regrows after one minute', () => {
  const s = createState(); s.player = { x: 1, z: 1 };
  const tree = { id: 'tree-1', x: 1, z: 2 };
  assert.equal(harvest(s, tree, 1000), true);
  assert.equal(s.fruit, 1); assert.equal(s.coins, 145);
  assert.equal(harvest(s, tree, 2000), false);
  assert.equal(harvest(s, tree, 61000), true);
  assert.equal(s.fruit, 2);
  assert.equal(harvest(s, { id: 'far', x: 20, z: 20 }, 62000), false);
});
test('decorating charges only for valid free land and available funds', () => {
  const s = createState();
  assert.equal(place(s, 'bench', 0, 0, []), true);
  assert.equal(s.coins, 40);
  assert.equal(place(s, 'bench', 3, 0, []), false);
  assert.equal(place(s, 'flower', 0, 0, []), false);
  assert.equal(place(s, 'flower', 30, 0, []), false);
  assert.equal(place(s, 'unknown', 2, 2, []), false);
  assert.equal(place(s, 'flower', NaN, 0, []), false);
  assert.equal(s.decor.length, 1);
});
test('corrupted or malicious saves recover safely without executable content', () => {
  assert.equal(restore('broken').coins, 120);
  const s = restore(JSON.stringify({ coins: -99, player: { x: 999, z: 0 }, decor: [{ type: 'bad', x: 0, z: 0 }], name: '<script>x</script>' }));
  assert.equal(s.coins, 120);
  assert.deepEqual(s.player, createState().player);
  assert.equal(s.decor.length, 0);
  assert.equal(restore(JSON.stringify({ ...createState(), coins: 250 })).coins, 250);
});
