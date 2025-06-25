import saturnSvg from "../../../assets/images/planet-saturn.svg";
import saturnInternal from "../../../assets/images/planet-saturn-internal.svg";
import saturnGeo from "../../../assets/images/planet-saturn-geology.png";

const saturnInfo = {
    name: "Сатурн",
    color: "#fccb6b",
    overview: {
        content: "Сатурн — шоста планета Сонячної системи, яка славиться своєю системою яскравих кілець. Це газовий гігант з атмосферою, що складається переважно з водню та гелію.",
        source: "https://uk.wikipedia.org/wiki/Сатурн_(планета)",
        image: saturnSvg
    },
    structure: {
        content: "У центрі Сатурна міститься невелике ядро з важких елементів, оточене шарами металевого, рідкого і газоподібного водню.",
        source: "https://uk.wikipedia.org/wiki/Сатурн_(планета)#Внутрішня_будова",
        image: saturnInternal
    },
    geology: {
        content: "Навколо Сатурна розташована система великих і яскравих кілець. Атмосфера складається в основному з водню та гелію, тут часто спостерігаються потужні вітри й шторми.",
        source: "https://uk.wikipedia.org/wiki/Сатурн_(планета)#Атмосфера_та_кільця",
        image: saturnSvg,
        geo: saturnGeo
    },
    rotation: "10,7 год",
    revolution: "29,46 року",
    radius: "58 232 км",
    temperature: "-139°C",
};

export default saturnInfo;