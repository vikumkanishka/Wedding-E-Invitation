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
    const targetDate = new Date("July 31, 2026 18:00:00").getTime();

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

    // Auto Scrolling logic (play/pause toggleable, constant velocity)
    let isAutoScrolling = false;
    const scrollSpeed = 0.7; // Speed in pixels per frame (approx 42px per second)
    let animationFrameId = null;

    function autoScrollStep() {
        if (!isAutoScrolling) return;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll - 2) {
            stopAutoScroll();
            return;
        }

        window.scrollBy(0, scrollSpeed);
        animationFrameId = requestAnimationFrame(autoScrollStep);
    }

    function startAutoScroll() {
        if (isAutoScrolling) return;
        isAutoScrolling = true;
        animationFrameId = requestAnimationFrame(autoScrollStep);
    }

    function stopAutoScroll() {
        if (!isAutoScrolling) return;
        isAutoScrolling = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // Stop on manual wheel scroll or touch swipe
    window.addEventListener("wheel", stopAutoScroll, { passive: true });
    window.addEventListener("touchmove", stopAutoScroll, { passive: true });

    // Click anywhere to toggle (resume or stop) auto-scrolling
    window.addEventListener("click", (e) => {
        // Skip toggle if user clicked on buttons, links, calendar items, or inputs
        if (e.target.closest("a") || e.target.closest("button") || e.target.closest("iframe") || e.target.closest(".countdown-item")) {
            return;
        }
        
        if (isAutoScrolling) {
            stopAutoScroll();
        } else {
            startAutoScroll();
        }
    });

    // Start auto-scrolling 1.5 seconds after page loads
    setTimeout(() => {
        if (window.scrollY < 20) {
            startAutoScroll();
        }
    }, 1500);
});
