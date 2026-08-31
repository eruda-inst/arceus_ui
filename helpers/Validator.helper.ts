export default class Validator {
  static email = (v: string): boolean => {
    const isValid = v.includes("@");
    return isValid;
  };
}
