import axiosClient from './axiosServer';
import axios from 'axios';

interface EmailData {
    to: string;
    subject: string;
    text: string;
    html: string;
}

const emailService = {
    sendContactEmail: async (emailData: EmailData): Promise<{ success: boolean; messageId?: string }> => {
        try {
            const response = await axiosClient.post('/email/contact', emailData);
            return {
                success: true,
                messageId: response.data.messageId
            };
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error;
                throw axiosError.response?.data;
            }
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
};

export default emailService;
