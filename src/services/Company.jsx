import axios from 'axios';
import {
  parsePhoneToDTO, parsePhoneFromDTO, getQueryText,
  parseCNPJFromDto, parseCEPFromDto, removeAllNonDigit,
} from '../helpers';

const { API_URL } = { API_URL: 'https://704be563-6fd5-42b8-b183-e74d58510105.mock.pstmn.io' };
const path = 'companies';

function fromDTO(company) {
  const phone = {
    ddi: company.Company_DDI,
    ddd: company.Company_DDD,
    phone: company.Company_Phone,
  };
  return {
    id: company.ID_Company,
    cnpj: parseCNPJFromDto(company.Company_CGC),
    name: company.Company_Name,
    cep: parseCEPFromDto(company.Company_CEP),
    uf: company.Company_UF,
    city: company.Company_City,
    district: company.Company_District,
    address: company.Company_Address,
    addressComplement: company.Company_Ad_Complemento,
    phone: parsePhoneFromDTO(phone),
    notes: company.Company_Notes,
  };
}

function toDTO(company) {
  const { ddi, ddd, phone } = parsePhoneToDTO(company.phone);
  return {
    ID_Company: company.id,
    Company_CGC: removeAllNonDigit(company.cnpj),
    Company_Name: company.name,
    Company_CEP: removeAllNonDigit(company.cep),
    Company_UF: company.uf,
    Company_City: company.city,
    Company_District: company.district,
    Company_Address: company.address,
    Company_Ad_Complemento: company.addressComplement,
    Company_DDI: ddi,
    Company_DDD: ddd,
    Company_Phone: phone,
    Company_Notes: company.Company_Notes,
  };
}

export async function getCompany(id) {
  return axios.get(`${API_URL}/${path}/${id}`).then((res) => {
    let data = null;
    if (res.data) {
      data = fromDTO(res.data);
    }
    return { ...res, data };
  });
}

export async function getCompanyQuery(query) {
  return axios.get(`${API_URL}/${path}?${getQueryText(query)}`).then((res) => {
    let data = null;
    if (res.data) {
      if (res.data.length > 0) {
        data = res.data.map(fromDTO);
      } else {
        data = [];
      }
    }
    return { ...res, data };
  });
}

export async function postCompany(company) {
  return axios.post(`${API_URL}/${path}`, toDTO(company));
}

export async function deleteCompany(id) {
  return axios.delete(`${API_URL}/${path}/${id}`);
}

export async function putCompany(id, company) {
  return axios.put(`${API_URL}/${path}/${id}`, toDTO(company));
}
