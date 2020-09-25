import axios from 'axios';
import { user } from '@seniorsistemas/senior-platform-data';

const tokenPromise = user.getToken();

axios.interceptors.request.use(async (requestConfig) => {
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
});
