import { InsertValue } from "./storage";

let x = 0, prev = 0;

export const addData = (about: number): InsertValue => {
  x += Math.random();

  let value = about === 0 ? 0 : Math.sin(x)*0.5 + about;
  value = (prev+value)/2;

  prev = value;

  return {
    timestamp: Date.now(),
    value
  };
}