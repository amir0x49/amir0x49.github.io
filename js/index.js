document.addEventListener("DOMContentLoaded", function() {
    const box = document.getElementById("contentBox");
    const canvas = document.getElementById("chartCanvas");
    const range = document.getElementById("scrollRange");
    const ctx = canvas.getContext("2d");

    canvas.width = 20;
    canvas.height = 330;

    const amplitude = 5;
    const frequency = 3;
    let highlightHeight = 0;

    // رسم نمودار با highlight
    function drawBackground(t) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // خطوط پس‌زمینه
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let y = 0; y < canvas.height; y++) {
            const x = canvas.width / 2 + Math.sin(y / frequency) * amplitude;
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // highlight
        const startY = t * (canvas.height - highlightHeight);
        ctx.strokeStyle = "lightblue";
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let y = startY; y < startY + highlightHeight; y++) {
            const x = canvas.width / 2 + Math.sin(y / frequency) * amplitude;
            if (y === startY) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // محاسبه max range و ارتفاع highlight
    function updateRangeMax() {
        range.max = Math.max(0, box.scrollHeight - box.clientHeight);
        highlightHeight = canvas.height * (box.clientHeight / box.scrollHeight);
        if (highlightHeight > canvas.height) highlightHeight = canvas.height;
    }

    // بروزرسانی highlight و range بعد از تغییر محتوا
    function refreshScroll() {
        box.scrollTop = 0;
        updateRangeMax();
        range.value = 0;
        drawBackground(0);
    }

    // init
    refreshScroll();

    // وقتی range تغییر کرد
    range.addEventListener("input", function() {
        box.scrollTop = this.value;
        const t = (box.scrollHeight - box.clientHeight) ? this.value / (box.scrollHeight - box.clientHeight) : 0;
        drawBackground(t);
    });

    // scroll wheel روی box
    box.addEventListener("wheel", function(e) {
        e.preventDefault();
        let newScroll = box.scrollTop + e.deltaY;
        newScroll = Math.max(0, Math.min(newScroll, box.scrollHeight - box.clientHeight));
        box.scrollTop = newScroll;
        range.value = newScroll;
        const t = (box.scrollHeight - box.clientHeight) ? newScroll / (box.scrollHeight - box.clientHeight) : 0;
        drawBackground(t);
    });

    // drag روی canvas
    let isDragging = false;
    let startY = 0;
    let startScroll = 0;

    canvas.addEventListener("mousedown", function(e) {
        isDragging = true;
        startY = e.clientY;
        startScroll = box.scrollTop;
    });

    document.addEventListener("mousemove", function(e) {
        if (!isDragging) return;
        const delta = e.clientY - startY;
        let newScroll = startScroll + delta * ((box.scrollHeight - box.clientHeight) / canvas.height);
        newScroll = Math.max(0, Math.min(newScroll, box.scrollHeight - box.clientHeight));
        box.scrollTop = newScroll;
        range.value = newScroll;
        const t = (box.scrollHeight - box.clientHeight) ? newScroll / (box.scrollHeight - box.clientHeight) : 0;
        drawBackground(t);
    });

    document.addEventListener("mouseup", function() {
        isDragging = false;
    });
    let touchStartY = 0;
let touchStartScroll = 0;

box.addEventListener("touchstart", e => {
    touchStartY = e.touches[0].clientY;
    touchStartScroll = box.scrollTop;
}, { passive: true });

box.addEventListener("touchmove", e => {
    const y = e.touches[0].clientY;
    const delta = touchStartY - y;

    let newScroll = touchStartScroll + delta;
    newScroll = Math.max(0, Math.min(newScroll, box.scrollHeight - box.clientHeight));

    box.scrollTop = newScroll;
    range.value = newScroll;

    const t = (box.scrollHeight - box.clientHeight)
        ? newScroll / (box.scrollHeight - box.clientHeight)
        : 0;

    drawBackground(t);

    e.preventDefault();
}, { passive: false });
canvas.addEventListener("touchstart", e => {
    isDragging = true;
    startY = e.touches[0].clientY;
    startScroll = box.scrollTop;
}, { passive: true });

canvas.addEventListener("touchmove", e => {
    if (!isDragging) return;

    const delta = e.touches[0].clientY - startY;
    let newScroll = startScroll + delta * ((box.scrollHeight - box.clientHeight) / canvas.height);

    newScroll = Math.max(0, Math.min(newScroll, box.scrollHeight - box.clientHeight));
    box.scrollTop = newScroll;
    range.value = newScroll;

    const t = (box.scrollHeight - box.clientHeight)
        ? newScroll / (box.scrollHeight - box.clientHeight)
        : 0;

    drawBackground(t);

    e.preventDefault();
}, { passive: false });

canvas.addEventListener("touchend", () => {
    isDragging = false;
});

    // تغییر محتوا از منو

    const buttons = document.querySelectorAll(".menub");

    buttons.forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();

    buttons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    const key = this.dataset.page;
    const template = document.getElementById(key);

    if(template){
      box.innerHTML = "";
      box.appendChild(template.content.cloneNode(true));
      setTimeout(() => refreshScroll(), 50);
    }
  });
});

});







