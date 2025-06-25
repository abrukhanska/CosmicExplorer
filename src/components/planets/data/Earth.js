import earthSvg from "../../../assets/images/planet-earth.svg";
import earthInternal from "../../../assets/images/planet-earth-internal.svg";
import earthGeo from "../../../assets/images/planet-earth-geology.png";

const Earthinfo = {
    name: "Земля",
    color: "#545bfe",
    overview: {
        content: "Земля — третя планета від Сонця й єдина відома, де існує життя. Вона має різноманітний клімат, воду в рідкому стані та багату атмосферу.",
        source: "https://uk.wikipedia.org/wiki/Земля",
        image: earthSvg
    },
    structure: {
        content: "Ядро Землі складається з заліза й нікелю, оточене мантією та корою. Внутрішня структура визначає її геологічну активність.",
        source: "https://uk.wikipedia.org/wiki/Земля#Внутрішня_будова",
        image: earthInternal
    },
    geology: {
        content: "Понад 70% поверхні Землі вкрито водою. Є материки, океани, гори, пустелі, льодовики та різноманітні екосистеми.",
        source: "https://uk.wikipedia.org/wiki/Земля#Поверхня",
        image: earthSvg,
        geo: earthGeo
    },
    rotation: "23,9 год",
    revolution: "365,25 діб",
    radius: "6 371 км",
    temperature: "15°C",
};

export default Earthinfo;