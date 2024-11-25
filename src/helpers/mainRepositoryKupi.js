import axios from "axios";


export const HeadersroutesPrivate = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const HeadersroutesPublic = () => ({
  'Content-Type': 'application/json',
});

export const AxiosWS = axios.create({});