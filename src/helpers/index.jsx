const PHONE_REGEX_PATTERN = '\\+(\\d{2}) \\((\\d{2})\\) (\\d{8,9})';
const CNPJ_REGEX_PATTERN = '^(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})$';
const CEP_REGEX_PATTERN = '^(\\d{5})(\\d{3})$';

export function parsePhoneToDTO(phone) {
  const regexp = new RegExp(PHONE_REGEX_PATTERN);
  const match = regexp.exec(phone);
  if (!match) return { ddi: '', ddd: '', phone: '' };
  if (match) {
    return {
      ddi: match[1],
      ddd: match[2],
      phone: match[3],
    };
  }
  return null;
}

export function parsePhoneFromDTO({ ddi, ddd, phone }) {
  return `+${ddi} (${ddd}) ${phone}`;
}

export function removeAllNonDigit(str) {
  return str.replace(/\D+/g, '');
}

export function parseCNPJFromDto(cnpj) {
  const regexp = new RegExp(CNPJ_REGEX_PATTERN);
  const match = regexp.exec(cnpj);
  if (!match) return '';
  return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
}

export function parseCEPFromDto(cep) {
  const regexp = new RegExp(CEP_REGEX_PATTERN);
  const match = regexp.exec(cep);
  if (!match) return '';
  return `${match[1]}-${match[2]}`;
}

export function Accumulator() {
  const self = {};
  self.val = 0;
  self.next = () => {
    self.val += 1;
    return self.val;
  };
  return self;
}

export function getQueryText(query) {
  const keys = Object.keys(query);
  if (keys.length === 0) return '';
  return keys.map((key) => `${key}=${encodeURI(query[key])}`);
}
