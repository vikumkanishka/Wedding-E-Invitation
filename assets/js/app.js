document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("openInvitationBtn");
    
    if(openBtn) {
        openBtn.addEventListener("click", () => {
            // Add a simple animation effect or transition here
            // For now, let's just create an alert for the demo
            console.log("Opening invitation...");
            
            // Example of what could happen:
            // document.querySelector('.invitation-card').style.transform = 'scale(1.1)';
            // document.querySelector('.invitation-card').style.opacity = '0';
            // setTimeout(() => { window.location.href = "invitation-details.html"; }, 500);
            
            alert("This will navigate to the full invitation details!");
        });
    }
});
