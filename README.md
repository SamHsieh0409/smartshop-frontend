SmartShop 是一個現代化的 AI 智慧書店前端應用程式。本專案使用 **React 19** 與 **Vite** 建構，並採用 **Material UI (MUI)** 打造精緻的響應式介面，提供流暢的購物與 AI 互動體驗。

## ✨ 功能特色 (Features)

### 👤 會員功能
* **📚 商品瀏覽**：
  * 首頁橫幅 (Hero Banner) 與隨機推薦書籍 (Featured Products)。
  * 支援關鍵字搜尋、分類篩選 (文學小說、心理成長等)、價格排序。
* **🤖 AI 購物助手**：
  * 右下角懸浮聊天機器人，整合 Ollama 模型。
  * 透過自然語言理解使用者需求 (例如：「我想找便宜的小說」)，並推薦對應書籍。
* **🛒 購物車系統**：
  * 即時更新商品數量、移除商品、自動計算總金額。
* **💳 結帳與支付**：
  * 建立訂單並支援 **模擬金流體驗**。
  * 精美的彈出視窗模擬銀行連線、處理中與付款成功動畫。
* **👤 會員中心**：
  * 註冊、登入 (JWT/Session)、查看歷史訂單狀態。

### ⚙️ 管理員後台 (Admin)
* **書籍管理**：提供完整的 CRUD 功能 (新增、修改、刪除書籍)，支援圖片預覽。

## 🛠️ 技術棧 (Tech Stack)

* **核心框架**：React 19, Vite
* **UI 函式庫**：Material UI (MUI) v6, Emotion
* **路由管理**：React Router DOM v6
* **HTTP 請求**：Axios (設定攔截器與 Proxy)
* **通知提示**：自定義 Notification Context (Snackbar)
* **狀態管理**：React Context API (AuthContext)
