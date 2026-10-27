import test from 'node:test';
import assert from 'node:assert/strict';
import {collection} from '../lib/validation.js';
const item={id:'s1',name:'Servicio',cost:31,start:'2026-10-26',end:'2026-11-26',alert:7,cycle:'month'};
test('acepta período válido',()=>assert.equal(collection.safeParse({items:[item],version:0}).success,true));
test('rechaza fechas imposibles y costos negativos',()=>{for(const changes of [{start:'2026-02-30'},{cost:-1},{end:'2026-10-01'},{alert:NaN}])assert.equal(collection.safeParse({items:[{...item,...changes}],version:0}).success,false)});
test('rechaza ids duplicados y versiones inválidas',()=>{assert.equal(collection.safeParse({items:[item,item],version:0}).success,false);assert.equal(collection.safeParse({items:[],version:-1}).success,false)});
