export class OrderAlreadyExistsOnDatabase extends Error {
  constructor() {
    super('Order already exists on database');
  }
}
