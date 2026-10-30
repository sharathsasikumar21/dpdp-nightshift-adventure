import test from 'node:test';
import assert from 'node:assert/strict';
import {decisionSeconds,decisionNotice} from '../mission-guidance.js';
test('all timed questions have thirty seconds regardless of shift length or difficulty',()=>{
 for(const total of [6,9,15])for(let turn=0;turn<total;turn++){
  assert.equal(decisionSeconds(turn,total),30);
  assert.match(decisionNotice(turn,total),/30 seconds/);
  assert.doesNotMatch(decisionNotice(turn,total),/reduced/);
 }
});
test('untimed briefings do not announce a time limit',()=>{
 assert.equal(decisionNotice(6,9,false),'Untimed shift: investigate and decide at your own pace.');
});
