const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");
const resetBtn = document.getElementById("resetBtn");

function add(role, text) {
  const row = document.createElement("div");
  row.className = `msg ${role === "user" ? "user" : "bot"}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

async function loadHistory() {
  const r = await fetch("/api/history");
  const data = await r.json();
  chat.innerHTML = "";
  (data.messages || []).forEach(m => add(m.role, m.content));
}

async function send() {
  const text = (msg.value || "").trim();
  if (!text) return;

  msg.value = "";
  add("user", text);

  sendBtn.disabled = true;
  msg.disabled = true;

  // 简单的“思考中…”
  const thinkingId = "thinking_" + Math.random().toString(16).slice(2);
  add("assistant", "…");
  chat.lastChild.id = thinkingId;

  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: text})
    });
    const data = await r.json();

    // 替换“…”那条
    const thinkingNode = document.getElementById(thinkingId);
    if (thinkingNode) thinkingNode.remove();

    if (!r.ok) {
      add("assistant", data.error || "Request failed");
      return;
    }
    add("assistant", data.reply || "");
  } catch (e) {
    const thinkingNode = document.getElementById(thinkingId);
    if (thinkingNode) thinkingNode.remove();
    add("assistant", "Network/Server error: " + e.message);
  } finally {
    sendBtn.disabled = false;
    msg.disabled = false;
    msg.focus();
  }
}

sendBtn.addEventListener("click", send);
msg.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});

resetBtn.addEventListener("click", async () => {
  await fetch("/api/reset", { method: "POST" });
  await loadHistory();
  msg.focus();
});

loadHistory();
