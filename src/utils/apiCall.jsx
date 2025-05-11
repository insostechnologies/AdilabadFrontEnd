import { config } from "../config";
const leadsAdd = async (user_id, item_id, type) => {
    try {
        const response = await fetch(`${config.backEndBaseUrl}api/user/leads/add`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ user_id, item_id, type }) // Corrected key from data to body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Fetching leads failed', error);
        throw error; // Re-throw the error for further handling if needed
    }
};

export { leadsAdd }; // Use named export for better practice