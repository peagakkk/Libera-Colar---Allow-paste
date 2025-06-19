javascript:(() => {
  function loadDarkReader() {
    return new Promise((resolve, reject) => {
      if (typeof DarkReader !== "undefined") return resolve();
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/darkreader@4.9.58/darkreader.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject("Falha ao carregar DarkReader");
      document.head.appendChild(script);
    });
  }
  const toastContainerId = "global-toast-container";
  let toastContainer = document.getElementById(toastContainerId);
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = toastContainerId;
    toastContainer.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 999999999; display: flex;
      flex-direction: column; gap: 10px; font-family: 'Roboto Mono', monospace;
    `;
    document.body.appendChild(toastContainer);
  }
  function sendToast(message, type = "default", duration = 3000) {
    const toast = document.createElement("div");
    const colors = { error: "#b92e2e", success: "#00FA9A", warn: "#FFA500", info: "#00BFFF", default: "#333" };
    toast.style.cssText = `
      background: ${colors[type] || colors.default}; color: white; padding: 12px 18px;
      border-radius: 8px; font-size: 14px; box-shadow: 0 0 8px rgba(0,0,0,0.3);
      animation: fadeIn 0.3s ease, fadeOut 0.3s ease ${duration / 1000 - 0.3}s;
      min-width: 280px; max-width: 380px; user-select:none;
    `;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  }
  const styleId = "allow-paste-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes fadeIn { from {opacity: 0; transform: translateY(-10px);} to {opacity: 1; transform: translateY(0);} }
      @keyframes fadeOut { from {opacity: 1; transform: translateY(0);} to {opacity: 0; transform: translateY(-10px);} }
      @keyframes rgbGlow {
        0%,100% { color: #ff3cac; text-shadow: 0 0 2px #ff3cac, 0 0 4px #ff3cac; }
        33% { color: #00fff7; text-shadow: 0 0 2px #00fff7, 0 0 4px #00fff7; }
        66% { color: #f9f586; text-shadow: 0 0 2px #f9f586, 0 0 4px #f9f586; }
      }
      @keyframes borderGlow {
        0%,100% { border-color: #ff3cac; box-shadow: 0 0 8px #ff3cac, 0 0 16px #ff3cac; }
        33% { border-color: #00fff7; box-shadow: 0 0 8px #00fff7, 0 0 16px #00fff7; }
        66% { border-color: #f9f586; box-shadow: 0 0 8px #f9f586, 0 0 16px #f9f586; }
      }
      label[for="unlockPaste"], label[for="darkModeCheck"] {
        cursor: pointer; user-select:none; margin-bottom: 15px; display: block;
      }
      input[type="checkbox"] {
        width: 20px; height: 20px; cursor: pointer; border-radius: 3px; appearance: none;
        background-color: #1e1e1e; border: 2px solid #ff3cac; display: grid;
        place-content: center; transition: box-shadow 0.25s ease, border-color 5s linear;
        outline: none; animation: rgbGlowBorder 5s linear infinite; position: relative;
      }
      @keyframes rgbGlowBorder {
        0%,100% { border-color: #ff3cac; box-shadow: 0 0 6px #ff3cac, 0 0 12px #ff3cac; }
        33% { border-color: #00fff7; box-shadow: 0 0 6px #00fff7, 0 0 12px #00fff7; }
        66% { border-color: #f9f586; box-shadow: 0 0 6px #f9f586, 0 0 12px #f9f586; }
      }
      input[type="checkbox"]::before {
        content: ""; width: 10px; height: 10px; border-radius: 3px;
        background-color: #ff3cac; transform: scale(0);
        transition: transform 0.2s ease-in-out, background-color 5s linear;
        animation: rgbGlowBg 5s linear infinite; position: absolute; top: 4px; left: 4px;
      }
      @keyframes rgbGlowBg {
        0%,100% { background-color: #ff3cac; }
        33% { background-color: #00fff7; }
        66% { background-color: #f9f586; }
      }
      input[type="checkbox"]:checked::before { transform: scale(1); }
      #allow-paste-menu {
        opacity: 0.9; transition: opacity 0.4s ease-in-out; user-select:none; width: 360px;
        background: #121212; color: white; font-family: 'Roboto Mono', monospace;
        border-radius: 12px; border: 3px solid #ff3cac;
        box-shadow: 0 0 8px #ff3cac88, 0 0 16px #ff3cac88;
        animation: borderGlow 5s linear infinite;
        position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
        display: flex; flex-direction: column; z-index: 999999999;
        touch-action: none;
      }
      #allow-paste-menu:hover { opacity: 1; }
      #topbar {
        background: linear-gradient(90deg, rgba(5,5,10,1) 0%, rgba(48,49,53,1) 100%);
        height: 60px; border-bottom: 1px solid #333; display: flex; align-items: center;
        justify-content: space-between; padding: 0 16px; font-weight: 600;
        font-size: 16px; user-select: none; border-radius: 9px 9px 0 0;
        cursor: move; color: white; justify-content:center;
      }
      #topbarCloseBtn {
        background: #e03e3e; border: none; border-radius: 3px; width: 28px; height: 28px;
        color: white; font-weight: 700; font-size: 20px; cursor: pointer;
        display: flex; align-items: center; justify-content: center; user-select: none;
        transition: background-color 0.3s ease;
        position:absolute; right:10px; top:15px;
      }
      #topbarCloseBtn:hover { background-color: #b22e2e; }
      #content {
        flex-grow: 1; padding: 20px 24px; display: flex; flex-direction: column;
        gap: 12px; font-weight: 600; font-size: 15px; user-select: none;
      }
      #footer {
        background: #121212; height: 32px; border-top: 1px solid #333;
        display: flex; align-items: center; justify-content: center; font-size: 12px;
        font-weight: 400; border-radius: 0 0 9px 9px; user-select: none; gap: 8px;
        cursor: move; color: white;
      }
      #authorLink {
        color: rgb(102, 113, 255); font-weight: 600; text-decoration: underline;
        cursor: pointer; user-select: none; transition: color 0.3s ease;
        text-align: center; width: 100%;
      }
      #authorLink:hover { color: rgb(102, 113, 184); }
    `;
    document.head.appendChild(style);
  }
  async function pasteCleanText(inputElem, text) {
    inputElem.focus();
    const tag = inputElem.tagName.toLowerCase();
    const proto = tag === "textarea" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
    setter.call(inputElem, "");
    // Simula digitação lenta e aleatória para parecer humana
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      setter.call(inputElem, inputElem.value + ch);
      inputElem.dispatchEvent(new InputEvent("input", { data: ch, bubbles: true, inputType: "insertText" }));
      await new Promise(r => setTimeout(r, 10 + Math.random() * 80)); // intervalo entre 10ms e 90ms
    }
    inputElem.dispatchEvent(new Event("change", { bubbles: true }));
    sendToast("✅ Texto Colado.", "success");
  }
  function createMenu() {
    if(document.getElementById("allow-paste-menu")) return document.getElementById("allow-paste-menu");
    const menu = document.createElement("div");
    menu.id = "allow-paste-menu";
    menu.innerHTML = `
      <div id="topbar" title="@peagakkk-github">
        <span>@peagakkk-github</span>
        <button id="topbarCloseBtn" title="Fechar">×</button>
      </div>
      <div id="content">
        <label for="unlockPaste">
          <input type="checkbox" id="unlockPaste" />
          Desbloquear colagem (simula digitação)
        </label>
        <small style="font-size: 10px; opacity: 0.8;">
          ! Ao colar, todo o texto anterior será <span style="color: red; text-shadow: 0 0 2px red, 0 0 4px red;">limpado.</span>
        </small>
        <label for="darkModeCheck" style="margin-top: 12px;">
          <input type="checkbox" id="darkModeCheck" />
          Ativar Modo Escuro
        </label>
        <a id="authorLink" href="https://github.com/peagakkk" target="_blank" rel="noopener noreferrer">@autor</a>
      </div>
      <div id="footer">
        <span>© 2025</span>
      </div>
    `;
    document.body.appendChild(menu);
    let dragging = false, offsetX = 0, offsetY = 0;
    function dragStart(e) {
      dragging = true;
      offsetX = e.type.startsWith("touch") ? e.touches[0].clientX - menu.offsetLeft : e.clientX - menu.offsetLeft;
      offsetY = e.type.startsWith("touch") ? e.touches[0].clientY - menu.offsetTop : e.clientY - menu.offsetTop;
      e.preventDefault();
    }
    function dragEnd() { dragging = false; }
    function dragMove(e) {
      if (!dragging) return;
      const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
      menu.style.left = (clientX - offsetX) + "px";
      menu.style.top = (clientY - offsetY) + "px";
    }
    menu.querySelector("#topbar").addEventListener("mousedown", dragStart);
    menu.querySelector("#topbar").addEventListener("touchstart", dragStart, { passive: false });
    menu.querySelector("#footer").addEventListener("mousedown", dragStart);
    menu.querySelector("#footer").addEventListener("touchstart", dragStart, { passive: false });
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchend", dragEnd);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("touchmove", dragMove, { passive: false });
    menu.querySelector("#topbarCloseBtn").onclick = () => {
      menu.style.display = "none";
      showBtn.style.display = "block";
    };
    const showBtn = document.createElement("button");
    showBtn.id = "showAllowPasteMenuBtn";
    showBtn.textContent = "Mostrar Menu";
    showBtn.style.cssText = `
      position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
      z-index: 999999999; padding: 8px 16px; border-radius: 10px; border: 3px solid #fff;
      background: rgb(255, 0, 0); color: #faf7f8; font-family: 'Roboto Mono', monospace;
      cursor: pointer; user-select: none;
    `;
    document.body.appendChild(showBtn);
    showBtn.onclick = () => {
      menu.style.display = "flex";
      showBtn.style.display = "none";
    };
    return menu;
  }
  function setupPasteUnlock(menu) {
    let pasteEnabled = false;
    const inputs = () => Array.from(document.querySelectorAll("textarea, input[type='text'][maxlength]"));
    function pasteHandler(e) {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text");
      pasteCleanText(e.target, text);
    }
    const checkbox = menu.querySelector("#unlockPaste");
    checkbox.addEventListener("change", () => {
      const fields = inputs();
      if (fields.length === 0) {
        checkbox.checked = false;
        sendToast("❌ Nenhum campo de entrada encontrado.", "error");
        return;
      }
      if (checkbox.checked && !pasteEnabled) {
        for (const el of fields) {
          el.addEventListener("paste", pasteHandler);
          el.oncontextmenu = null;
          el.removeAttribute("oncontextmenu");
          el.addEventListener("contextmenu", e => e.stopPropagation(), true);
        }
        pasteEnabled = true;
        sendToast("✅ Agora você pode colar com Ctrl+V normalmente!", "info");
      } else if (!checkbox.checked && pasteEnabled) {
        for (const el of fields) {
          el.removeEventListener("paste", pasteHandler);
          el.oncontextmenu = null;
          el.removeAttribute("oncontextmenu");
        }
        pasteEnabled = false;
        sendToast("❌ Colagem desativada.", "error");
      }
    });
  }
  async function setupDarkModeToggle(menu) {
    const checkbox = menu.querySelector("#darkModeCheck");
    try {
      await loadDarkReader();
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        checkbox.checked = true;
        DarkReader.enable();
      }
      checkbox.onchange = () => {
        if (checkbox.checked) {
          DarkReader.enable();
          sendToast("🌑 Dark Mode Ativado", 2000);
        } else {
          DarkReader.disable();
          sendToast("☀️ Dark Mode Desativado", 2000);
        }
      };
    } catch (err) {
      sendToast("⚠️ Não foi possível carregar Dark Mode", 3000);
      console.error(err);
    }
  }
  function loadFont() {
    if (!document.getElementById("Roboto-Mono")) {
      const link = document.createElement("link");
      link.id = "Roboto-Mono";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Roboto+Mono";
      document.head.appendChild(link);
    }
  }
  loadFont();
  const menu = createMenu();
  setupPasteUnlock(menu);
  setupDarkModeToggle(menu);
})();
