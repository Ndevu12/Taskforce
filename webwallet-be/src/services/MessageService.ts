
import Message from '../models/Message';
import { IMessage } from '../types/interfaces/Message';

export const createMessage = async (messageData: IMessage) => {
    const message = new Message(messageData);
    return await message.save();
};