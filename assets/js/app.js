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

    if (openBtn && card) {
        openBtn.addEventListener("click", () => {
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
