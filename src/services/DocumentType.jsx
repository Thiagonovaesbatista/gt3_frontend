import axios from 'axios';
import { DOCUMENT_TYPES_PATH, SERVICE_API_URL } from '../constants';
import { getQueryText } from '../helpers';

export function fromDTO(documentType) {
  return {
    id: documentType.id_typedocument,
    description: documentType.TypeDocument_Descriptyon,
  };
}

function toDTO(documentType) {
  return {
    id_typedocument: documentType.id,
    TypeDocument_Descriptyon: documentType.description,
  };
}

export async function getDocumentType(id) {
  return axios.get(`${SERVICE_API_URL}/${DOCUMENT_TYPES_PATH}/${id}`).then((res) => {
    let data = null;
    if (res.data) {
      data = fromDTO(res.data);
    }
    return { ...res, data };
  });
}

export async function getDocumentTypeQuery(query) {
  return axios.get(`${SERVICE_API_URL}/${DOCUMENT_TYPES_PATH}?${getQueryText(query)}`).then((res) => {
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
  return axios.post(`${SERVICE_API_URL}/${DOCUMENT_TYPES_PATH}`, toDTO(documentType));
}

export async function deleteDocumentType(id) {
  return axios.delete(`${SERVICE_API_URL}/${DOCUMENT_TYPES_PATH}/${id}`);
}

export async function putDocumentType(id, documentType) {
  return axios.put(`${SERVICE_API_URL}/${DOCUMENT_TYPES_PATH}/${id}`, toDTO(documentType));
}
