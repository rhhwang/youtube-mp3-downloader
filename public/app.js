// DOM 元素
const form = document.getElementById('downloadForm');
const youtubeUrlInput = document.getElementById('youtubeUrl');
const outputPathInput = document.getElementById('outputPath');
const downloadBtn = document.getElementById('downloadBtn');
const statusDiv = document.getElementById('status');
const progressBar = document.getElementById('progressBar');
const progressBarFill = document.getElementById('progressBarFill');

// 載入預設下載目錄
async function loadDefaultPath() {
    try {
        const response = await fetch('/api/default-path');
        const data = await response.json();
        if (data.defaultPath) {
            outputPathInput.value = data.defaultPath;
        }
    } catch (error) {
        console.error('無法載入預設路徑:', error);
    }
}

// 頁面載入時自動填入預設路徑
loadDefaultPath();

// 顯示狀態訊息
function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
}

// 隱藏狀態訊息
function hideStatus() {
    statusDiv.style.display = 'none';
}

// 顯示進度條
function showProgress() {
    progressBar.style.display = 'block';
    progressBarFill.style.width = '0%';
}

// 更新進度條
function updateProgress(percent) {
    progressBarFill.style.width = percent + '%';
}

// 隱藏進度條
function hideProgress() {
    progressBar.style.display = 'none';
}

// 檢查 yt-dlp 是否已安裝
async function checkYtdlp() {
    try {
        const response = await fetch('/api/check-ytdlp');
        const data = await response.json();

        if (!data.installed) {
            showStatus('警告: 未檢測到 yt-dlp。請先安裝 yt-dlp 才能使用此工具。', 'error');
        }
    } catch (error) {
        console.error('檢查 yt-dlp 時發生錯誤:', error);
    }
}

// 頁面載入時檢查
checkYtdlp();

// 處理表單提交
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const youtubeUrl = youtubeUrlInput.value.trim();
    const outputPath = outputPathInput.value;
    const bitrate = document.querySelector('input[name="bitrate"]:checked').value;

    // 驗證輸入
    if (!youtubeUrl) {
        showStatus('請輸入 YouTube 網址', 'error');
        return;
    }

    if (!outputPath) {
        showStatus('請選擇儲存目錄', 'error');
        return;
    }

    // 禁用按鈕並顯示進度
    downloadBtn.disabled = true;
    downloadBtn.textContent = '下載中...';
    hideStatus();
    showProgress();

    // 模擬進度更新
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) {
            progress = 90;
            clearInterval(progressInterval);
        }
        updateProgress(progress);
    }, 500);

    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                youtubeUrl,
                outputPath,
                bitrate
            })
        });

        const data = await response.json();

        clearInterval(progressInterval);

        if (response.ok && data.success) {
            updateProgress(100);
            setTimeout(() => {
                showStatus(`下載完成！檔案: ${data.fileName}`, 'success');
                hideProgress();
            }, 500);
        } else {
            updateProgress(0);
            showStatus(data.error || '下載失敗，請檢查網址或重試', 'error');
            hideProgress();
        }
    } catch (error) {
        clearInterval(progressInterval);
        updateProgress(0);
        showStatus('發生錯誤: ' + error.message, 'error');
        hideProgress();
        console.error('下載錯誤:', error);
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.textContent = '開始下載';
    }
});

// 清除錯誤訊息當用戶開始輸入時
youtubeUrlInput.addEventListener('input', hideStatus);
outputPathInput.addEventListener('input', hideStatus);
