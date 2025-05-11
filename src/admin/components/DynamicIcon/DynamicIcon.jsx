import React from 'react';
import * as Icons from 'react-icons/fa';


export const DynamicIcon = ({ name }) => {
    const IconComponent = Icons[name];
    if (!IconComponent) {
        return <Icons.FaBeer />;
    }
    return <IconComponent />;
};