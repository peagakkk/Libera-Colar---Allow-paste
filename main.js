javascript:(() => {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes rgb-glow {
      0%, 100% { border-color: #f00; box-shadow: 0 0 5px #f00; color: #f00; }
      33% { border-color: #0f0; box-shadow: 0 0 5px #0f0; color: #0f0; }
      66% { border-color: #00f; box-shadow: 0 0 5px #00f; color: #00f; }
    }
    .allow-paste-container {
      position: fixed;
      top: 30px;
      left: 30px;
      padding: 12px 18px;
      background-color: #111;
      color: white;
      border: 2px solid #444;
      z-index: 9999999;
      font-family: monospace;
      font-size: 13px;
      border-radius: 6px;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      cursor: move;
      user-select: none;
      max-width: 90%;
      min-width: 180px;
    }
    .allow-paste-container h2 {
      margin: 0 0 10px 0;
      font-size: 16px;
      pointer-events: none;
    }
    .allow-paste-checkbox {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #aaa;
      border-radius: 4px;
      vertical-align: middle;
      margin-right: 8px;
      cursor: pointer;
      animation: rgb-glow 3s infinite;
    }
    .allow-paste-checkbox.checked {
      background-color: lime;
    }
    .toast {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 10px 20px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 14px;
      z-index: 10000000;
      opacity: 0;
      animation: fadeInOut 3s ease-in-out;
    }
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
      10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
    .ig-link {
      margin-top: 12px;
      font-size: 13px;
      color: #ccc;
      text-align: center;
      cursor: pointer;
      text-decoration: underline;
      animation: rgb-glow 3s infinite;
      user-select: none;
    }
    .ig-link:hover {
      color: #fff;
    }
    .close-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      color: #ccc;
      font-weight: bold;
      font-size: 18px;
      cursor: pointer;
      user-select: none;
      padding: 0 6px;
      line-height: 1;
      border-radius: 4px;
      transition: color 0.3s ease;
    }
    .close-btn:hover {
      color: #fff;
      background-color: #444;
    }
    .show-menu-btn {
      position: fixed;
      top: 30px;
      left: 30px;
      background-color: #111;
      color: #ccc;
      font-family: monospace;
      font-size: 16px;
      padding: 8px 12px;
      border: 2px solid #444;
      border-radius: 6px;
      box-shadow: 0 0 8px rgba(0,0,0,0.5);
      cursor: pointer;
      z-index: 99999999;
      user-select: none;
      display: none;
      transition: background-color 0.3s ease;
    }
    .show-menu-btn:hover {
      background-color: #222;
      color: white;
    }
  `;
  document.head.appendChild(style);

  // Container principal do menu
  const container = document.createElement("div");
  container.className = "allow-paste-container";
  container.innerHTML = `
    <div class="close-btn" id="closeBtn" title="Fechar menu">✖</div>
    <h2>Allow Paste</h2>
    <div class="allow-paste-checkbox" id="allowPasteCheckbox"></div>
    <label for="allowPasteCheckbox">Ativar Colar</label>
    <div class="ig-link" id="igLink">@peagakkjk</div>
  `;
  document.body.appendChild(container);

  // Botão para mostrar menu depois de fechado
  const showMenuBtn = document.createElement("div");
  showMenuBtn.className = "show-menu-btn";
  showMenuBtn.textContent = "Mostrar Menu";
  document.body.appendChild(showMenuBtn);

  // Abrir Instagram
  document.getElementById("igLink").onclick = () => {
    window.open("https://instagram.com/peagakkjk", "_blank");
  };

  // Fechar menu
  const closeBtn = document.getElementById("closeBtn");
  closeBtn.onclick = () => {
    container.style.display = "none";
    showMenuBtn.style.display = "block";
  };

  // Mostrar menu
  showMenuBtn.onclick = () => {
    container.style.display = "block";
    showMenuBtn.style.display = "none";
  };

  // Dragging (mouse + touch)
  (() => {
    let isDragging = false;
    let startX = 0, startY = 0, origX = 0, origY = 0;
    const startDrag = (x, y) => {
      isDragging = true;
      const rect = container.getBoundingClientRect();
      startX = x;
      startY = y;
      origX = rect.left;
      origY = rect.top;
    };
    const moveDrag = (x, y) => {
      if (!isDragging) return;
      container.style.left = `${origX + x - startX}px`;
      container.style.top = `${origY + y - startY}px`;
      container.style.right = "auto";
    };
    const stopDrag = () => isDragging = false;

    container.addEventListener("mousedown", e => {
      if (e.target.tagName === "INPUT" || e.target.className.includes("ig-link") || e.target.className.includes("close-btn")) return;
      startDrag(e.clientX, e.clientY);
    });
    document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
    document.addEventListener("mouseup", stopDrag);

    container.addEventListener("touchstart", e => {
      if (e.target.tagName === "INPUT" || e.target.className.includes("ig-link") || e.target.className.includes("close-btn")) return;
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    document.addEventListener("touchmove", e => moveDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: false });
    document.addEventListener("touchend", stopDrag);
    document.addEventListener("touchcancel", stopDrag);
  })();

  // Toast de mensagem
  const showToast = msg => {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Função para ativar "colar"
  const allowPaste = () => {
    try {
      const inputs = [...document.querySelectorAll("input"), ...document.querySelectorAll("textarea")];
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
            input.setRangeText(char, start, end, 'end');
            const event = new InputEvent("input", {
              bubbles: true,
              cancelable: true,
              data: char,
              inputType: "insertText"
            });
            input.dispatchEvent(event);
          }, 1);
        };
        input.onbeforepaste = null;
      });
      showToast("Colar ativado!");
    } catch (err) {
      console.error("Paste Error:", err);
      showToast("Erro ao ativar colar.");
    }
  };

  const checkbox = document.getElementById("allowPasteCheckbox");
  checkbox.addEventListener("click", () => {
    checkbox.classList.toggle("checked");
    checkbox.classList.contains("checked") ? allowPaste() : showToast("Colar desativado.");
  });
})();
