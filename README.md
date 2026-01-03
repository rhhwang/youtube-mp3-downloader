# YouTube MP3 下載器

一個簡單的 web 工具，可以將 YouTube 影片下載為 MP3 音訊檔案。

## 功能特色

- 輸入 YouTube URL 即可下載音訊
- 支援多種音訊品質選擇：128kbps、192kbps、256kbps、320kbps
- 可自訂儲存目錄
- 美觀的使用者介面
- 即時下載進度顯示

## 系統需求

1. **Node.js** (版本 14 或更高)
2. **yt-dlp** (用於下載 YouTube 影片)
3. **FFmpeg** (用於音訊轉換)

## 安裝步驟

### 1. 安裝 yt-dlp

**macOS (使用 Homebrew):**
```bash
brew install yt-dlp
```

**Linux:**
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

**Windows:**
下載 [yt-dlp.exe](https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe) 並將其放在 PATH 環境變數中。

### 2. 安裝 FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
下載並安裝 [FFmpeg](https://ffmpeg.org/download.html)。

### 3. 安裝專案依賴

```bash
cd youtube-mp3-downloader
npm install
```

## 使用方法

### 啟動伺服器

```bash
npm start
```

或使用開發模式（自動重新載入）：

```bash
npm run dev
```

### 使用應用程式

1. 在瀏覽器中開啟 `http://localhost:3000`
2. 輸入 YouTube 影片網址
3. 點擊選擇要儲存的目錄
4. 選擇音訊品質（128kbps、192kbps、256kbps 或 320kbps）
5. 點擊「開始下載」按鈕
6. 等待下載完成

## 專案結構

```
youtube-mp3-downloader/
├── server.js           # Express 伺服器
├── package.json        # 專案配置
├── README.md          # 說明文件
└── public/            # 前端檔案
    ├── index.html     # 主頁面
    └── app.js         # 前端 JavaScript
```

## 注意事項

- 請確保您有權下載該 YouTube 影片
- 下載速度取決於網路連線和影片大小
- 某些受版權保護的影片可能無法下載
- 目錄選擇功能在某些瀏覽器中可能需要特殊權限

## 疑難排解

### 找不到 yt-dlp

確保 yt-dlp 已正確安裝並在 PATH 中：

```bash
yt-dlp --version
```

### 音訊轉換失敗

確保 FFmpeg 已正確安裝：

```bash
ffmpeg -version
```

### 目錄選擇無法使用

瀏覽器的目錄選擇功能在某些環境中受限。您可能需要：
- 使用支援 webkitdirectory 的瀏覽器（Chrome、Edge）
- 手動修改 server.js 中的預設儲存路徑

## 授權

MIT License
