import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Buffer } from 'buffer';

@ValidatorConstraint({ async: false })
class IsBufferConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    return Buffer.isBuffer(value);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'O valor precisa ser um Buffer válido.';
  }
}

export function IsBuffer(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBufferConstraint,
    });
  };
}
