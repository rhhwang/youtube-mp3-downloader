const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

// 取得使用者的下載目錄
app.get('/api/default-path', (req, res) => {
    const homeDir = os.homedir();
    const downloadPath = path.join(homeDir, 'Downloads');
    res.json({ defaultPath: downloadPath });
});

// 下載 YouTube 音訊的 API
app.post('/api/download', async (req, res) => {
    const { youtubeUrl, outputPath, bitrate } = req.body;

    // 驗證輸入
    if (!youtubeUrl) {
        return res.status(400).json({ error: '請提供 YouTube 網址' });
    }

    if (!outputPath) {
        return res.status(400).json({ error: '請選擇儲存目錄' });
    }

    if (!bitrate || !['128', '192', '256', '320'].includes(bitrate)) {
        return res.status(400).json({ error: '無效的音訊品質設定' });
    }

    // 驗證 YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(youtubeUrl)) {
        return res.status(400).json({ error: '無效的 YouTube 網址' });
    }

    // 確保輸出目錄存在
    if (!fs.existsSync(outputPath)) {
        return res.status(400).json({ error: '指定的目錄不存在' });
    }

    // 生成輸出檔案路徑
    const outputTemplate = path.join(outputPath, '%(title)s.%(ext)s');

    // 建立 yt-dlp 指令
    // -x: 提取音訊
    // --audio-format mp3: 轉換為 MP3
    // --audio-quality: 指定音訊品質
    // -o: 輸出檔案名稱模板
    const command = `yt-dlp -x --audio-format mp3 --audio-quality ${bitrate}K -o "${outputTemplate}" "${youtubeUrl}"`;

    console.log('執行指令:', command);

    // 執行下載
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
            console.error('下載錯誤:', error);
            console.error('stderr:', stderr);

            let errorMessage = '下載失敗';

            if (stderr.includes('Video unavailable')) {
                errorMessage = '影片無法使用或不存在';
            } else if (stderr.includes('Private video')) {
                errorMessage = '這是私人影片，無法下載';
            } else if (stderr.includes('This video is not available')) {
                errorMessage = '影片無法使用';
            } else if (error.message.includes('command not found') || error.message.includes('not recognized')) {
                errorMessage = '找不到 yt-dlp，請確認已安裝';
            }

            return res.status(500).json({ error: errorMessage, details: stderr });
        }

        console.log('下載成功:', stdout);

        // 從輸出中提取檔案名稱
        const fileMatch = stdout.match(/\[ExtractAudio\] Destination: (.+\.mp3)/);
        let fileName = '未知檔案';

        if (fileMatch && fileMatch[1]) {
            fileName = path.basename(fileMatch[1]);
        }

        res.json({
            success: true,
            message: '下載完成！',
            fileName: fileName,
            outputPath: outputPath
        });
    });
});

// 檢查 yt-dlp 是否已安裝
app.get('/api/check-ytdlp', (req, res) => {
    exec('yt-dlp --version', (error, stdout) => {
        if (error) {
            return res.json({
                installed: false,
                message: '未安裝 yt-dlp'
            });
        }

        res.json({
            installed: true,
            version: stdout.trim()
        });
    });
});

app.listen(PORT, () => {
    console.log(`伺服器運行在 http://localhost:${PORT}`);
    console.log('請在瀏覽器中開啟上述網址');
});
