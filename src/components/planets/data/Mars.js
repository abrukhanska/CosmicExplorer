import marsSvg from "../../../assets/images/planet-mars.svg";
import marsInternal from "../../../assets/images/planet-mars-internal.svg";
import marsGeo from "../../../assets/images/planet-mars-geology.png";

const marsInfo = {
    name: "Марс",
    color: "#f45d36",
    overview: {
        content: "Марс — четверта від Сонця планета, яку часто називають «червоною» через колір поверхні. Вона менша за Землю, має тонку атмосферу і є популярною метою для дослідження життя за межами нашої планети.",
        source: "https://uk.wikipedia.org/wiki/Марс_(планета)",
        image: marsSvg
    },
    structure: {
        content: "У центрі Марса розташоване щільне ядро, оточене мантією із силікатів та тонкою корою. Ядро складається переважно з заліза, нікелю та сірки і, ймовірно, частково рідке.",
        source: "https://uk.wikipedia.org/wiki/Марс_(планета)#Внутрішня_будова",
        image: marsInternal
    },
    geology: {
        content: "Марс має численні вулкани, каньйони, пустелі та полярні шапки. Його поверхня складається в основному з базальту, на ній помітні унікальні ландшафти та геологічні структури.",
        source: "https://uk.wikipedia.org/wiki/Марс_(планета)#Геологія_й_поверхня",
        image: marsSvg,
        geo: marsGeo
    },
    rotation: "1,03 доби",
    revolution: "1,88 року",
    radius: "3 389,5 км",
    temperature: "-28°C",
};

export default marsInfo;