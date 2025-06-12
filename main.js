javascript:(function() {
    const c = document.createElement("div");
    c.style = "position:fixed;top:10px;left:10px;z-index:99999;background:#222;color:#fff;padding:15px;border-radius:10px;font-family:sans-serif;font-size:16px;max-width:90vw;box-shadow:0 4px 10px rgba(0,0,0,0.5);user-select:none;";

    const h = document.createElement("div");
    h.textContent = "🟢 Colagem Ativável";
     h.textContent = "@peagakkjk";
    h.style = "font-weight:bold;margin-bottom:8px;cursor:move;";

    const x = document.createElement("span");
    x.textContent = "✖";
    x.style = "float:right;cursor:pointer;";
    x.onclick = () => document.body.removeChild(c);
    h.appendChild(x);
    c.appendChild(h);

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "enablePaste";

    const l = document.createElement("label");
    l.htmlFor = "enablePaste";
    l.textContent = " Desbloquear colagem";
    l.style = "margin-left:8px;cursor:pointer;";
    c.appendChild(cb);
    c.appendChild(l);
    document.body.appendChild(c);

    let i = null;
    cb.addEventListener("change", () => {
        if (cb.checked) {
            i = setInterval(async () => {
                const f = document.activeElement;
                if (f && (f.tagName === "INPUT" || f.tagName === "textarea")) {
                    try {
                        const t = await navigator.clipboard.readText();
                        for (const ch of t) {
                            const e = new InputEvent("input", { bubbles: true });
                            f.value += ch;
                            f.dispatchEvent(e);
                        }
                        console.log("✅ Texto colado!");
                    } catch (e) {
                        alert("⚠️ Sem permissão para acessar a área de transferência.");
                        cb.checked = false;
                        clearInterval(i);
                    }
                }
            }, 1);
        } else {
            clearInterval(i);
            console.log("❌ Colagem desativada.");
        }
    });

    let d = false, sX, sY;
    h.addEventListener("touchstart", e => {
        d = true;
        sX = e.touches[0].clientX - c.offsetLeft;
        sY = e.touches[0].clientY - c.offsetTop;
    });

    document.addEventListener("touchmove", e => {
        if (d) {
            c.style.left = ${e.touches[0].clientX - sX}px;
            c.style.top = ${e.touches[0].clientY - sY}px;
        }
    });

    document.addEventListener("touchend", () => {
        d = false;
    });
})();
