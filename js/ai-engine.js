const AiEngine = (() => {
  const sections = [
    "Intro",
    "Verso 1",
    "Pré-Refrão",
    "Refrão",
    "Verso 2",
    "Ponte",
    "Refrão Final",
    "Outro",
  ];

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function pick(list, index) {
    return list[index % list.length];
  }

  function buildLine(theme, mood, keywords, tone, rhyme, index, template) {
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
    const word = pick(keywordList, index);
    const moodWord = pick(moodWords, index);
    const toneWord = pick(tone, index);
    const rhymeWord = pick(rhyme, index);

    const templates = [
      `${theme} em ${toneWord}, ${word} na pele, ${moodWord} no ar`,
      `Eu sigo ${word} no peito, ${moodWord} no olhar, ${rhymeWord} pra guiar`,
      `Na ${toneWord} do destino, teu nome é ${word}, ${moodWord} a brilhar`,
      `Tudo vira ${toneWord} quando ${word} chega perto, ${rhymeWord} sem fim`,
      `Coração em ${moodWord}, ${word} no verso, ${rhymeWord} por mim`,
      `Se o mundo fecha, ${word} abre, ${toneWord} me chama, ${rhymeWord} me leva`,
      `Teu rastro é ${word}, meu norte é ${toneWord}, ${moodWord} que acelera`,
    ];

    if (template) return template({ theme, word, moodWord, toneWord, rhymeWord });
    return templates[index % templates.length];
  }

  function composeLyric({ theme, genre, mood, keywords, notes, intensity = 3, rhymeScheme = "ABAB" }) {
    const toneMap = {
      Pop: ["brilho", "neon", "vibe", "flow"],
      Rock: ["chama", "guitarra", "rua", "grito"],
      Rap: ["ritmo", "verso", "batida", "futuro"],
      "R&B": ["suave", "groove", "mistério", "noite"],
      Indie: ["poeira", "instante", "fresta", "sonho"],
      MPB: ["vento", "jardim", "saudade", "maré"],
      Eletrônica: ["pulso", "laser", "circuito", "éter"],
    };

    const hookMap = {
      Pop: "É o refrão que não sai de mim",
      Rock: "E o grito corta a madrugada",
      Rap: "Na batida, minha voz explode",
      "R&B": "Teu toque é o meu refrão",
      Indie: "A cidade some quando eu te encontro",
      MPB: "Na maré, teu nome fica",
      Eletrônica: "O pulso sobe, luzes no ar",
    };

    const narrativeMap = {
      Energético: ["corrida", "tempestade", "fogo", "vértice"],
      Melancólico: ["retorno", "memória", "distância", "neblina"],
      Triste: ["silêncio", "ausência", "queda", "inverno"],
      Romântico: ["encontro", "promessa", "abrigo", "constelação"],
      Inspirador: ["renascer", "voo", "aurora", "travessia"],
      Contemplativo: ["maré", "tempo", "horizonte", "reflexo"],
    };

    const imageryMap = {
      Pop: ["neon", "céu", "rua", "cidade"],
      Rock: ["asfalto", "guitarra", "tempestade", "fumaça"],
      Rap: ["bairro", "ponte", "linha", "noite"],
      "R&B": ["lua", "janela", "perfume", "sombra"],
      Indie: ["teto", "garoa", "sala", "metrô"],
      MPB: ["varanda", "mar", "vento", "jardim"],
      Eletrônica: ["laser", "pulso", "luzes", "vértice"],
    };

    const rhymeGroups = [
      ["luz", "cruz", "flux"],
      ["mar", "lugar", "brilhar"],
      ["coração", "direção", "chão"],
      ["vento", "tempo", "alento"],
      ["noite", "açoite", "feitiço"],
      ["som", "tom", "dom"],
      ["vida", "saída", "ferida"],
    ];

    const tone = toneMap[genre] || toneMap.Pop;
    const keywordList = keywords
      ? keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const intro = `Narrativa: ${notes || "A canção flui com imagens intensas e sensoriais."}`;
    const hook = hookMap[genre] || hookMap.Pop;
    const rhyme = rhymeGroups[Math.floor(Math.random() * rhymeGroups.length)];
    const narrative = narrativeMap[mood] || narrativeMap.Energético;
    const imagery = imageryMap[genre] || imageryMap.Pop;
    const intensityLevel = Math.min(5, Math.max(1, Number(intensity) || 3));
    const lineCount = intensityLevel <= 2 ? 3 : intensityLevel >= 4 ? 5 : 4;

    const schemeMap = {
      ABAB: [0, 1, 0, 1, 0],
      AABB: [0, 0, 1, 1, 1],
      AAAA: [0, 0, 0, 0, 0],
    };
    const scheme = schemeMap[rhymeScheme] || schemeMap.ABAB;

    const sectionBuilders = {
      Intro: () => [
        `Silêncio antes da cena, ${theme} me chama`,
        `${tone[0]} no peito, ${mood.toLowerCase()} na alma`,
        `No ${pick(imagery, 0)} da cidade, ${pick(narrative, 0)} começa`,
      ],
      "Verso 1": (index) =>
        Array.from({ length: lineCount }).map((_, lineIndex) =>
          buildLine(
            theme,
            mood,
            keywordList,
            tone,
            [rhyme[scheme[lineIndex]]],
            index + lineIndex
          )
        ),
      "Pré-Refrão": () => [
        `Quando o mundo desacelera, só ${theme} fica`,
        `Eu respiro fundo e a promessa vibra`,
        `Passo a passo, ${rhyme[1]} me guia`,
      ],
      Refrão: () => [
        hook,
        `${theme}, ${theme}, não deixa acabar`,
        `Tua luz no meu peito, ${rhyme[0]} pra ficar`,
        `Eu canto pra te achar`,
      ],
      "Verso 2": (index) =>
        Array.from({ length: lineCount }).map((_, lineIndex) =>
          buildLine(
            theme,
            mood,
            keywordList,
            tone,
            [rhyme[scheme[lineIndex]]],
            index + lineIndex,
            ({ word, toneWord, rhymeWord }) =>
              `Na ${toneWord} do caminho, ${word} é direção, ${rhymeWord} na mão`
          )
        ),
      Ponte: () => [
        `E se tudo apagar, tua voz me acende`,
        `Meu pulso sobe quando o céu entende`,
        `É o tempo abrindo espaço pra nós`,
      ],
      "Refrão Final": () => [
        `${hook} (repete)`,
        `${theme}, ${theme}, ecoa no ar`,
        `Meu destino em tua luz, ${rhyme[1]} pra ficar`,
        `Eu canto pra te achar`,
      ],
      Outro: () => [
        `Se a noite fechar, eu te chamo`,
        `${theme} é o nome que eu guardo`,
        `${pick(narrative, 2)} vira paz quando eu te encontro`,
      ],
    };

    const lines = sections
      .map((section, sectionIndex) => {
        const builder = sectionBuilders[section];
        const verseLines = builder ? builder(sectionIndex) : [];
        return {
          section,
          lines: verseLines,
        };
      })
      .filter((block) => block.lines.length)
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
