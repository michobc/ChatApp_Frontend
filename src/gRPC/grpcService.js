import { ChatServiceClient } from '../Proto/Chat_grpc_web_pb';
import { ChatHistoryRequest } from '../Proto/Chat_pb';

const client = new ChatServiceClient('http://localhost:5008');

const getChatHistory = async (senderId, receiverId) => {
    const request = new ChatHistoryRequest();
    request.setSenderid(senderId);
    request.setReceiverid(receiverId);

    return new Promise((resolve, reject) => {
        client.getMessages(request, {}, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response.getMessagesList());
            }
        });
    });
};

export default {
    getChatHistory
};