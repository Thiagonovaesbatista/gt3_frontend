import axios from 'axios';
import { getQueryText } from '../helpers';
import { fromDTO as companyFromDTO } from './Company';

const { API_URL } = { API_URL: 'https://704be563-6fd5-42b8-b183-e74d58510105.mock.pstmn.io' };
const path = 'contracts';

export function fromDTO(contract) {
  return {
    id: contract.ID_Contract,
    companyId: contract.ID_Company,
    number: contract.Contract_Number,
    email: contract.Contract_Email,
    user: contract.Contract_User,
    start: Date.parse(contract.Contract_Start),
    end: Date.parse(contract.Contract_End),
    documentTypes: contract.Document_Types.map((dt) => ({
      contractId: dt.ID_Contract,
      documentTypeId: dt.ID_TypeDocument,
      requiredAttachment: dt.Attachment_Mandatory,
      description: dt.TypeDocument_Description,
    })),
    company: companyFromDTO(contract.Company),
  };
}

function toDTO(contract) {
  return {
    ID_Contract: contract.id,
    ID_Company: contract.companyId,
    Contract_Number: contract.number,
    Contract_Email: contract.email,
    Contract_User: contract.user,
    Contract_Start: contract.start.toISOString(),
    Contract_End: contract.end.toISOString(),
    Document_Types: contract.documentTypes.map((dt) => ({
      ID_Contract: dt.contractId,
      ID_TypeDocument: dt.documentTypeId,
      Attachment_Mandatory: dt.requiredAttachment,
    })),
  };
}

export async function getContract(id) {
  return axios.get(`${API_URL}/${path}/${id}`).then((res) => {
    let data = null;
    if (res.data) {
      data = fromDTO(res.data);
    }
    return { ...res, data };
  });
}

export async function getContractQuery(query) {
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

export async function postContract(contract) {
  return axios.post(`${API_URL}/${path}`, { ...toDTO(contract) });
}

export async function deleteContract(id) {
  return axios.delete(`${API_URL}/${path}/${id}`);
}

export async function putContract(id, contract) {
  return axios.put(`${API_URL}/${path}/${id}`, { ...toDTO(contract) });
}
