export default class Add {
  constructor(multiplier) {
    this.multiplier = multiplier;
  }

  add = (a, b) => this.multiplier * (a + b);
}
