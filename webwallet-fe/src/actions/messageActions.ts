import axios from 'axios';
import { IMessage } from '../interfaces/Message';

const API_URL = import.meta.env.VITE_BASE_URL;
if (!API_URL) throw new Error('VITE_BASE_URL is not defined');

export const createMessage = async (message: IMessage): Promise<IMessage> => {
    const response = await axios.post(`${API_URL}/messages`, message);
    return response.data;
};
