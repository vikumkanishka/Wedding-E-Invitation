document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       OPEN INVITATION BUTTON
       ============================== */
    const openBtn = document.getElementById("openInvitationBtn");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            console.log("Opening invitation...");
            alert("This will navigate to the full invitation details!");
        });
    }

    /* ==============================
       RAINING FLOWER PETALS
       ============================== */
    const TOTAL_PETALS   = 55;     // number of petals on screen at once
    const PETAL_CHAR     = "✿";   // single flower character (all same)
    const container      = document.getElementById("petal-rain");

    /**
     * Returns a random float between min and max
     */
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Creates one petal element and appends it to the rain container.
     * Each petal gets randomised: horizontal position, size, opacity,
     * duration, delay, and a subtle horizontal drift.
     */
    function createPetal() {
        const el = document.createElement("span");
        el.classList.add("petal");
        el.textContent = PETAL_CHAR;

        const startX   = rand(0, 100);          // % across viewport
        const size     = rand(10, 22);           // px font size
        const opacity  = rand(0.12, 0.35);       // low — feels like snow
        const duration = rand(6, 14);            // seconds to fall
        const delay    = rand(0, 14);            // stagger start
        const drift    = rand(-60, 60);          // horizontal drift px

        el.style.cssText = `
            left: ${startX}vw;
            font-size: ${size}px;
            opacity: ${opacity};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --drift: ${drift}px;
        `;

        container.appendChild(el);

        // When the animation ends, reset the petal to loop indefinitely
        el.addEventListener("animationend", () => {
            el.style.animationDelay = "0s";
            el.style.left           = rand(0, 100) + "vw";
            el.style.opacity        = rand(0.12, 0.35);
            el.style.animationDuration = rand(6, 14) + "s";
            el.style["--drift"]     = rand(-60, 60) + "px";

            // Restart animation by removing and adding the class
            el.classList.remove("petal");
            void el.offsetWidth; // force reflow
            el.classList.add("petal");
        });
    }

    // Spawn all petals
    for (let i = 0; i < TOTAL_PETALS; i++) {
        createPetal();
    }
});
