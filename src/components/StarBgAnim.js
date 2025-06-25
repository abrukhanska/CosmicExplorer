import React, { useEffect, useRef } from "react";
import styles from "./StarBgAnim.module.css";

export default function StarBgAnim() {
    const canvasRef = useRef();
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let W = window.innerWidth;
        let H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        let stars = [];
        const STAR_COUNT = 120;
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: 0.7 + Math.random() * 1.8,
                vx: 0.025 + Math.random() * 0.09,
                alpha: Math.random() * 0.7 + 0.3,
                glow: Math.floor(Math.random() * 3)
            });
        }
        let running = true;
        function draw() {
            ctx.clearRect(0, 0, W, H);
            for (const s of stars) {
                ctx.save();
                ctx.globalAlpha = s.alpha;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
                ctx.fillStyle = "#fff";
                ctx.shadowColor = s.glow ? "#20e3b2" : "#4ee8ec";
                ctx.shadowBlur = 8 + s.glow * 7;
                ctx.fill();
                ctx.restore();
                s.x += s.vx;
                if (s.x > W) s.x = 0;
            }
            if (running) requestAnimationFrame(draw);
        }
        draw();
        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        }
        window.addEventListener("resize", resize);
        return () => { running = false; window.removeEventListener("resize", resize); };
    }, []);
    return <canvas className={styles.starBgAnim} ref={canvasRef}></canvas>;
}