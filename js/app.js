const form = document.getElementById("lyric-form");
const loader = document.getElementById("loader");
const output = document.getElementById("lyric-output");
const historyList = document.getElementById("history-list");
const historyCount = document.getElementById("history-count");
const toast = document.getElementById("toast");
const copyBtn = document.getElementById("copy-btn");
const downloadBtn = document.getElementById("download-btn");
const clearHistoryBtn = document.getElementById("clear-history");

let currentLyric = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2600);
}

function setLoading(isLoading) {
  if (isLoading) {
    loader.classList.remove("hidden");
  } else {
    loader.classList.add("hidden");
  }
}

function formatLyric(lyric) {
  if (!lyric) return "";
  const blocks = lyric.blocks
    .map(
      (block) =>
        `<div class="mb-4"><span class="section-tag">${block.title}</span><p>${block.text.replace(
          /\n/g,
          "<br />"
        )}</p></div>`
    )
    .join("");
  return `
    <div class="text-xs text-slate-400 mb-4">${lyric.intro}</div>
    <div class="text-white">${blocks}</div>
  `;
}

function renderLyric(lyric) {
  if (!lyric) {
    output.innerHTML =
      '<p class="text-slate-400">Nenhuma letra gerada ainda. Preencha o formulário e clique em Gerar.</p>';
    return;
  }
  output.innerHTML = formatLyric(lyric);
}

function renderHistory(items) {
  historyCount.textContent = `${items.length} itens`;
  historyList.innerHTML = "";

  if (!items.length) {
    historyList.innerHTML = '<p class="text-sm text-slate-400">Sem histórico ainda.</p>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
      <button class="text-left">
        <p class="text-sm font-semibold text-white">${item.title}</p>
        <p class="text-xs text-slate-400">${item.meta}</p>
      </button>
      <div class="history-actions">
        <button data-action="favorite" data-id="${item.id}" class="${item.favorite ? "active" : ""}">★ Favoritar</button>
        <button data-action="load" data-id="${item.id}">⟳ Carregar</button>
        <button data-action="delete" data-id="${item.id}">✕ Excluir</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => loadFromHistory(item.id));
    historyList.appendChild(card);
  });
}

function getFormData() {
  const formData = new FormData(form);
  return {
    theme: formData.get("theme").trim(),
    genre: formData.get("genre"),
    mood: formData.get("mood"),
    keywords: formData.get("keywords").trim(),
    notes: formData.get("notes").trim(),
  };
}

async function handleSubmit(event) {
  event.preventDefault();
  const payload = getFormData();

  if (!payload.theme) {
    showToast("Informe o tema da música.");
    return;
  }

  setLoading(true);
  const lyric = await AiEngine.generate(payload);
  setLoading(false);

  currentLyric = lyric;
  renderLyric(lyric);

  const historyItem = addHistoryItem({
    title: lyric.title,
    meta: `${payload.genre} · ${payload.mood}`,
    lyric,
    payload,
  });

  renderHistory(loadHistory());
  showToast("Letra criada e salva no histórico!");

  return historyItem;
}

function loadFromHistory(id) {
  const items = loadHistory();
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  currentLyric = item.lyric;
  renderLyric(item.lyric);
  showToast("Letra carregada do histórico.");
}

function handleHistoryAction(event) {
  const target = event.target.closest("button");
  if (!target) return;
  const { action, id } = target.dataset;
  if (!action || !id) return;

  if (action === "favorite") {
    const items = updateHistoryItem(id, { favorite: !target.classList.contains("active") });
    renderHistory(items);
    showToast("Favorito atualizado.");
  }

  if (action === "delete") {
    const items = removeHistoryItem(id);
    renderHistory(items);
    showToast("Item removido.");
  }

  if (action === "load") {
    loadFromHistory(id);
  }
}

function copyLyric() {
  if (!currentLyric) {
    showToast("Nenhuma letra para copiar.");
    return;
  }
  const text = formatPlainText(currentLyric);
  navigator.clipboard.writeText(text).then(() => showToast("Letra copiada!"));
}

function downloadLyric() {
  if (!currentLyric) {
    showToast("Nenhuma letra para baixar.");
    return;
  }
  const text = formatPlainText(currentLyric);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${currentLyric.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  showToast("Download iniciado.");
}

function formatPlainText(lyric) {
  const blocks = lyric.blocks
    .map((block) => `[${block.title}]\n${block.text}`)
    .join("\n\n");
  return `${lyric.title}\n${lyric.intro}\n\n${blocks}`;
}

function initHistory() {
  const items = loadHistory();
  renderHistory(items);
}

form.addEventListener("submit", handleSubmit);
copyBtn.addEventListener("click", copyLyric);
downloadBtn.addEventListener("click", downloadLyric);
historyList.addEventListener("click", handleHistoryAction);
clearHistoryBtn.addEventListener("click", () => {
  clearHistory();
  renderHistory([]);
  showToast("Histórico limpo.");
});

initHistory();
