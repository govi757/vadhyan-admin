import axios, { AxiosResponse } from 'axios';
import { AdminData } from '../data';

const instance = axios.create({
	baseURL: 'http://localhost:3000/',
	timeout: 15000,
});


const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	get: (url: string) => instance.get(url).then(responseBody),
	post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
	put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
	delete: (url: string) => instance.delete(url).then(responseBody),
};

export namespace Auth {
    export const login:(loginBody: AdminData.LoginData) => Promise<any> = (loginBody: AdminData.LoginData) => {
        return requests.post('login',loginBody)
    }
}
