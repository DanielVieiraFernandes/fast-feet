export abstract class Hash {
  abstract hash(plain: string): Promise<string>;
  abstract compare(plain: string, password: string): Promise<boolean>;
}
