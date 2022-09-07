import { IAccessToken } from 'react-app-env';

export default () => {
  const parameter = {
    grant_type: 'client_credentials',
    client_id: process.env.REACT_APP_TDX_ID as string,
    client_secret: process.env.REACT_APP_TDX_SECRET as string,
  };

  return fetch(process.env.REACT_APP_TDX_AUTH_URL as string, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(parameter),
  }).then((res) => res.json()) as Promise<IAccessToken>;
};
