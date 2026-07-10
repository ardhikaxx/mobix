const badWords = [
  // ========== INDONESIAN ==========
  // Hewan sebagai makian
  "anjing", "anjink", "anjeng", "babi", "bangsat", "kampret",
  "monyet", "kunyuk", "kera", "tikus", "belatung", "cacing", "lintah",
  "kelelawar", "kadal", "kecoak", "kecoa", "lembu", "unta", "serigala",
  // Alat kelamin & seksualitas
  "kontol", "memek", "pepek", "puki", "pukimak", "jembut", "pantek",
  "tempik", "tai", "tahi", "tahik", "palai", "peler", "pelor",
  "ndasmu", "ndas", "jablay", "lonte", "sundal", "perek", "pecun",
  "pelacur", "lacur", "cabul", "mesum", "bejad", "bajingan",
  "ngentot", "entot", "ngewe", "ewe", "nenen", "susuk",
  // Makian umum
  "bego", "bodoh", "tolol", "goblok", "dungu", "idiot", "sinting",
  "edan", "gila", "sarap", "miring", "setan", "iblis", "neraka",
  "sial", "sialan", "jancok", "jancuk", "dancok", "dancuk",
  "bedebah", "brengsek", "bangsad", "banjing", "keparat",
  "laknat", "jahanam", "terkutuk", "kafir", "murtad",
  "banci", "bencong", "waria", "banci",
  "sampah", "busuk", "gembel", "kumuh",
  "kampungan", "norak", "sontoloyo", "kacung",
  "cocot", "comberan", "dajjal", "hina", "hinaan",
  "mampus", "mati", "bunuh", "bacot", "cak", "cok",
  // Singkatan & variasi
  "asu", "asoe", "ajg", "anjg", "bgst", "mmk", "kntl",
  "plk", "picek", "tumpeh", "telaso", "tenga", "ublag",
  "lolot",

  // ========== ENGLISH ==========
  // Core profanity
  "fuck", "fucking", "fucker", "fucked", "fuckers", "fucks",
  "shit", "shitty", "shits", "bullshit", "horseshit",
  "ass", "asses", "asshole", "assholes", "arse", "arsehole",
  "bitch", "bitches", "bitching", "son of a bitch",
  "damn", "damned", "goddamn", "goddamnit", "dammit",
  "crap", "crappy",
  "dick", "dickhead", "dicks",
  "cock", "cocksucker",
  "pussy", "pussies",
  "cunt", "cunts",
  "bastard", "bastards",
  "whore", "whores",
  "slut", "sluts", "slutty",

  // Body parts
  "boobs", "tits", "titties", "titty", "nipple", "nipples",
  "penis", "vagina", "clit", "clitoris", "dildo", "dick",
  "balls", "ballsack",

  // Sexual acts
  "blowjob", "handjob", "rimjob", "anal", "orgasm",
  "masturbate", "masturbation", "cum", "cumshot", "semen",
  "ejaculate", "ejaculation", "porn", "porno", "pornography",
  "sex", "sexual", "fuck", "fucking", "fucked",
  "prostitute", "prostitution", "incest", "bestiality",
  "bdsm", "bondage", "fetish",

  // Slurs (racial, religious, LGBTQ+)
  "nigger", "nigga", "niggas", "niggaz",
  "kike", "spic", "spick", "chink", "gook", "wetback",
  "raghead", "towelhead", "camel jockey",
  "fag", "faggot", "fags", "faggots", "dyke", "homo",
  "queer", "tranny", "transvestite",
  "retard", "retarded", "mongoloid", "midget",
  "nazi", "hitler", "white trash", "redneck",

  // Insults
  "motherfucker", "motherfuckers", "motherfucking",
  "jackass", "jackasses",
  "douche", "douchebag", "douchebags",
  "dipshit", "dipshits",
  "dumbass", "dumbasses",
  "dumbbass",
  "cocksucker",
  "wanker", "wankers",
  "tosser", "tossers",
  "bollocks", "bugger",
  "prick", "pricks",
  "twat", "twats",
  "moron", "morons", "moronic",
  "idiot", "idiots", "idiotic",
  "imbecile", "imbeciles",
  "spastic", "spaz",
  "sod off", "sodding",
  "piss off", "pissed", "pissing",

  // Miscellaneous
  "bloody", "damn", "goddamn",
  "hell", "hellish",
  "screw", "screwed", "screwing",
];

export type BadWordResult = {
  hasBadWords: boolean;
  badWordsFound: string[];
  cleaned: string;
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterBadWords(text: string): BadWordResult {
  const normalized = normalizeText(text);
  const found = badWords.filter((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(normalized);
  });

  if (found.length === 0) {
    return { hasBadWords: false, badWordsFound: [], cleaned: text };
  }

  const cleaned = badWords.reduce((acc, word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    return acc.replace(regex, "***");
  }, text);

  return { hasBadWords: true, badWordsFound: [...new Set(found)], cleaned };
}

export function validateRequestContent(title: string, description: string): string | null {
  const checks = [
    { text: title, field: "Judul" },
    { text: description, field: "Deskripsi" },
  ];

  for (const { text, field } of checks) {
    const result = filterBadWords(text);
    if (result.hasBadWords) {
      const words = result.badWordsFound.join(", ");
      return `${field} mengandung kata tidak pantas: ${words}. Harap hapus kata tersebut.`;
    }
  }

  return null;
}
