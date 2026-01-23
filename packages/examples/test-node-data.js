import { AddNode } from './src/nodes/index';
import 'reflect-metadata';

const metadata = Reflect.getMetadata('node:metadata', AddNode);
const inputs = Reflect.getMetadata('node:inputs', AddNode);
const outputs = Reflect.getMetadata('node:outputs', AddNode);

console.log('Metadata:', metadata);
console.log('Inputs:', inputs);
console.log('Outputs:', outputs);
