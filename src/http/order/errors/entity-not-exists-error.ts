export class EntityNotExistsError extends Error {
  constructor(entity: 'recipient' | 'deliveryman') {
    super(`Entity: ${entity} already exists`);
  }
}
