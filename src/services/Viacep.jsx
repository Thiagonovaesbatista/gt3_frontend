import axios from 'axios';

const { API_URL } = { API_URL: 'https://viacep.com.br/ws' };

export default function getByCEP(cep) {
  return axios.get(`${API_URL}/${cep}/json`);
}
