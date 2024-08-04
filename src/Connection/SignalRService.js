// import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// class SignalRService {
//     constructor() {
//         this.connection = new HubConnectionBuilder()
//             .withUrl('http://localhost:5008/chathub')
//             .configureLogging(LogLevel.Information) // Add logging for debugging
//             .build();

//         this.connection.onclose((error) => {
//             console.error('SignalR connection closed:', error);
//         });
//     }

//     async start() {
//         try {
//             await this.connection.start();
//             console.log('SignalR Connected.');
//         } catch (err) {
//             console.error('SignalR connection error:', err);
//         }
//     }

//     async sendMessage(senderId, receiverId, message) {
//         try {
//             await this.connection.invoke('SendMessage', senderId, receiverId, message);
//             console.log('Message sent:', { senderId, receiverId, message });
//         } catch (err) {
//             console.error('Error sending message:', err);
//         }
//     }

//     onReceiveMessage(callback) {
//         this.connection.on('ReceiveMessage', callback);
//     }

//     offReceiveMessage() {
//         this.connection.off('ReceiveMessage');
//     }
// }

// export default new SignalRService();
