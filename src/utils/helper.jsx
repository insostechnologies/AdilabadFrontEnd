const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return ''; // Return an empty string for invalid input
    }

    phoneNumber = phoneNumber.trim();

    if (phoneNumber.startsWith('+91')) {
        return phoneNumber;
    }

    if (phoneNumber.startsWith('91')) {
        return `+${phoneNumber}`;
    }

    return `+91${phoneNumber}`;
};


export { formatPhoneNumber };