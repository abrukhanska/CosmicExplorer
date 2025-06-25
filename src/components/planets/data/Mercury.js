import mercurySvg from "../../../assets/images/planet-mercury.svg";
import mercuryInternal from "../../../assets/images/planet-mercury-internal.svg";
import mercuryGeo from "../../../assets/images/planet-mercury-geology.png";

const mercuryInfo = {
    name: "Меркурій",
    color: "#def4fc",
    overview: {
        content: "Меркурій — найближча до Сонця та найменша планета Сонячної системи. Його поверхня вкрита кратерами, а атмосфера практично відсутня.",
        source: "https://uk.wikipedia.org/wiki/Меркурій_(планета)",
        image: mercurySvg
    },
    structure: {
        content: "Велике залізне ядро Меркурія займає більшу частину його об’єму, а зовнішні шари представлені тонкою мантією і корою із силікатів.",
        source: "https://uk.wikipedia.org/wiki/Меркурій_(планета)#Внутрішня_будова",
        image: mercuryInternal
    },
    geology: {
        content: "Поверхня планети всіяна кратерами, уступами й рівнинами, що надає їй схожості з Місяцем.",
        source: "https://uk.wikipedia.org/wiki/Меркурій_(планета)#Геологія",
        image: mercurySvg,
        geo: mercuryGeo
    },
    rotation: "58,6 діб",
    revolution: "88 діб",
    radius: "2 439,7 км",
    temperature: "167°C"
};

export default mercuryInfo;