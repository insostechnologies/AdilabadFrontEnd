import React, { useState } from 'react';
import Select from 'react-select';
// Custom styles for the Select component
const customStyles = {
    control: (provided) => ({
        ...provided,
        fontSize: '16px',
        width: '150px',
        height: '44px',
    }),
    option: (provided) => ({
        ...provided,
        fontSize: '16px',
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
    }),
    menuPortal: (provided) => ({
        ...provided,
        zIndex: 9999,
    }),
};
// Reusable Select component
const CustomSelect = ({ options, onChange, value }) => {
    return (
        <>
            <Select
                options={options}
                styles={customStyles}
                menuPortalTarget={document.body}
                onChange={onChange}
                value={value}
            />
        </>
    );
};
export default CustomSelect;