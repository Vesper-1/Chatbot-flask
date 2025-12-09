# Flask ChatGPT

一个基于 Flask 和 OpenAI API 构建的简单聊天机器人应用。

## 项目简介

这是一个用于学习 Flask Web 开发的练手项目，实现了一个简单的 ChatGPT 聊天界面。

### 功能特性

- 与 ChatGPT 进行对话
- 保持对话上下文（在同一会话中）
- 简洁美观的聊天界面
- 支持 Reset 清空对话

### 技术栈

- **后端**: Python + Flask
- **前端**: HTML + CSS + JavaScript
- **API**: OpenAI ChatGPT API

## 运行环境要求

- Python 3.8 或更高版本
- OpenAI API Key

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/Chatbot-flask.git
cd Chatbot-flask
```

### 2. 创建虚拟环境（推荐）

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. 安装依赖

```bash
pip install -r requirements.txt

# 如果在国内下载慢，使用清华镜像
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 4. 配置 API Key

编辑 `.env` 文件，填入你的 OpenAI API Key：

```
OPENAI_API_KEY=your-api-key-here
```

### 5. 启动应用

```bash
python app.py
```

### 6. 访问应用

打开浏览器，访问 http://localhost:5000

## 项目结构

```
Chatbot-flask/
├── app.py              # Flask 后端主程序
├── requirements.txt    # Python 依赖列表
├── .env                # 环境变量配置（API Key）
├── README.md           # 项目说明文档
├── LICENSE             # 开源许可证
├── templates/
│   └── index.html      # 前端 HTML 页面
└── static/
    ├── app.js          # 前端 JavaScript 逻辑
    └── style.css       # 前端 CSS 样式
```

## Windows 11 本地运行说明

**这个项目完全可以在 Windows 11 上直接运行，不需要虚拟机！**

### Windows 运行步骤

1. **安装 Python**
   - 从 [Python 官网](https://www.python.org/downloads/) 下载并安装 Python 3.8+
   - 安装时勾选 "Add Python to PATH"

2. **打开命令提示符或 PowerShell**
   ```powershell
   # 进入项目目录
   cd C:\path\to\Chatbot-flask

   # 创建虚拟环境
   python -m venv venv

   # 激活虚拟环境
   .\venv\Scripts\activate

   # 安装依赖
   pip install -r requirements.txt

   # 运行应用
   python app.py
   ```

3. **访问应用**
   - 打开浏览器，访问 http://localhost:5000

### 常见问题

**Q: 为什么选择 Flask 而不是 Django？**
A: Flask 更轻量，适合学习和小型项目。

**Q: 聊天记录会保存吗？**
A: 当前版本聊天记录保存在服务器内存中，重启服务器后会清空。

**Q: 如何修改 AI 的回复风格？**
A: 修改 `app.py` 中的 `SYSTEM_PROMPT` 变量。

## API 端点

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/` | 返回聊天页面 |
| POST | `/api/chat` | 发送消息并获取 AI 回复 |
| GET | `/api/history` | 获取聊天历史 |
| POST | `/api/reset` | 清空聊天历史 |

## 安全提醒

- **请勿将 `.env` 文件提交到公共仓库**
- 建议将 `.env` 添加到 `.gitignore`
- 如果 API Key 泄露，请立即在 OpenAI 后台重新生成

## License

MIT License
