import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // TODO: 나중에 .env 파일로 관리
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
