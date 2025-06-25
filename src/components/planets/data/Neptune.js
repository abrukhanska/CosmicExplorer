import neptuneSvg from "../../../assets/images/planet-neptune.svg";
import neptuneInternal from "../../../assets/images/planet-neptune-internal.svg";
import neptuneGeo from "../../../assets/images/planet-neptune-geology.png";

const neptuneInfo = {
    name: "Нептун",
    color: "#2d68f0",
    overview: {
        content: "Нептун — восьма планета від Сонця й найдальша у Сонячній системі. Відомий своїм насиченим синім кольором, цей крижаний гігант має найсильніші вітри серед усіх планет.",
        source: "https://uk.wikipedia.org/wiki/Нептун_(планета)",
        image: neptuneSvg
    },
    structure: {
        content: "У центрі Нептуна міститься невелике кам'яне ядро, яке оточує товста мантія з льоду, а зовні — масивна атмосфера з водню, гелію й метану.",
        source: "https://uk.wikipedia.org/wiki/Нептун_(планета)#Внутрішня_будова",
        image: neptuneInternal
    },
    geology: {
        content: "Атмосфера Нептуна містить метан, що зумовлює його блакитне забарвлення. Тут спостерігаються найпотужніші вітри в Сонячній системі.",
        source: "https://uk.wikipedia.org/wiki/Нептун_(планета)#Атмосфера",
        image: neptuneSvg,
        geo: neptuneGeo
    },
    rotation: "16,1 год",
    revolution: "164,8 року",
    radius: "24 622 км",
    temperature: "-201°C",
};

export default neptuneInfo;