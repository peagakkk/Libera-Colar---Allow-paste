(function() {
  // Função para exibir notificações (toasts) na tela
  function showToast(message, type = 'default') {
    // ... (código para criar e exibir a notificação) ...
  }

  // Função para injetar um link de fonte do Google Fonts no <head>
  function injectGoogleFont() {
    // ... (código para injetar a fonte Poppins) ...
  }

  // Função principal para desbloquear a funcionalidade de colar
  function unlockPaste() {
    // Cria um elemento div para conter a interface de desbloqueio
    const unlockDiv = document.createElement('div');
    unlockDiv.style.cssText = `
      /* Estilos para posicionamento e aparência do div */
    `;
    unlockDiv.innerHTML = `
      <!-- HTML para a interface de desbloqueio (barra superior, checkbox, rodapé) -->
    `;
    document.body.appendChild(unlockDiv);

    // ... (código para tornar a interface arrastável) ...

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
})();
