export const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const differenceInSeconds = Math.floor((now - messageDate) / 1000);
    
    if (differenceInSeconds < 60) {
        return 'Just now';
    } else if (differenceInSeconds < 3600) {
        return `${Math.floor(differenceInSeconds / 60)} minutes ago`;
    } else if (differenceInSeconds < 86400) {
        return `${Math.floor(differenceInSeconds / 3600)} hours ago`;
    } else if (differenceInSeconds < 172800) {
        return 'Yesterday';
    } else {
        return messageDate.toLocaleDateString();
    }
};