import axios from 'axios';
import { user } from '@seniorsistemas/senior-platform-data';

const tokenPromise = user.getToken();

axios.interceptors.request.use(async (requestConfig) => {
  try {
    const { access_token: accessToken, token_type: tokenType } = await tokenPromise;
    return {
      ...requestConfig,
      headers: {
        ...requestConfig.headers,
        common: {
          ...requestConfig.headers.common,
          Authorization: `${tokenType} ${accessToken}`,
        },
      },
    };
  } catch (error) {
    console.error('Não foi possível coletar o token da plataforma', error);
    return requestConfig;
  }
});
