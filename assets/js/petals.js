// Petal rain and wedding countdown logic — shared by invitation.html
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

    // Countdown Timer logic
    const targetDate = new Date("July 31, 2026 17:00:00").getTime();

    const dSpan = document.getElementById("days");
    const hSpan = document.getElementById("hours");
    const mSpan = document.getElementById("minutes");
    const sSpan = document.getElementById("seconds");

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            if (dSpan) dSpan.textContent = "00";
            if (hSpan) hSpan.textContent = "00";
            if (mSpan) mSpan.textContent = "00";
            if (sSpan) sSpan.textContent = "00";
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (dSpan) dSpan.textContent = String(days).padStart(2, "0");
        if (hSpan) hSpan.textContent = String(hours).padStart(2, "0");
        if (mSpan) mSpan.textContent = String(minutes).padStart(2, "0");
        if (sSpan) sSpan.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
});
