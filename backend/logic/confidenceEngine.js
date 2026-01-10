function selectBestGuess(objects) {
  const count = objects.length;

  if (count === 0) {
    return { name: "Unknown", confidence: 0 };
  }

  return {
    name: objects[0].name,
    confidence: Math.round((1 / count) * 100)
  };
}

module.exports = { selectBestGuess };
