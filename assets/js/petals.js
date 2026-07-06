// Petal rain only — shared by invitation.html
document.addEventListener("DOMContentLoaded", () => {
    const TOTAL_PETALS = 45;
    const PETAL_CHAR   = "✿";
    const rainContainer = document.getElementById("petal-rain");

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createPetal() {
        const el = document.createElement("span");
        el.classList.add("petal");
        el.textContent = PETAL_CHAR;

        const startX   = rand(0, 100);
        const size     = rand(10, 20);
        const opacity  = rand(0.10, 0.30);
        const duration = rand(6, 14);
        const delay    = rand(0, 14);
        const drift    = rand(-60, 60);

        el.style.cssText = `
            left: ${startX}vw;
            font-size: ${size}px;
            opacity: ${opacity};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --drift: ${drift}px;
        `;

        if (rainContainer) rainContainer.appendChild(el);

        el.addEventListener("animationend", () => {
            el.style.animationDelay    = "0s";
            el.style.left              = rand(0, 100) + "vw";
            el.style.opacity           = rand(0.10, 0.30);
            el.style.animationDuration = rand(6, 14) + "s";
            el.style.setProperty("--drift", rand(-60, 60) + "px");
            el.classList.remove("petal");
            void el.offsetWidth;
            el.classList.add("petal");
        });
    }

    if (rainContainer) {
        for (let i = 0; i < TOTAL_PETALS; i++) createPetal();
    }
});
