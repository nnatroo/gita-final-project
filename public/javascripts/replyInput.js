document.addEventListener("DOMContentLoaded", function () {
    const replyButtons = document.querySelectorAll(".reply-btn");
    replyButtons.forEach((replyButton) => {
        console.log(replyButton);
        replyButton.addEventListener("click", function () {
            const textarea = this.nextElementSibling;
            textarea.classList.toggle("show");
        })
    })
})