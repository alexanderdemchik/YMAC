import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import axios from 'axios';
import { OAUTH_TOKEN_URL } from './constants/yandex';

axios.interceptors.request.use(config => {
  let token = localStorage.getItem("token")
  const ignored: (undefined | string)[] = [OAUTH_TOKEN_URL];
  if (!ignored.includes(config.url) && token) {
    config.headers = Object.assign({Authorization: `OAuth ${token}`}, config.headers);
  }

  return config;
});

ReactDOM.render(<App />, document.getElementById('root'));
