import { clothing } from "./clothing";
import { electronics } from "./electronics";
import { jewlery } from "./jewlery";
import { groceries } from "./groceries";
import { funriture } from "./furniture";
export const items = [
  ...groceries,
  ...electronics,
  ...clothing,
  ...funriture,
  ...jewlery,
];
