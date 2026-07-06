document.addEventListener("DOMContentLoaded", () => {
    /* ======================================================
       OPEN INVITATION — MAGICAL EXIT & VIEW SWITCH
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
        
        const frequencies = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00, 2349.32, 2637.02, 3135.96, 3520.00, 4186.01];
        
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.value = freq;
            
            const startTime = now + (i * 0.07);
            
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
            // Play synthesized magical fairy sound
            try { playFairySound(); } catch (e) { console.log(e); }

            // Trigger the magical exit animation on the card
            card.classList.add("magic-exit");

            // Guarantee music plays immediately on click
            const bgMusic = document.getElementById("bg-music");
            if (bgMusic) {
                // Ensure UI reflects playing state in petals.js
                window.musicStartedByClick = true;
                bgMusic.play().catch(e => console.log("Music play failed:", e));
            }

            // Fade to white before switching views
            setTimeout(addFlashOverlay, 950);

            // Switch to invitation view
            setTimeout(() => {
                document.getElementById("landing-view").style.display = "none";
                document.body.style.overflowY = "auto"; // Allow scrolling
                
                const invView = document.getElementById("invitation-view");
                invView.style.display = "block";
                
                // Trigger reflow for fade in
                void invView.offsetWidth;
                invView.style.opacity = "1";
                
                // Initialize auto-scrolling
                if (typeof window.startAutoScroll === "function") {
                    window.startAutoScroll();
                }
            }, 1700);
        });
    }
});
