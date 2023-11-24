export const cpfMask = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const noSpecialCharactersMask = (value: string): string => {
  return value.replace(/[^\w\s]/gi, "");
};

export const numbersOnlyMask = (value: string): string => {
  return value.replace(/\D/g, "");
};

export const moneyMask = (value: string): string => {
  let v = value.replace(/\D/g, "");
  v = (parseInt(v) / 100).toFixed(2) + "";
  v = v.replace(".", ",");
  v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
  v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
  value = v;
  return value;
};

export const cnpjMask = (value: string): string => {
  return value
    .replace(/\D+/g, "") // não deixa ser digitado nenhuma letra
    .replace(/(\d{2})(\d)/, "$1.$2") // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2") // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1"); // captura os dois últimos 2 números, com um - antes dos dois números
};

export const phoneMask = (v: string) => {
  v = v.replace(/\D/g, ""); // Remove tudo o que não é dígito
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca parênteses em volta dos dois primeiros dígitos
  v = v.replace(/(\d)(\d{4})$/, "$1-$2"); // Coloca hífen entre o quarto e o quinto dígitos
  return v;
};

export const cepMask = (value: string) => {
  const cep = value.replace(/\D/g, "").replace(/^(\d{5})(\d{3})+?$/, "$1-$2");
  return cep;
};

export const measureMask = (value: string) => {
  return value.replace(/[^0-9,]/g, "").replace(/(,.*?),(.*,)?/, "$1");
};
