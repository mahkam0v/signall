function previewText(parsed, photoStatus) {
  return (
    `📋 Tekshiring:\n\n` +
    `Nomi: ${parsed.title || "❌ topilmadi"}\n` +
    `Qism: ${parsed.episode || "nomalum"}\n` +
    `Sifat: ${parsed.quality || "nomalum"}\n` +
    `Janr: ${parsed.genre || "nomalum"}\n` +
    `Kanal: ${parsed.channel || "nomalum"}\n` +
    `Rasm: ${photoStatus}\n\n` +
    `To'g'rimi?`
  );
}

module.exports = { previewText };
