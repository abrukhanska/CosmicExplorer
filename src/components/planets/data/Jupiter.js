import jupiterSvg from "../../../assets/images/planet-jupiter.svg";
import jupiterInternal from "../../../assets/images/planet-jupiter-internal.svg";
import jupiterGeo from "../../../assets/images/planet-jupiter-geology.png";

const jupiterInfo = {
    name: "Юпітер",
    color: "#f16c51",
    overview: {
        content: "Юпітер — п’ята планета від Сонця та найбільша в нашій системі. Це газовий гігант із переважно воднево-гелієвою атмосферою.",
        source: "https://uk.wikipedia.org/wiki/Юпітер_(планета)",
        image: jupiterSvg
    },
    structure: {
        content: "Ядро Юпітера має невизначені обриси, ймовірно складається з важких елементів, оточене металевим воднем і густими шарами газів.",
        source: "https://uk.wikipedia.org/wiki/Юпітер_(планета)#Внутрішня_будова",
        image: jupiterInternal
    },
    geology: {
        content: "Відомий своєю Великою Червоною Плямою — гігантським штормом, Юпітер має численні хмарні смуги, сильні вітри та не має твердої поверхні.",
        source: "https://uk.wikipedia.org/wiki/Юпітер_(планета)#Атмосфера",
        image: jupiterSvg,
        geo: jupiterGeo
    },
    rotation: "9,93 год",
    revolution: "11,86 року",
    radius: "69 911 км",
    temperature: "-108°C",
};

export default jupiterInfo;