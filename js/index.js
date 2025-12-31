document.addEventListener("DOMContentLoaded", function() {
    var box = document.getElementById("contentBox");
    var canvas = document.getElementById("chartCanvas");
    var range = document.getElementById("scrollRange");
    var ctx = canvas.getContext("2d");

    canvas.width = 20;
    canvas.height = 330;

    var amplitude = 5;
    var frequency = 3;
    var highlightHeight = 0; // این مقدار بعداً محاسبه می‌شود

    // رسم نمودار با highlight
    function drawBackground(t) {
        if (t === undefined) t = 0; // مقدار پیش‌فرض
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (var y = 0; y < canvas.height; y++) {
            var x = canvas.width/2 + Math.sin(y/frequency) * amplitude;
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // highlight
        var startY = t * (canvas.height - highlightHeight);
        ctx.strokeStyle = "lightblue";
        ctx.lineWidth = 4;
        ctx.beginPath();
        for ( y = startY; y < startY + highlightHeight; y++) {
             x = canvas.width/2 + Math.sin(y/frequency) * amplitude;
            if (y === startY) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // محاسبه max range و ارتفاع highlight اتوماتیک
    function updateRangeMax() {
        range.max = box.scrollHeight - box.clientHeight;
        if (range.max < 0) range.max = 0;
        highlightHeight = canvas.height * (box.clientHeight / box.scrollHeight);
        if (highlightHeight > canvas.height) highlightHeight = canvas.height;
    }

    updateRangeMax();
    range.value = 0;
    drawBackground(0);

    // وقتی range تغییر کرد
    range.addEventListener("input", function() {
        box.scrollTop = this.value;
        var t = this.value / (box.scrollHeight - box.clientHeight);
        drawBackground(t);
    });

    // scroll wheel روی tbox
    box.addEventListener("wheel", function(e) {
        e.preventDefault();
        var delta = e.deltaY;
        var newValue = parseInt(range.value) + delta;
        if (newValue < 0) newValue = 0;
        if (newValue > range.max) newValue = range.max;
        range.value = newValue;
        box.scrollTop = newValue;
        var t = newValue / (box.scrollHeight - box.clientHeight);
        drawBackground(t);
    });

    // drag روی canvas
    var isDragging = false;
    var startY = 0;
    var startScroll = 0;

    canvas.addEventListener("mousedown", function(e) {
        isDragging = true;
        startY = e.clientY;
        startScroll = box.scrollTop;
    });

    document.addEventListener("mousemove", function(e) {
        if (!isDragging) return;
        var delta = e.clientY - startY;
        var newScroll = startScroll + delta * (box.scrollHeight / canvas.height);
        if (newScroll < 0) newScroll = 0;
        if (newScroll > box.scrollHeight - box.clientHeight) newScroll = box.scrollHeight - box.clientHeight;
        box.scrollTop = newScroll;
        drawBackground(newScroll / (box.scrollHeight - box.clientHeight));
    });

    document.addEventListener("mouseup", function() {
        isDragging = false;
    });
    // تغییر محتوا از منو

    document.querySelectorAll(".menub").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();

            // remove active from all buttons
            document.querySelectorAll(".menub.active").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const key = btn.dataset.page;
            const tpl = document.getElementById(key);
            if(!tpl) {
                box.textContent = "Content not found.";
                return;
            }

            box.innerHTML = "";
            box.appendChild(tpl.content.cloneNode(true));
            box.scrollTop = 0;
        });
    });

    // show first tab by default
    const first = document.querySelector(".menub");
    if(first) first.click();

});

