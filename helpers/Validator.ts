import Formatter from "@/helpers/Formatter";

class Validator {
  static cpf = (v: string): boolean => {
    const digits = Formatter.onlyDigits(v);
    const totalDigits = digits.length;
    const isValid = totalDigits === 10 || totalDigits === 11;
    return isValid;
  };

  static cep = (v: string): boolean => {
    const digits = Formatter.onlyDigits(v);
    const totalDigits = digits.length;
    const isValid = totalDigits === 8;
    return isValid;
  };

  static phone = (v: string): boolean => {
    const digits = Formatter.onlyDigits(v);
    const totalDigits = digits.length;
    const isValid = totalDigits === 10 || totalDigits === 11;
    return isValid;
  };

  static email = (v: string): boolean => {
    const isValid = v.includes("@");
    return isValid;
  };
}

export default Validator;
