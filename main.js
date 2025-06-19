javascript:(() => {
  // Fonte Roboto Mono
  if (!document.getElementById("Roboto-Mono")) {
    const link = document.createElement("link");
    link.id = "Roboto-Mono";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap";
    document.head.appendChild(link);
  }

  // CSS Styles
  const style = document.createElement("style");
  style.id = "allowPasteStyle";
  style.textContent = `
    @keyframes fadeIn {
      from {opacity: 0; transform: translateY(-10px);}
      to {opacity: 1; transform: translateY(0);}
    }
    @keyframes fadeOut {
      from {opacity: 1; transform: translateY(0);}
      to {opacity: 0; transform: translateY(-10px);}
    }
    @keyframes glowFade {
      0%, 100% {
        box-shadow: 0 0 8px rgba(255, 60, 172, 0.6);
        border-color: rgba(255, 60, 172, 0.6);
      }
      50% {
        box-shadow: 0 0 8px rgba(0, 255, 247, 0.6);
        border-color: rgba(0, 255, 247, 0.6);
      }
    }
    #allowPasteContainer {
      position: fixed;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      width: 320px;
      background-color: #121212;
      color: #eee;
      font-family: 'Roboto Mono', monospace;
      border-radius: 12px;
      border: 2px solid rgba(255, 60, 172, 0.6);
      box-shadow: 0 0 8px rgba(255, 60, 172, 0.6);
      user-select: none;
      z-index: 99999999;
      display: flex;
      flex-direction: column;
      animation: glowFade 4s infinite alternate;
    }
    #allowPasteContainer.light {
      background-color: #eee;
      color: #222;
      border-color: rgba(255, 60, 172, 0.3);
      box-shadow: 0 0 8px rgba(255, 60, 172, 0.3);
      animation: none;
    }
    #allowPasteTopBar {
      background: linear-gradient(90deg, #1b1b1b, #2c2c2c);
      border-radius: 12px 12px 0 0;
      padding: 10px 16px;
      font-size: 16px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
    }
    #allowPasteTopBar.light {
      background: linear-gradient(90deg, #ddd, #ccc);
      color: #111;
    }
    #allowPasteCloseBtn, #allowPasteToggleThemeBtn {
      background: transparent;
      border: none;
      color: inherit;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      user-select: none;
      margin-left: 8px;
      padding: 0;
    }
    #allowPasteContent {
      padding: 20px 16px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
    }
    label {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
    }
    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      border-radius: 4px;
      border: 2px solid rgba(255, 60, 172, 0.6);
      background: transparent;
      position: relative;
      transition: all 0.3s ease;
      box-shadow: 0 0 6px rgba(255, 60, 172, 0.4);
      appearance: none;
    }
    input[type="checkbox"]:checked {
      background: rgba(255, 60, 172, 0.8);
      box-shadow: 0 0 12px rgba(255, 60, 172, 0.8);
    }
    input[type="checkbox"]:checked::after {
      content: "✔";
      color: white;
      position: absolute;
      top: 1px;
      left: 4px;
      font-size: 16px;
      font-weight: 700;
      user-select: none;
    }
    #toastContainer {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100000000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-family: 'Roboto Mono', monospace;
    }
    .toast {
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      min-width: 280px;
      max-width: 320px;
      font-size: 14px;
      box-shadow: 0 0 10px rgba(0,0,0,0.4);
      animation: fadeIn 0.3s ease forwards, fadeOut 0.3s ease 2.7s forwards;
    }
    .toast.success {
      background-color: #00FA9A;
      box-shadow: 0 0 10px #00FA9A99;
    }
    .toast.error {
      background-color: #b92e2e;
      box-shadow: 0 0 10px #b92e2e99;
    }
    .toast.info {
      background-color: #00BFFF;
      box-shadow: 0 0 10px #00BFFF99;
    }
  `;

  if (!document.getElementById("allowPasteStyle")) document.head.appendChild(style);

  // Container
  let container = document.getElementById("allowPasteContainer");
  if (container) {
    container.style.display = "flex";
    return; // evita múltiplos
  }

  container = document.createElement("div");
  container.id = "allowPasteContainer";
  container.classList.add("dark"); // começa no modo escuro

  container.innerHTML = `
    <div id="allowPasteTopBar" class="dark">
      <div>Ativar Colar</div>
      <div>
        <button id="allowPasteToggleThemeBtn" title="Alternar modo claro/escuro">🌓</button>
        <button id="allowPasteCloseBtn" title="Fechar menu">×</button>
      </div>
    </div>
    <div id="allowPasteContent">
      <label><input type="checkbox" id="allowPasteCheckbox"> Permitir colar (1ms)</label>
      <small style="opacity:0.6; font-size:12px; text-align:center;">
        Ao colar, o texto anterior será <strong style="color:#f55;">limpado</strong>.
      </small>
    </div>
  `;

  document.body.appendChild(container);

  // Toast container
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    document.body.appendChild(toastContainer);
  }

  // Função Toast
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Função para permitir colar com delay de 1ms entre caracteres
  function enablePaste() {
    const inputs = [...document.querySelectorAll("input[type=text], textarea")];
    inputs.forEach(input => {
      input.onpaste = e => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const txt = (e.clipboardData || window.clipboardData).getData("text");
        if (!txt) return;
        input.focus();
        let i = 0;
        const interval = setInterval(() => {
          if (i >= txt.length) return clearInterval(interval);
          const char = txt[i++];
          const start = input.selectionStart;
          const end = input.selectionEnd;
          input.setRangeText(char, start, end, "end");
          const event = new InputEvent("input", {
            bubbles: true,
            cancelable: true,
            data: char,
            inputType: "insertText",
          });
          input.dispatchEvent(event);
        }, 1);
      };
    });
    showToast("Colar ativado!", "success");
  }

  // Função para desabilitar
  function disablePaste() {
    const inputs = [...document.querySelectorAll("input[type=text], textarea")];
    inputs.forEach(input => {
      input.onpaste = null;
    });
    showToast("Colar desativado.", "error");
  }

  // Checkbox toggle
  const checkbox = container.querySelector("#allowPasteCheckbox");
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) enablePaste();
    else disablePaste();
  });

  // Toggle dark/light mode
  const toggleThemeBtn = container.querySelector("#allowPasteToggleThemeBtn");
  toggleThemeBtn.onclick = () => {
    const isDark = container.classList.toggle("light");
    container.classList.toggle("dark", !isDark);

    const topBar = container.querySelector("#allowPasteTopBar");
    topBar.classList.toggle("light", isDark);
    topBar.classList.toggle("dark", !isDark);
  };

  // Close menu
  const closeBtn = container.querySelector("#allowPasteCloseBtn");
  closeBtn.onclick = () => {
    container.style.display = "none";
    showToast("Menu fechado. Reabra com este bookmarklet.", "info");
  };

  // Drag functionality
  let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
  const topBar = container.querySelector("#allowPasteTopBar");

  topBar.addEventListener("mousedown", e => {
    isDragging = true;
    dragOffsetX = e.clientX - container.offsetLeft;
    dragOffsetY = e.clientY - container.offsetTop;
    e.preventDefault();
  });
  document.addEventListener("mouseup", () => isDragging = false);
  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    container.style.left = (e.clientX - dragOffsetX) + "px";
    container.style.top = (e.clientY - dragOffsetY) + "px";
    container.style.transform = "none";
  });

  showToast("Menu carregado! Ative o colar.", "info");
})();
