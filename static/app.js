/**
 * Flask ChatGPT 前端交互脚本
 * ===========================
 *
 * 这个文件负责所有的前端交互逻辑，包括：
 * 1. 发送用户消息到后端
 * 2. 显示 AI 回复
 * 3. 管理聊天历史的加载和显示
 * 4. 处理用户输入事件
 *
 * API 端点：
 * - POST /api/chat   - 发送消息并获取 AI 回复
 * - GET  /api/history - 获取聊天历史
 * - POST /api/reset   - 清空聊天历史
 */

// ============================================================
// DOM 元素引用
// ============================================================

/**
 * 聊天消息容器元素
 * 所有消息气泡都会添加到这个容器中
 */
const chat = document.getElementById("chat");

/**
 * 消息输入框元素
 * 用户在这里输入要发送的消息
 */
const msg = document.getElementById("msg");

/**
 * 发送按钮元素
 * 点击后发送消息
 */
const sendBtn = document.getElementById("sendBtn");

/**
 * 重置按钮元素
 * 点击后清空所有聊天记录
 */
const resetBtn = document.getElementById("resetBtn");

// ============================================================
// 核心功能函数
// ============================================================

/**
 * 添加消息到聊天界面
 *
 * @param {string} role - 消息角色，"user" 表示用户，其他表示 AI
 * @param {string} text - 消息文本内容
 *
 * 这个函数会：
 * 1. 创建消息容器 div（.msg）
 * 2. 根据角色添加对应的 CSS 类（.user 或 .bot）
 * 3. 创建消息气泡 div（.bubble）
 * 4. 将消息添加到聊天区域
 * 5. 自动滚动到最新消息
 */
function add(role, text) {
  // 创建消息行容器
  const row = document.createElement("div");
  // 根据角色设置不同的 CSS 类
  // user 角色显示在右边（蓝色气泡）
  // 其他角色（assistant）显示在左边（灰色气泡）
  row.className = `msg ${role === "user" ? "user" : "bot"}`;

  // 创建消息气泡
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  // 设置消息文本（使用 textContent 防止 XSS 攻击）
  bubble.textContent = text;

  // 将气泡添加到消息行
  row.appendChild(bubble);
  // 将消息行添加到聊天容器
  chat.appendChild(row);
  // 滚动到底部，显示最新消息
  chat.scrollTop = chat.scrollHeight;
}

/**
 * 从服务器加载聊天历史
 *
 * 这个函数会：
 * 1. 调用 /api/history 获取所有历史消息
 * 2. 清空当前聊天界面
 * 3. 遍历历史消息并显示
 *
 * 调用时机：
 * - 页面加载时
 * - 点击 Reset 按钮后
 */
async function loadHistory() {
  // 发送 GET 请求获取聊天历史
  const r = await fetch("/api/history");
  // 解析 JSON 响应
  const data = await r.json();
  // 清空当前聊天界面
  chat.innerHTML = "";
  // 遍历消息数组，逐条显示
  // data.messages 可能为 undefined，所以使用 || [] 作为默认值
  (data.messages || []).forEach(m => add(m.role, m.content));
}

/**
 * 发送消息到服务器
 *
 * 这是核心功能函数，处理整个发送消息的流程：
 *
 * 流程：
 * 1. 获取并验证用户输入
 * 2. 清空输入框并显示用户消息
 * 3. 禁用输入控件（防止重复发送）
 * 4. 显示 "思考中..." 提示
 * 5. 发送 POST 请求到 /api/chat
 * 6. 处理响应（成功显示回复，失败显示错误）
 * 7. 恢复输入控件
 */
async function send() {
  // ========== 步骤 1: 获取并验证输入 ==========
  // 获取输入框的值，去除首尾空格
  const text = (msg.value || "").trim();
  // 如果输入为空，直接返回不处理
  if (!text) return;

  // ========== 步骤 2: 清空输入框，显示用户消息 ==========
  msg.value = "";  // 清空输入框
  add("user", text);  // 在界面上显示用户消息

  // ========== 步骤 3: 禁用输入控件 ==========
  // 发送过程中禁用按钮和输入框，防止用户重复发送
  sendBtn.disabled = true;
  msg.disabled = true;

  // ========== 步骤 4: 显示 "思考中..." 提示 ==========
  // 生成一个随机 ID，用于之后定位和移除这个临时消息
  const thinkingId = "thinking_" + Math.random().toString(16).slice(2);
  // 添加一个 "..." 消息表示 AI 正在思考
  add("assistant", "...");
  // 给这个消息设置 ID，方便后续移除
  chat.lastChild.id = thinkingId;

  // ========== 步骤 5 & 6: 发送请求并处理响应 ==========
  try {
    // 发送 POST 请求到后端 API
    const r = await fetch("/api/chat", {
      method: "POST",  // 使用 POST 方法
      headers: {"Content-Type": "application/json"},  // 设置内容类型为 JSON
      body: JSON.stringify({message: text})  // 将消息包装为 JSON 格式
    });
    // 解析响应 JSON
    const data = await r.json();

    // 移除 "思考中..." 的临时消息
    const thinkingNode = document.getElementById(thinkingId);
    if (thinkingNode) thinkingNode.remove();

    // 检查响应状态
    if (!r.ok) {
      // HTTP 状态码不是 2xx，显示错误信息
      add("assistant", data.error || "Request failed");
      return;
    }
    // 成功：显示 AI 的回复
    add("assistant", data.reply || "");

  } catch (e) {
    // ========== 网络错误处理 ==========
    // 移除 "思考中..." 消息
    const thinkingNode = document.getElementById(thinkingId);
    if (thinkingNode) thinkingNode.remove();
    // 显示网络错误信息
    add("assistant", "Network/Server error: " + e.message);

  } finally {
    // ========== 步骤 7: 恢复输入控件 ==========
    // 无论成功还是失败，都要恢复输入控件
    sendBtn.disabled = false;
    msg.disabled = false;
    // 将焦点设回输入框，方便用户继续输入
    msg.focus();
  }
}

// ============================================================
// 事件绑定
// ============================================================

/**
 * 发送按钮点击事件
 * 点击 Send 按钮时发送消息
 */
sendBtn.addEventListener("click", send);

/**
 * 输入框键盘事件
 * 按下 Enter 键时发送消息
 * 这样用户可以直接按回车发送，不需要点击按钮
 */
msg.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});

/**
 * 重置按钮点击事件
 * 点击 Reset 按钮时：
 * 1. 调用 /api/reset 清空服务器端的聊天历史
 * 2. 重新加载（此时为空的）聊天历史
 * 3. 将焦点设到输入框
 */
resetBtn.addEventListener("click", async () => {
  // 发送 POST 请求清空聊天历史
  await fetch("/api/reset", { method: "POST" });
  // 重新加载聊天历史（此时应该为空）
  await loadHistory();
  // 将焦点设到输入框
  msg.focus();
});

// ============================================================
// 页面初始化
// ============================================================

/**
 * 页面加载完成后，自动加载聊天历史
 * 这样用户刷新页面后可以看到之前的对话（如果服务器没有重启的话）
 */
loadHistory();
