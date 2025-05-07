export class OrderHasAlreadyBeenDeliveredError extends Error {
  constructor() {
    super('order cannot be marked as delivered as it has not been withdrawn');
  }
}
