import React from 'react';

/**
 * WhatsApp One-Click Chat Button Component
 * Generates an instant WhatsApp chat deep-link with pre-filled product/store message
 */
export function WhatsAppChatButton({ phone, storeName = '', productName = '', customText = '' }) {
    if (!phone) return null;

    // Clean phone number (strip spaces, dashes, + signs)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    let message = customText;
    if (!message) {
        if (productName) {
            message = `Hi! I am interested in inquiring about "${productName}" from ${storeName} on Adilabad App.`;
        } else if (storeName) {
            message = `Hi! I found your store "${storeName}" on Adilabad App and would like to make an inquiry.`;
        } else {
            message = `Hi! I found your listing on Adilabad App and would like to make an inquiry.`;
        }
    }

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(37, 211, 102, 0.3)',
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#20ba5a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Chat on WhatsApp
        </a>
    );
}

/**
 * Google Maps Directions Button Component
 * Opens Google Maps turn-by-turn navigation from customer GPS to store location
 */
export function GoogleMapsDirectionsButton({ address = '', city = 'Adilabad', storeName = '', latitude = null, longitude = null }) {
    if (!address && !storeName && (!latitude || !longitude)) return null;

    let destinationParam = '';
    if (latitude && longitude) {
        destinationParam = `${latitude},${longitude}`;
    } else {
        destinationParam = `${storeName} ${address} ${city}`.trim();
    }

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationParam)}`;

    return (
        <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-directions"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#1A73E8',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(26, 115, 232, 0.3)',
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1557b0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1A73E8'}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Get Directions
        </a>
    );
}
