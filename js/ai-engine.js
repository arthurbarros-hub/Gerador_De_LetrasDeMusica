const AiEngine = (() => {
  const sections = ["Verso 1", "Pré-Refrão", "Refrão", "Verso 2", "Ponte", "Refrão Final"];

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function buildLine(theme, mood, keywords, tone, index) {
    const moodMap = {
      Energético: ["faísca", "tempestade", "pulso", "pressa"],
      Melancólico: ["neblina", "silêncio", "memória", "eco"],
      Triste: ["cinza", "saudade", "sombra", "vento"],
      Romântico: ["constelação", "abrigo", "promessa", "beijo"],
      Inspirador: ["aurora", "fôlego", "voo", "destino"],
      Contemplativo: ["mar", "instante", "reflexo", "horizonte"],
    };
    const moodWords = moodMap[mood] || moodMap.Energético;
    const keywordList = keywords.length ? keywords : ["luz", "estrada", "chama", "céu"];
    const word = keywordList[index % keywordList.length];
    const moodWord = moodWords[index % moodWords.length];
    const toneWord = tone[index % tone.length];

    return `${theme} em ${toneWord}, ${word} na pele, ${moodWord} no ar`;
  }

  function composeLyric({ theme, genre, mood, keywords, notes }) {
    const toneMap = {
      Pop: ["brilho", "neon", "vibe", "flow"],
      Rock: ["chama", "guitarra", "rua", "grito"],
      Rap: ["ritmo", "verso", "batida", "futuro"],
      "R&B": ["suave", "groove", "mistério", "noite"],
      Indie: ["poeira", "instante", "fresta", "sonho"],
      MPB: ["vento", "jardim", "saudade", "maré"],
      Eletrônica: ["pulso", "laser", "circuito", "éter"],
    };

    const tone = toneMap[genre] || toneMap.Pop;
    const keywordList = keywords
      ? keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const intro = `Narrativa: ${notes || "A canção flui com imagens intensas e sensoriais."}`;
    const lines = sections
      .map((section, sectionIndex) => {
        const verseLines = Array.from({ length: 4 }).map((_, lineIndex) =>
          buildLine(theme, mood, keywordList, tone, sectionIndex + lineIndex)
        );
        return {
          section,
          lines: verseLines,
        };
      })
      .map((block) => ({
        title: block.section,
        text: block.lines.join("\n"),
      }));

    return {
      title: `${theme} (${genre})`,
      intro,
      blocks: lines,
    };
  }

  async function generate(payload) {
    await delay(2000);
    return composeLyric(payload);
  }

  return {
    generate,
  };
})();
