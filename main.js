(() => {
  // Importa DarkReader se não estiver presente
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

  // Cria toast simples
  function sendToast(msg, duration = 3000) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0,0,0,0.75);
      color: #fff;
      padding: 10px 20px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 14px;
      z-index: 99999999;
      opacity: 1;
      transition: opacity 0.5s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, duration);
  }

  // Cria o menu com toggle de Dark Mode
  function createMenu() {
    // Adiciona estilo básico
    const style = document.createElement("style");
    style.textContent = `
      #myMenu {
        position: fixed;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: #121212;
        color: white;
        font-family: monospace;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 0 15px #ff3cac;
        z-index: 99999999;
        user-select: none;
        width: 280px;
      }
      #myMenu label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-weight: 600;
      }
      #myMenu input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
        border-radius: 4px;
        border: 2px solid #ff3cac;
        appearance: none;
        background-color: #222;
        position: relative;
        transition: background-color 0.3s ease;
      }
      #myMenu input[type="checkbox"]:checked {
        background-color: #ff3cac;
      }
      #myMenu input[type="checkbox"]:checked::after {
        content: "✔";
        color: white;
        position: absolute;
        top: 1px;
        left: 4px;
        font-size: 16px;
      }
      #myMenu #closeBtn {
        position: absolute;
        top: 8px;
        right: 12px;
        cursor: pointer;
        font-weight: 700;
        font-size: 20px;
        color: #ff3cac;
        user-select: none;
      }
      #myMenu #closeBtn:hover {
        color: #ff71b8;
      }
    `;
    document.head.appendChild(style);

    // Cria container menu
    const menu = document.createElement("div");
    menu.id = "myMenu";
    menu.innerHTML = `
      <div id="closeBtn" title="Fechar Menu">×</div>
      <label for="darkModeCheck">
        <input type="checkbox" id="darkModeCheck" />
        Ativar Modo Escuro
      </label>
    `;
    document.body.appendChild(menu);

    // Fecha menu
    document.getElementById("closeBtn").onclick = () => {
      menu.style.display = "none";
      showBtn.style.display = "block";
    };

    // Botão para abrir menu depois de fechar
    const showBtn = document.createElement("button");
    showBtn.textContent = "Mostrar Menu";
    showBtn.style.cssText = `
      position: fixed;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999999;
      padding: 8px 16px;
      border-radius: 10px;
      border: 2px solid #ff3cac;
      background: #121212;
      color: #ff3cac;
      font-family: monospace;
      cursor: pointer;
      user-select: none;
      display: none;
    `;
    document.body.appendChild(showBtn);
    showBtn.onclick = () => {
      menu.style.display = "block";
      showBtn.style.display = "none";
    };

    return menu;
  }

  // Função para ativar/desativar dark mode via DarkReader
  async function setupDarkModeToggle() {
    try {
      await loadDarkReader();
      let darkModeActive = false;
      const checkbox = document.getElementById("darkModeCheck");

      // Ativar dark mode se preferir inicial
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        checkbox.checked = true;
        DarkReader.enable();
        darkModeActive = true;
      }

      checkbox.onchange = () => {
        darkModeActive = checkbox.checked;
        if (darkModeActive) {
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

  // Cria menu e configura toggle
  const menu = createMenu();
  setupDarkModeToggle();
})();
