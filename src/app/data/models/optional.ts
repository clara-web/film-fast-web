export class Optional<T> {
  value: T

  static of<T>(value: T) {
    let optional = new Optional<T>();
    optional.value = value;
    return optional;
  }

  static empty<T>() {
    return new Optional<T>();
  }

  isPresent() {
    return this.value != null;
  }
}
