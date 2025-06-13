javascript:(() => {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes rgb-glow {
      0%, 100% { border-color: #f00; box-shadow: 0 0 5px #f00; }
      33% { border-color: #0f0; box-shadow: 0 0 5px #0f0; }
      66% { border-color: #00f; box-shadow: 0 0 5px #00f; }
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
    }`;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.className = "allow-paste-container";
  container.innerHTML = `<h2>Allow Paste – Corrigido</h2><div class="allow-paste-checkbox" id="allowPasteCheckbox"></div><label for="allowPasteCheckbox">Enable Paste</label>`;
  document.body.appendChild(container);

  // DRAG FIX
  (() => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let origX = 0, origY = 0;

    container.addEventListener("mousedown", e => {
      if (e.target.closest("input") || e.target.tagName === "LABEL") return; // não interfere com inputs
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = container.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      container.style.left = `${origX + dx}px`;
      container.style.top = `${origY + dy}px`;
      container.style.right = "auto"; // impede conflito com posição inicial
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  })();

  const showToast = msg => {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

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
          }, 1); // 1ms por caractere
        };
        input.onbeforepaste = null;
      });
      showToast("Paste corrigido e ativado!");
    } catch (err) {
      console.error("Paste Error:", err);
      showToast("Erro ao corrigir paste.");
    }
  };

  const checkbox = document.getElementById("allowPasteCheckbox");
  checkbox.addEventListener("click", () => {
    checkbox.classList.toggle("checked");
    checkbox.classList.contains("checked") ? allowPaste() : showToast("Paste desativado!");
  });
})();
