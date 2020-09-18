import { useReducer, useState, useEffect } from 'react';
import getByCEP from '../services/Viacep';

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
        isSuccess: false,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        isSuccess: true,
        data: action.payload,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
        isSuccess: false,
        error: action.error,
      };
    default:
      throw new Error();
  }
};

export function useDataApi(initialInput, initialData, initialService) {
  const [dataApi, setDataApi] = useState(
    { service: initialService, input: initialInput, reloads: 0 },
  );
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: initialData,
    error: null,
  });

  useEffect(() => {
    let didCancel = false;

    const callDataApi = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        let result;
        if (Array.isArray(dataApi.input)) {
          result = await dataApi.service(...dataApi.input);
        } else {
          result = await dataApi.service(dataApi.input);
        }

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE', error });
        }
      }
    };

    if (dataApi.service) {
      callDataApi();
    }

    return () => {
      didCancel = true;
    };
  }, [dataApi]);

  return [state, setDataApi, dataApi];
}

export function useCEPApi(initialCEP) {
  const [cep, setCep] = useState(initialCEP);
  const [state, setDataApi] = useDataApi(initialCEP, {
    uf: '',
    localidade: '',
    bairro: '',
    logradouro: '',
    complemento: '',
  }, null);
  const service = getByCEP;
  useEffect(() => {
    if (cep && cep !== '') {
      setDataApi({ service, input: cep });
    }
  }, [cep, service, setDataApi]);
  return [state, setCep];
}
