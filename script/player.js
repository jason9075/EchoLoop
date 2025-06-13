const audio = document.getElementById("audio");
const addMarkerBtn = document.getElementById("addMarker");
const markerList = document.getElementById("markerList");
const loopStart = document.getElementById("loopStart");
const loopEnd = document.getElementById("loopEnd");
const toggleLoop = document.getElementById("toggleLoop");
const loopInfo = document.getElementById("loopInfo");

let markers = [];
let loopInterval = null;
let loopEnabled = false;

document.getElementById("audioFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        audio.src = url;
    }
});

addMarkerBtn.addEventListener("click", () => {
    const time = audio.currentTime;
    markers.push(time);
    updateMarkerList();
    updateLoopInfo();
});

toggleLoop.addEventListener("click", () => {
    loopEnabled = !loopEnabled;
    toggleLoop.textContent = loopEnabled ? "停用循環" : "啟用循環";

    clearInterval(loopInterval);

    if (loopEnabled) {
        const start = parseFloat(loopStart.value);
        const end = parseFloat(loopEnd.value);

        if (isNaN(start) || isNaN(end)) {
            loopInfo.textContent = "請選擇循環起始與結束點";
            return;
        }

        if (start >= end) {
            loopInfo.textContent = "❌ 起始時間不能大於等於結束時間";
            return;
        }

        audio.currentTime = start;

        loopInterval = setInterval(() => {
            if (audio.currentTime >= end) {
                audio.currentTime = start;
            }
        }, 100);
    } else {
        loopInfo.textContent = "🔁 循環已停用";
    }

    updateLoopInfo();
});

function updateLoopInfo() {
    const start = parseFloat(loopStart.value);
    const end = parseFloat(loopEnd.value);

    if (isNaN(start) || isNaN(end)) {
        loopInfo.textContent = "";
        return;
    }

    const duration = (end - start).toFixed(2);

    if (duration <= 0) {
        loopInfo.textContent = "❌ 標記順序錯誤，結束時間需大於起始時間";
    } else {
        loopInfo.textContent = `✅ 循環長度：${duration} 秒`;
    }
}

function updateMarkerList() {
    markerList.innerHTML = "";
    loopStart.innerHTML = "";
    loopEnd.innerHTML = "";

    markers.forEach((time, index) => {
        const label = `#${index + 1} - ${formatTime(time)}s`;

        const li = document.createElement("li");
        const playBtn = document.createElement("span");
        playBtn.textContent = label;
        playBtn.style.cursor = "pointer";
        playBtn.onclick = () => (audio.currentTime = time);

        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.style.marginLeft = "0.5rem";
        delBtn.onclick = () => {
            markers.splice(index, 1);
            updateMarkerList();
            updateLoopInfo();
        };

        li.appendChild(playBtn);
        li.appendChild(delBtn);
        markerList.appendChild(li);

        loopStart.appendChild(new Option(label, time));
        loopEnd.appendChild(new Option(label, time));
    });
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${m}:${s}`;
}
