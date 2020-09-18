import axios from 'axios';
import { getQueryText } from '../helpers';

const { API_URL } = { API_URL: 'https://704be563-6fd5-42b8-b183-e74d58510105.mock.pstmn.io' };
const path = 'document-types';

function fromDTO(documentType) {
  return {
    id: documentType.ID_TypeDocument,
    description: documentType.TypeDocument_Description,
  };
}

function toDTO(documentType) {
  return {
    ID_TypeDocument: documentType.id,
    TypeDocument_Description: documentType.description,
  };
}

export async function getDocumentType(id) {
  return axios.get(`${API_URL}/${path}/${id}`).then((res) => {
    let data = null;
    if (res.data) {
      data = fromDTO(res.data);
    }
    return { ...res, data };
  });
}

export async function getDocumentTypeQuery(query) {
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

export async function postDocumentType(documentType) {
  return axios.post(`${API_URL}/${path}`, toDTO(documentType));
}

export async function deleteDocumentType(id) {
  return axios.delete(`${API_URL}/${path}/${id}`);
}

export async function putDocumentType(id, documentType) {
  return axios.put(`${API_URL}/${path}/${id}`, toDTO(documentType));
}
