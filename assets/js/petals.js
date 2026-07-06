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
    const scrollSpeed = 1.0; // Speed in pixels per frame (approx 72px per second)
    let animationFrameId = null;
    let accumulatedScroll = 0;

    function getScrollContainer() {
        // Find if body or documentElement is the scroll container
        return document.body.scrollHeight > document.documentElement.clientHeight ? document.body : document.documentElement;
    }

    function autoScrollStep() {
        if (!isAutoScrolling) return;

        const container = getScrollContainer();
        const maxScroll = container.scrollHeight - container.clientHeight;
        
        if (container.scrollTop >= maxScroll - 2 && maxScroll > 0) {
            stopAutoScroll();
            return;
        }

        accumulatedScroll += scrollSpeed;
        if (accumulatedScroll >= 1) {
            const scrollAmount = Math.floor(accumulatedScroll);
            container.scrollTop += scrollAmount;
            accumulatedScroll -= scrollAmount;
        }
        
        animationFrameId = requestAnimationFrame(autoScrollStep);
    }

    function startAutoScroll() {
        if (isAutoScrolling) return;
        isAutoScrolling = true;
        accumulatedScroll = 0; // Reset accumulator on start
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
        // Skip toggle if user clicked on buttons, links, calendar items, music controllers, inputs, labels, or the RSVP form container
        if (e.target.closest("a") || e.target.closest("button") || e.target.closest("iframe") || e.target.closest(".countdown-item") || e.target.closest(".music-control-container") || e.target.closest("input") || e.target.closest("label") || e.target.closest(".rsvp-form-container") || e.target.closest(".scroll-arrow")) {
            return;
        }
        
        if (isAutoScrolling) {
            stopAutoScroll();
        } else {
            startAutoScroll();
        }
    });

    // Scroll Arrow Logic
    const scrollArrow = document.querySelector(".scroll-arrow");
    const detailsSection = document.querySelector(".inv-details-section");
    if (scrollArrow && detailsSection) {
        scrollArrow.addEventListener("click", (e) => {
            e.stopPropagation();
            detailsSection.scrollIntoView({ behavior: "smooth" });
            stopAutoScroll();
            // Resume auto-scroll after smooth scrolling finishes
            setTimeout(() => {
                startAutoScroll();
            }, 800);
        });
    }

    // Start auto-scrolling 1.5 seconds after page loads
    setTimeout(() => {
        const container = getScrollContainer();
        if (container.scrollTop < 20) {
            startAutoScroll();
        }
    }, 1500);

    /* ======================================================
       BACKGROUND MUSIC HANDLER
       ====================================================== */
    const audio = document.getElementById("bg-music");
    const musicBtn = document.getElementById("musicBtn");
    const musicIcon = document.getElementById("musicIcon");

    if (audio) {
        audio.muted = false; // Ensure it starts unmuted
    }

    function playMusic() {
        if (!audio) return;
        audio.muted = false;
        audio.play().then(() => {
            if (musicBtn) musicBtn.classList.add("playing");
            if (musicIcon) musicIcon.textContent = "🎵";
        }).catch((error) => {
            console.log("Autoplay blocked by browser. Awaiting user interaction.", error);
            // We intentionally do not show the muted icon here so it always appears unmuted on load
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
            // Remove listeners once unlocked
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
            document.removeEventListener("mousedown", unlockAudio);
            document.removeEventListener("keydown", unlockAudio);
        };
        
        document.addEventListener("click", unlockAudio);
        document.addEventListener("touchstart", unlockAudio);
        document.addEventListener("mousedown", unlockAudio);
        document.addEventListener("keydown", unlockAudio);
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

    /* ======================================================
       INTERACTIVE RSVP FORM HANDLER
       ====================================================== */
    const btnYes = document.getElementById("btn-attend-yes");
    const btnNo = document.getElementById("btn-attend-no");
    const detailsYes = document.getElementById("rsvp-details-yes");
    const detailsNo = document.getElementById("rsvp-details-no");
    const nameYes = document.getElementById("guest-name-yes");
    const nameNo = document.getElementById("guest-name-no");
    const inputAttendance = document.getElementById("input-attendance");
    const inputSide = document.getElementById("input-side");
    const rsvpForm = document.getElementById("google-rsvp-form");
    const successMsg = document.getElementById("rsvp-success");
    const rsvpStep1 = document.getElementById("rsvp-step-1");

    if (btnYes && btnNo) {
        btnYes.addEventListener("click", (e) => {
            e.stopPropagation();
            btnYes.classList.add("selected-yes");
            btnNo.classList.remove("selected-no");
            detailsYes.classList.remove("rsvp-hidden");
            detailsNo.classList.add("rsvp-hidden");
            inputAttendance.value = "Yes, I will attend";
            nameYes.disabled = false;
            nameNo.disabled = true;
            nameYes.focus();
        });

        btnNo.addEventListener("click", (e) => {
            e.stopPropagation();
            btnNo.classList.add("selected-no");
            btnYes.classList.remove("selected-yes");
            detailsNo.classList.remove("rsvp-hidden");
            detailsYes.classList.add("rsvp-hidden");
            inputAttendance.value = "No, I cannot attend";
            inputSide.value = "N/A (Declined)";
            nameNo.disabled = false;
            nameYes.disabled = true;
            nameNo.focus();
        });
    }

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const attendanceVal = inputAttendance.value;
            const nameVal = attendanceVal === "Yes, I will attend" ? nameYes.value : nameNo.value;
            const sideVal = attendanceVal === "Yes, I will attend" ? 
                (document.querySelector('input[name="temp_side"]:checked')?.value || "Groom's Side") : "N/A";

            // Submit using fetch to the Google Apps Script Web App (user replaces this URL)
            const scriptUrl = "https://script.google.com/macros/s/AKfycbxjw40cqKRHfFmP9dnjSLV0S1nswv9NNLQwDnP6ruz91736hCpu71LwmMjCrUllydNO/exec"; 
            
            if (scriptUrl) {
                const formData = new FormData();
                formData.append("name", nameVal);
                formData.append("attendance", attendanceVal);
                formData.append("side", sideVal);

                fetch(scriptUrl, {
                    method: "POST",
                    mode: "no-cors",
                    body: formData
                }).catch(err => console.error("Error submitting to Google Sheet:", err));
            } else {
                console.warn("RSVP Form submitted, but no Google Apps Script URL has been configured yet.");
            }

            // Immediately show the success state for instant UI response
            rsvpStep1.style.display = "none";
            detailsYes.style.display = "none";
            detailsNo.style.display = "none";
            successMsg.classList.remove("rsvp-hidden");
            
            const successText = document.getElementById("success-text");
            if (successText) {
                if (attendanceVal === "Yes, I will attend") {
                    successText.textContent = "We are absolutely thrilled to celebrate this special day with you! See you there! ❤️";
                } else {
                    successText.textContent = "Thank you for letting us know. You will be missed! 🌸";
                }
            }
        });
    }
});
