const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            // Convert file to base64 string
            const base64String = reader.result.split(',')[1]; // Extract base64 string
            resolve(base64String);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        // Read file as Data URL (base64 encoded)
        reader.readAsDataURL(file);
    });
};

module.exports = {
    readFileAsBase64
};