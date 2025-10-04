import axios from 'axios';
import { IMessage } from '../types/interfaces/Message';
import { getAPIUrl } from '../utils/apiConfig';

export const createMessage = async (message: IMessage): Promise<IMessage> => {
    const API_URL = getAPIUrl();
    const response = await axios.post(`${API_URL}/messages`, message);
    return response.data;
};
