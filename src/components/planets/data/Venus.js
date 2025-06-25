import venusSvg from "../../../assets/images/planet-venus.svg";
import venusInternal from "../../../assets/images/planet-venus-internal.svg";
import venusGeo from "../../../assets/images/planet-venus-geology.png";

const venusInfo = {
    name: "Венера",
    color: "#f7cc8f",
    overview: {
        content: "Венера — друга планета від Сонця, близька за розмірами до Землі. Вона має щільну атмосферу, яка створює потужний парниковий ефект і робить поверхню планети надзвичайно гарячою.",
        source: "https://uk.wikipedia.org/wiki/Венера_(планета)",
        image: venusSvg
    },
    structure: {
        content: "У Венери є залізне ядро, оточене силікатною мантією та корою, що схоже на внутрішню будову Землі.",
        source: "https://uk.wikipedia.org/wiki/Венера_(планета)#Внутрішня_будова",
        image: venusInternal
    },
    geology: {
        content: "Поверхню Венери вкривають численні вулкани, лавові рівнини та густі хмари, які утримують тепло.",
        source: "https://uk.wikipedia.org/wiki/Венера_(планета)#Поверхня_та_геологія",
        image: venusSvg,
        geo: venusGeo
    },
    rotation: "243 доби",
    revolution: "224,7 доби",
    radius: "6 051,8 км",
    temperature: "464°C",
};

export default venusInfo;