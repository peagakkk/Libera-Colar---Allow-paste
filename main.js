function () {
    // Cria a interface da extensão
    const uiContainer = document.createElement("div");
    uiContainer.style.position = "fixed";
    uiContainer.style.top = "10px";
    uiContainer.style.left = "10px";
    uiContainer.style.zIndex = 99999;
    uiContainer.style.background = "#111";
    uiContainer.style.color = "#fff";
    uiContainer.style.padding = "10px";
    uiContainer.style.borderRadius = "8px";
    uiContainer.style.fontFamily = "Arial, sans-serif";
    uiContainer.style.boxShadow = "0 4px 10px rgba(0,0,0,0.5)";
    uiContainer.style.userSelect = "none";

    // Cabeçalho
    const header = document.createElement("div");
    header.textContent = "Permitir Colagem - Versão 24/05/2025";
    header.style.fontWeight = "bold";
    header.style.marginBottom = "5px";

    // Botão de fechar
    const closeButton = document.createElement("span");
    closeButton.textContent = "×";
    closeButton.title = "Fechar";
    closeButton.style.float = "right";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = () => document.body.removeChild(uiContainer);
    header.appendChild(closeButton);
    uiContainer.appendChild(header);

    // Checkbox para ativar ou desativar o desbloqueio
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "enablePaste";

    const label = document.createElement("label");
    label.htmlFor = "enablePaste";
    label.textContent = " Desbloquear colagem (1ms)";
    label.style.cursor = "pointer";

    uiContainer.appendChild(checkbox);
    uiContainer.appendChild(label);
    document.body.appendChild(uiContainer);

    // Variável de controle do loop
    let pasteInterval = null;

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            pasteInterval = setInterval(async () => {
                const inputField = document.querySelector("input:focus, textarea:focus");
                if (inputField) {
                    try {
                        const clipboardText = await navigator.clipboard.readText();
                        // Simula a digitação do texto da área de transferência
                        for (const char of clipboardText) {
                            const event = new InputEvent("input", { bubbles: true });
                            inputField.value += char;
                            inputField.dispatchEvent(event);
                        }
                        console.log("✅ Colagem desbloqueada!");
                    } catch (error) {
                        console.error("❌ Erro ao acessar a área de transferência:", error);
                    }
                } else {
                    console.warn("❌ Nenhum campo de entrada focado.");
                }
            }, 1); // Intervalo de 1ms
        } else {
            clearInterval(pasteInterval);
            console.log("❌ Colagem desativada.");
        }
    });

    // Permite arrastar a interface com o mouse
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - uiContainer.offsetLeft;
        offsetY = e.clientY - uiContainer.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            uiContainer.style.left = ${e.clientX - offsetX}px;
            uiContainer.style.top = ${e.clientY - offsetY}px;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
})();
