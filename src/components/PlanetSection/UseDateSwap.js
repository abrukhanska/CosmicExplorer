import { useState, useRef } from "react";
const useDataSwap = (data) => {
    // Безпечний дефолт: якщо overview є, інакше перша вкладка з даних
    const defaultTab = data.overview ? "overview" : Object.keys(data)[0];
    const [visibleData, setVisibleData] = useState(data[defaultTab]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedTab, setSelectedTab] = useState(defaultTab);
    const lastTab = useRef(defaultTab);
    const canSwitch = useRef(true);
    const ANIMATION_DURATION = 2000;
    const SWITCH_DELAY = ANIMATION_DURATION / 2;
    const onTabClick = (e) => {
        const nextTab = e.target.dataset.type;
        if (!canSwitch.current || lastTab.current === nextTab) return;
        // Перевіряємо, чи є такі дані!
        if (!data[nextTab]) return;
        triggerSwap(nextTab);
    };
    const triggerSwap = (nextTab) => {
        lastTab.current = nextTab;
        canSwitch.current = false;
        setIsAnimating(true);
        setSelectedTab(nextTab);

        setTimeout(() => {
            setVisibleData(data[nextTab] || {});
        }, SWITCH_DELAY);

        setTimeout(() => {
            setIsAnimating(false);
            canSwitch.current = true;
        }, ANIMATION_DURATION);
    };

    return [onTabClick, visibleData, selectedTab, isAnimating];
};

export default useDataSwap;