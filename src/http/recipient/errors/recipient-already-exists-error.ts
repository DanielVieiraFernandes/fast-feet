export class RecipientAlreadyExistsError extends Error {
    constructor() {
      super('Recipient already exists');
    }
  }
  