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
        // Skip toggle if user clicked on buttons, links, calendar items, music controllers, or inputs
        if (e.target.closest("a") || e.target.closest("button") || e.target.closest("iframe") || e.target.closest(".countdown-item") || e.target.closest(".music-control-container")) {
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

    /* ======================================================
       BACKGROUND MUSIC HANDLER
       ====================================================== */
    const audio = document.getElementById("bg-music");
    const musicBtn = document.getElementById("musicBtn");
    const musicIcon = document.getElementById("musicIcon");

    function playMusic() {
        if (!audio) return;
        audio.play().then(() => {
            if (musicBtn) musicBtn.classList.add("playing");
            if (musicIcon) musicIcon.textContent = "🎵";
        }).catch((error) => {
            console.log("Autoplay blocked by browser. Awaiting user interaction.", error);
        });
    }

    function pauseMusic() {
        if (!audio) return;
        audio.pause();
        if (musicBtn) musicBtn.classList.remove("playing");
        if (musicIcon) musicIcon.textContent = "🔇";
    }

    if (musicBtn && audio) {
        musicBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Avoid triggering scroller play/pause
            if (audio.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });

        // Attempt autoplay on page load
        playMusic();

        // Fallback: Start playing on first interaction if blocked by browser
        const unlockAudio = () => {
            if (audio.paused) {
                playMusic();
            }
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
        };
        document.addEventListener("click", unlockAudio);
        document.addEventListener("touchstart", unlockAudio);
    }

    /* ======================================================
       OUR STORY - 3D COVER FLOW SLIDESHOW
       ====================================================== */
    const storyImages = document.querySelectorAll(".story-image");
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");
    let currentImageIndex = 0;

    function updateCoverflow() {
        if (storyImages.length === 0) return;
        
        storyImages.forEach((img, index) => {
            img.className = "story-image";
            
            if (index === currentImageIndex) {
                img.classList.add("active");
            } else if (index === (currentImageIndex - 1 + storyImages.length) % storyImages.length) {
                img.classList.add("prev-1");
            } else if (index === (currentImageIndex - 2 + storyImages.length) % storyImages.length) {
                img.classList.add("prev-2");
            } else if (index === (currentImageIndex + 1) % storyImages.length) {
                img.classList.add("next-1");
            } else if (index === (currentImageIndex + 2) % storyImages.length) {
                img.classList.add("next-2");
            } else {
                img.classList.add("hidden");
            }
        });
    }

    if (storyImages.length > 0) {
        updateCoverflow();

        let coverflowInterval = setInterval(autoNext, 4000);

        function autoNext() {
            currentImageIndex = (currentImageIndex + 1) % storyImages.length;
            updateCoverflow();
        }

        function resetCoverflowInterval() {
            clearInterval(coverflowInterval);
            coverflowInterval = setInterval(autoNext, 4000);
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex - 1 + storyImages.length) % storyImages.length;
                updateCoverflow();
                resetCoverflowInterval();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex + 1) % storyImages.length;
                updateCoverflow();
                resetCoverflowInterval();
            });
        }
    }
});
