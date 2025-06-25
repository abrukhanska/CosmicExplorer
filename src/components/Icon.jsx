import React from "react";
import IcoMoon from "react-icomoon";
import iconSet from "../selection.json";
const Icon = ({ name, size = 24, color = "currentColor", style = {} }) => (
    <IcoMoon
        iconSet={iconSet}
        icon={name}
        size={size}
        color={color}
        style={style}
        disableFill={true}
    />
);

export default Icon;