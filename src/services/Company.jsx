import axios from 'axios';
import { COMPANIES_PATH, SERVICE_API_URL } from '../constants';
import {
  parsePhoneToDTO, parsePhoneFromDTO, getQueryText,
  parseCNPJFromDto, parseCEPFromDto, removeAllNonDigit,
} from '../helpers';

export function fromDTO(company) {
  const phone = {
    ddi: company.company_ddi,
    ddd: company.company_ddd,
    phone: company.company_phone,
  };
  return {
    id: company.id_Company,
    cnpj: parseCNPJFromDto(company.company_cgc),
    name: company.company_name,
    cep: parseCEPFromDto(company.company_cep),
    uf: company.company_uf,
    city: company.company_city,
    district: company.company_district,
    address: company.company_adress,
    addressComplement: company.company_ad_complemento,
    phone: parsePhoneFromDTO(phone),
    notes: company.company_notes,
  };
}

function toDTO(company) {
  const { ddi, ddd, phone } = parsePhoneToDTO(company.phone);
  return {
    id_Company: company.id,
    company_cgc: removeAllNonDigit(company.cnpj),
    company_name: company.name,
    company_cep: removeAllNonDigit(company.cep),
    company_uf: company.uf,
    company_city: company.city,
    company_district: company.district,
    company_adress: company.address,
    company_ad_complemento: company.addressComplement,
    company_ddi: ddi,
    company_ddd: ddd,
    company_phone: phone,
    company_notes: company.notes,
  };
}

export async function getCompany(id) {
  return axios.get(`${SERVICE_API_URL}/${COMPANIES_PATH}/${id}`).then((res) => {
    let data = null;
    if (res.data) {
      data = fromDTO(res.data);
    }
    return { ...res, data };
  });
}

export async function getCompanyQuery(query) {
  return axios.get(`${SERVICE_API_URL}/${COMPANIES_PATH}?${getQueryText(query)}`).then((res) => {
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
  return axios.post(`${SERVICE_API_URL}/${COMPANIES_PATH}`, toDTO(company));
}

export async function deleteCompany(id) {
  return axios.delete(`${SERVICE_API_URL}/${COMPANIES_PATH}/${id}`);
}

export async function putCompany(id, company) {
  return axios.put(`${SERVICE_API_URL}/${COMPANIES_PATH}/${id}`, toDTO(company));
}
