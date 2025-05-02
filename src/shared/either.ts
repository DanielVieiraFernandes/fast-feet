export class Right<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isRight(): this is Right<L, R> {
    return true;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }
}

export class Left<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }
}

export type Either<L, R> = Right<L, R> | Left<L, R>;

export function right<L, R>(value: R): Either<L, R> {
  return new Right(value);
}

export function left<L, R>(value: L): Either<L, R> {
  return new Left(value);
}
