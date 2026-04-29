class Formatter {
  static onlyDigits = (str: string): string => {
    return str.replace(/[^a-zA-Z0-9]/g, "");
  };

  static isoDate = (isoDate: string): string => {
    const year: number = Number(isoDate.substring(0, 4));
    const month: number = Number(isoDate.substring(5, 7)) - 1;
    const day: number = Number(isoDate.substring(8, 10));
    const formattedDate = new Date(year, month, day).toLocaleDateString(
      "pt-BR",
    );
    return formattedDate;
  };

  static isoHour = (isoHour: string): string => {
    if (isoHour.length === 5) {
      return isoHour;
    }
    return isoHour.substring(0, 5);
  };

  static bool = (value: boolean): string => {
    return value ? "Sim" : "Não";
  };

  static cep = (cep: string): string => {
    const digits = this.onlyDigits(cep);
    if (digits.length === 8) {
      return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    return cep;
  };

  static cpf = (cpf: string): string => {
    const digits = this.onlyDigits(cpf);
    const totalDigits = digits.length;
    if (totalDigits === 10) {
      const normalizedCpf = "0" + digits;
      return normalizedCpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4",
      );
    }
    if (totalDigits === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpf;
  };

  static phone = (phone: string): string => {
    const digits = this.onlyDigits(phone);
    if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, "+55 ($1) $2-$3");
    }
    if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, "+55 ($1) $2-$3");
    }
    return phone;
  };

  static currency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
}

export default Formatter;
