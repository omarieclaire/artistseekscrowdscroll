var gems = [...document.querySelectorAll(".answer-gem")];

const handlers = {}

document.addEventListener("touchstart", (e) => {
    handlers[e.target?.id] && handlers[e.target?.id].dragStart(e);
    handlers[e.target.parentElement?.id] && handlers[e.target.parentElement?.id].dragStart(e);
}, { passive: false });
document.addEventListener("touchend", (e) => {
    handlers[e.target?.id] && handlers[e.target?.id].dragEnd(e);
    handlers[e.target.parentElement?.id] && handlers[e.target.parentElement?.id].dragEnd(e);
}, { passive: false });
document.addEventListener("touchmove", (e) => {
    handlers[e.target?.id] && handlers[e.target?.id].drag(e);
    handlers[e.target.parentElement?.id] && handlers[e.target.parentElement?.id].drag(e);
}, { passive: false });

document.addEventListener("mousedown", (e) => {
    console.log(e.target, e.target.parentElement?.id, handlers[e.target.parentElement?.id]);
    handlers[e.target?.id] && handlers[e.target?.id].dragStart(e);
    handlers[e.target.parentElement?.id] && handlers[e.target.parentElement?.id].dragStart(e);
}, { passive: false });
document.addEventListener("mouseup", (e) => {
    activeHandler?.dragEnd(e);
}, { passive: false });
document.addEventListener("mousemove", (e) => {
    activeHandler?.drag(e);
}, { passive: false });


let activeHandler;

function setTranslate(xPos, yPos, el) {
    if (el.style.transform && !el.theTransform) {
        el.theTransform = el.style.transform;
    }
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

window.activeGem = null;

gems.forEach((gem) => {
    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    const img = gem.querySelector('img')
    const id = gem?.id;

    const handler = {
        dragStart,
        drag,
        dragEnd
    };

    function dragStart(e) {
        if (e.target == gem || e.target == img) {
            e.preventDefault();
            active = true;
            activeHandler = handler;
            window.activeGem = gem;
        }

        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        active = false;
        activeHandler = null;
        window.activeGem?.removeAttribute('tooltip-visible')
        window.activeGem = null;
    }

    function drag(e) {
        if (active) {

            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, gem);
        }
    }


    handlers[id] = handler
})
