import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import issSvg from "./iss.svg";
const issIcon = new L.DivIcon({
    className: "iss-marker",
    html: `<img src="${issSvg}" alt="ISS" style="width:40px; height:40px; filter: drop-shadow(0 0 8px #00eaff);" />`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});
const ISSMarker = ({ position }) => <Marker position={position} icon={issIcon} />;
export default ISSMarker;