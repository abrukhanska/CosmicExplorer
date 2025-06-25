import uranusSvg from "../../../assets/images/planet-uranus.svg";
import uranusInternal from "../../../assets/images/planet-uranus-internal.svg";
import uranusGeo from "../../../assets/images/planet-uranus-geology.png";

const uranusInfo = {
    name: "Уран",
    color: "#40d9ce",
    overview: {
        content: "Уран — сьома від Сонця планета, що відзначається блакитно-зеленим кольором завдяки метану в атмосфері. Особливістю є те, що вісь обертання Урана розташована майже у площині його орбіти.",
        source: "https://uk.wikipedia.org/wiki/Уран_(планета)",
        image: uranusSvg
    },
    structure: {
        content: "У центрі Урана міститься невелике кам'яне ядро, яке оточене товстою мантією з льоду. Зовнішня оболонка складається з водню та гелію, а ядро значно менше за мантію.",
        source: "https://uk.wikipedia.org/wiki/Уран_(планета)#Внутрішня_будова",
        image: uranusInternal
    },
    geology: {
        content: "Атмосфера Урана включає водень, гелій і метан. Твердої поверхні немає — це планета з газовою оболонкою, сильними вітрами та малопомітними кільцями.",
        source: "https://uk.wikipedia.org/wiki/Уран_(планета)#Атмосфера",
        image: uranusSvg,
        geo: uranusGeo
    },
    rotation: "17,2 год",
    revolution: "84 роки",
    radius: "25 362 км",
    temperature: "-195°C",
};

export default uranusInfo;