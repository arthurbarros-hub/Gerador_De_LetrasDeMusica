const STORAGE_KEY = "lyricai.history";

function loadHistory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Falha ao carregar histórico", error);
    return [];
  }
}

function saveHistory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function createHistoryItem(payload) {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    favorite: false,
    ...payload,
  };
}

function addHistoryItem(payload) {
  const items = loadHistory();
  const item = createHistoryItem(payload);
  items.unshift(item);
  saveHistory(items);
  return item;
}

function updateHistoryItem(id, updates) {
  const items = loadHistory();
  const nextItems = items.map((item) => (item.id === id ? { ...item, ...updates } : item));
  saveHistory(nextItems);
  return nextItems;
}

function removeHistoryItem(id) {
  const items = loadHistory();
  const nextItems = items.filter((item) => item.id !== id);
  saveHistory(nextItems);
  return nextItems;
}

function clearHistory() {
  saveHistory([]);
  return [];
}
