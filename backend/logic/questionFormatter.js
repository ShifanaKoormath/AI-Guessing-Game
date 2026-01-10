// logic/questionFormatter.js

const QUESTION_MAP = {
  // ===== Animal =====
  isMammal: "a mammal",
  isBird: "a bird",
  isReptile: "a reptile",
  isAquatic: "an aquatic animal",
  canFly: "able to fly",
  isPet: "commonly kept as a pet",
  isWild: "a wild animal",
  isHerbivore: "a herbivore",
  isCarnivore: "a carnivore",
  isOmnivore: "an omnivore",
  isVenomous: "venomous",
  isLarge: "large in size",

  // ===== Food =====
  isSweet: "sweet",
  isSalty: "salty",
  isSpicy: "spicy",
  isCooked: "cooked",
  isVegetarian: "vegetarian",
  isFruit: "a fruit",
  isLiquid: "a liquid",
  isDairy: "a dairy product",
  isFrozen: "frozen",
  isStaple: "a staple food",

  // ===== Object =====
  isElectronic: "electronic",
  usesElectricity: "uses electricity",
  isPortable: "portable",
  isFurniture: "a piece of furniture",
  isAppliance: "a household appliance",
  isTool: "a tool",
  hasScreen: "has a screen",
  hasButtons: "has buttons",
  isVehicle: "a vehicle",
  isHeavy: "heavy"
};

function formatQuestion(attribute) {
  // Known attribute → clean question
  if (QUESTION_MAP[attribute]) {
    return `Is it ${QUESTION_MAP[attribute]}?`;
  }

  // Fallback for unknown attributes (safe & readable)
  const readable = attribute
    .replace(/^is/, "")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase();

  return `Is it ${readable}?`;
}

module.exports = { formatQuestion };
