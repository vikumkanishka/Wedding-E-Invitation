document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       RAINING FLOWER PETALS
    ====================================================== */
    const TOTAL_PETALS  = 55;
    const PETAL_CHAR    = "✿";
    const rainContainer = document.getElementById("petal-rain");

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createPetal() {
        const el = document.createElement("span");
        el.classList.add("petal");
        el.textContent = PETAL_CHAR;

        el.style.cssText = `
            left: ${rand(0, 100)}vw;
            font-size: ${rand(10, 22)}px;
            opacity: ${rand(0.12, 0.35)};
            animation-duration: ${rand(6, 14)}s;
            animation-delay: ${rand(0, 14)}s;
            --drift: ${rand(-60, 60)}px;
        `;

        if (rainContainer) rainContainer.appendChild(el);

        el.addEventListener("animationend", () => {
            el.style.animationDelay    = "0s";
            el.style.left              = rand(0, 100) + "vw";
            el.style.opacity           = rand(0.12, 0.35);
            el.style.animationDuration = rand(6, 14) + "s";
            el.style.setProperty("--drift", rand(-60, 60) + "px");
            el.classList.remove("petal");
            void el.offsetWidth; // force reflow to restart animation
            el.classList.add("petal");
        });
    }

    if (rainContainer) {
        for (let i = 0; i < TOTAL_PETALS; i++) createPetal();
    }

    /* ======================================================
       OPEN INVITATION — MAGICAL EXIT
    ====================================================== */
    const openBtn = document.getElementById("openInvitationBtn");
    const card    = document.querySelector(".card");

    function addFlashOverlay() {
        const flash = document.createElement("div");
        flash.classList.add("magic-flash");
        document.body.appendChild(flash);
        flash.addEventListener("animationend", () => flash.remove());
    }

    function playFairySound() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        // Magical ascending pentatonic scale
        const frequencies = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00, 2349.32, 2637.02, 3135.96, 3520.00, 4186.01];
        
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.value = freq;
            
            const startTime = now + (i * 0.07); // Rapid sweep
            
            // Envelope: quick attack, long sparkling decay
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + 1.5);
        });
    }

    if (openBtn && card) {
        openBtn.addEventListener("click", () => {
            // Play synthesized magical fairy sound (100% reliable)
            try { playFairySound(); } catch (e) { console.log(e); }

            // Trigger the magical exit animation on the card
            card.classList.add("magic-exit");

            // Fade to white before navigating
            setTimeout(addFlashOverlay, 950);

            // Navigate to invitation details page
            setTimeout(() => {
                window.location.href = "invitation.html";
            }, 1700);
        });
    }

});
