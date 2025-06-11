function unlockPasteScript() {
  // Função para exibir notificações (toasts) na tela
  function showToast(message, type = 'default') {
    let backgroundColor = '#4CAF50'; // Verde para sucesso
    if (type === 'error') {
      backgroundColor = '#F44336'; // Vermelho para erro
    }

    const toastId = Math.random().toString(36).substring(2, 15); // ID único para o toast

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: ${backgroundColor};
      color: white;
      padding: 16px;
      border-radius: 4px;
      z-index: 10000;
      font-family: sans-serif;
      animation: toastFadeIn 0.5s, toastFadeOut 0.5s 2.5s;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove o toast após a animação
    toast.addEventListener('animationend', (event) => {
      if (event.animationName === 'toastFadeOut') {
        document.getElementById(toastId).remove();
      }
    });

    // Estilos de animação (adicionados ao head)
    const style = document.createElement('style');
    style.textContent = `
      @keyframes toastFadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes toastFadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
  }

  // Função para injetar um link de fonte do Google Fonts no <head>
  function injectGoogleFont() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap';
    document.head.appendChild(link);
  }

  // Função principal para desbloquear a funcionalidade de colar
  function unlockPaste() {
    // Cria um elemento div para conter a interface de desbloqueio
    const unlockDiv = document.createElement('div');
    unlockDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-family: 'Poppins', sans-serif;
    `;
    unlockDiv.innerHTML = `
      <div id="topbar" style="background: #121212; height: 42px; border-bottom: 1px solid #333; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; font-weight: 600; font-size: 16px; user-select: none; border-radius: 9px 9px 0 0; cursor: move;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span>Allow Paste - Build 24/05/2025</span>
        </div>
        <button id="topbarCloseBtn" title="Fechar" style="background: #e03e3e; border: none; border-radius: 3px; width: 28px; height: 28px; color: white; font-weight: 700; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none; transition: background-color 0.25s ease;">×</button>
      </div>
      <div id="content" style="flex-grow: 1; padding: 20px 24px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; font-size: 15px; user-select: none;">
        <label for="unlockPaste" style="display:flex; align-items:center; gap:12px; flex-grow: 1; color: white !important; animation: none !important; text-shadow: none !important; cursor: pointer;">
          <input type="checkbox" id="unlockPaste">
          Desbloquear colagem (1ms)
        </label>
      </div>
      <div id="footer" style="background: #121212; height: 32px; border-top: 1px solid #333; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 400; border-radius: 0 0 9px 9px; user-select: none; gap: 4px; cursor: move;">
        <span>© 2025</span>
        <a href="https://instagram.com/peagakkjk" target="_blank" style="text-decoration: underline; animation: rgbGlow 5s linear infinite;">
          GitHub-peagakkk
        </a>
        <span>- All rights reserved.</span>
      </div>
    `;
    document.body.appendChild(unlockDiv);

    // Torna a interface arrastável
    let isDragging = false;
    let offsetX, offsetY;

    const topbar = unlockDiv.querySelector('#topbar');
    const footer = unlockDiv.querySelector('#footer');

    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - unlockDiv.offsetLeft;
        offsetY = e.clientY - unlockDiv.offsetTop;
    }

    topbar.addEventListener('mousedown', startDrag);
    footer.addEventListener('mousedown', startDrag);

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        unlockDiv.style.left = e.clientX - offsetX + 'px';
        unlockDiv.style.top = e.clientY - offsetY + 'px';
    });

    // Adiciona um evento de clique ao botão de fechar para remover a interface
    unlockDiv.querySelector('#topbarCloseBtn').onclick = () => unlockDiv.remove();

    let pasteUnlocked = false;

    // Adiciona um evento de mudança à checkbox para habilitar/desabilitar a colagem
    unlockDiv.querySelector('#unlockPaste').addEventListener('change', function() {
      const inputFields = [...document.querySelectorAll('textarea'), ...document.querySelectorAll('input[type=\'text\'][maxlength]')];

      if (inputFields.length === 0) {
        return showToast('❌ Nenhum campo de entrada encontrado.', 'error');
      }

      if (this.checked && !pasteUnlocked) {
        // Se a checkbox está marcada e a colagem ainda não foi desbloqueada
        for (const inputField of inputFields) {
          inputField.addEventListener('paste', overridePaste);
        }
        pasteUnlocked = true;
        showToast('✅ Agora você pode colar com Ctrl+V normalmente!@peagakkjk');
      } else {
        // Se a checkbox está desmarcada e a colagem foi desbloqueada
        for (const inputField of inputFields) {
          inputField.removeEventListener('paste', overridePaste);
        }
        pasteUnlocked = false;
        showToast('❌ Colagem desativada.', 'error');
      }
    });

    // Função para sobrescrever o comportamento padrão de colar
    function overridePaste(event) {
      event.preventDefault();
      const text = (event.clipboardData || window.clipboardData).getData('text');
      pasteText(event.target, text);
    }

    // Função para colar o texto no campo de entrada
    function pasteText(element, text) {
      element.focus();
      document.execCommand('insertText', false, text);
      showToast('✅ Texto Colado.');
    }
  }

  // Injeta a fonte Poppins
  injectGoogleFont();

  // Inicia a funcionalidade de desbloqueio de colagem
  unlockPaste();
}

// Para executar o script, chame a função:
unlockPasteScript();
