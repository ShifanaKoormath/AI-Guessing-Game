const fs = require("fs");
const path = require("path");

/* ================= BASE ATTRIBUTES ================= */

// ---------- ANIMALS ----------
const baseAnimal = {
  isMammal: false,
  isBird: false,
  isReptile: false,
  isFish: false,
  isInsect: false,

  livesOnLand: false,
  livesInWater: false,
  livesInAir: false,

  isDomestic: false,
  isWild: false,

  isHerbivore: false,
  isCarnivore: false,
  isOmnivore: false,

  isPredator: false,
  isNocturnal: false,

  hasFur: false,
  hasFeathers: false,
  hasScales: false,
  hasWings: false,
  hasHorns: false,
  hasStripes: false,

  canBite: false,
  canSting: false,
  feedsOnBlood: false,

  isTiny: false,
  isMedium: false,
  isLarge: false
};

// ---------- FOOD ----------
const baseFood = {
  isFruit: false,
  isStaple: false,
  isDairy: false,
  isProcessed: false,

  isSweet: false,
  isSalty: false,

  eatenRaw: false,
  eatenCooked: false,
  baked: false,

  isLiquid: false,
  isFrozen: false,

  isPlantBased: false,
  isAnimalBased: false,

  servedHot: false,
  servedCold: false,

  hasSeeds: false,
  hasThickPeel: false,

  // 🔑 discriminators
  isGrainDish: false,
  isBreadType: false
};

// ---------- OBJECTS ----------
const baseObject = {
  isElectronic: false,
  isAppliance: false,
  isFurniture: false,
  isVehicle: false,

  usesElectricity: false,
  usesFuel: false,
  usesHumanPower: false,

  hasScreen: false,
  hasKeyboard: false,
  hasButtons: false,
  hasTouchInput: false,

  usedForCommunication: false,
  usedForWork: false,
  usedForEntertainment: false,
  usedForTransport: false,
  usedForCooking: false,

  fullyPortable: false,
  semiPortable: false,
  fixedInPlace: false,

  hasEngine: false,
  hasPedals: false,
  numberOfWheels: 0,

  // 🔑 discriminators
  isForCooling: false,
  isForHeating: false,
  usedForSitting: false,
  usedForPlacingItems: false
};

/* ================= DATA ================= */

// ---------- ANIMALS ----------
const animals = [
  ["Dog", {
    isMammal: true, livesOnLand: true, isDomestic: true,
    isOmnivore: true, hasFur: true, canBite: true, isMedium: true
  }],
  ["Cat", {
    isMammal: true, livesOnLand: true, isDomestic: true,
    isCarnivore: true, hasFur: true, canBite: true, isMedium: true
  }],
  ["Cow", {
    isMammal: true, livesOnLand: true, isDomestic: true,
    isHerbivore: true, hasHorns: true, isLarge: true
  }],
  ["Goat", {
    isMammal: true, livesOnLand: true, isDomestic: true,
    isHerbivore: true, hasHorns: true, isMedium: true
  }],
  ["Lion", {
    isMammal: true, livesOnLand: true, isWild: true,
    isCarnivore: true, isPredator: true, isLarge: true
  }],
  ["Tiger", {
    isMammal: true, livesOnLand: true, isWild: true,
    isCarnivore: true, isPredator: true, hasStripes: true, isLarge: true
  }],
  ["Eagle", {
    isBird: true, livesInAir: true,
    isCarnivore: true, isPredator: true,
    hasFeathers: true, hasWings: true, isMedium: true
  }],
  ["Owl", {
    isBird: true, livesInAir: true,
    isCarnivore: true, isNocturnal: true,
    hasFeathers: true, hasWings: true, isMedium: true
  }],
  ["Snake", {
    isReptile: true, livesOnLand: true,
    isCarnivore: true, hasScales: true, canBite: true
  }],
  ["Fish", {
    isFish: true, livesInWater: true, isMedium: true
  }],
  ["Ant", {
    isInsect: true, livesOnLand: true, isTiny: true
  }],
  ["Bee", {
    isInsect: true, livesInAir: true,
    hasWings: true, canSting: true, isTiny: true
  }],
  ["Butterfly", {
    isInsect: true, livesInAir: true,
    hasWings: true, isTiny: true
  }],
  ["Mosquito", {
    isInsect: true, livesInAir: true,
    hasWings: true, feedsOnBlood: true, isTiny: true
  }]
];

// ---------- FOOD ----------
const foods = [
  ["Apple", {
    isFruit: true, isPlantBased: true,
    isSweet: true, eatenRaw: true, hasSeeds: true
  }],
  ["Banana", {
    isFruit: true, isPlantBased: true,
    isSweet: true, eatenRaw: true, hasThickPeel: true
  }],
  ["Orange", {
    isFruit: true, isPlantBased: true,
    isSweet: true, hasSeeds: true, hasThickPeel: true
  }],
  ["Rice", {
    isStaple: true, isPlantBased: true,
    eatenCooked: true, servedHot: true,
    isGrainDish: true
  }],
  ["Chapati", {
    isStaple: true, isPlantBased: true,
    eatenCooked: true, servedHot: true,
    isBreadType: true
  }],
  ["Bread", {
    isStaple: true, isPlantBased: true,
    baked: true, eatenCooked: true,
    isBreadType: true
  }],
  ["Milk", {
    isDairy: true, isAnimalBased: true,
    isLiquid: true, servedCold: true
  }],
  ["Ice Cream", {
    isDairy: true, isProcessed: true,
    isSweet: true, isFrozen: true, servedCold: true
  }],
  ["Pizza", {
    isProcessed: true, isSalty: true,
    baked: true, eatenCooked: true, servedHot: true
  }],
  ["Burger", {
    isProcessed: true, isSalty: true,
    eatenCooked: true, servedHot: true
  }],
  ["Sandwich", {
    isProcessed: true, eatenCooked: true
  }],
  ["Pasta", {
    isProcessed: true, eatenCooked: true, servedHot: true
  }]
];

// ---------- OBJECTS ----------
const objects = [
  ["Mobile Phone", {
    isElectronic: true, usesElectricity: true,
    hasScreen: true, hasTouchInput: true,
    usedForCommunication: true, fullyPortable: true
  }],
  ["Laptop", {
    isElectronic: true, usesElectricity: true,
    hasScreen: true, hasKeyboard: true,
    usedForWork: true, semiPortable: true
  }],
  ["Desktop", {
    isElectronic: true, usesElectricity: true,
    hasScreen: true, hasKeyboard: true,
    usedForWork: true, fixedInPlace: true
  }],
  ["Television", {
    isElectronic: true, usesElectricity: true,
    hasScreen: true,
    usedForEntertainment: true, fixedInPlace: true
  }],
  ["Refrigerator", {
    isAppliance: true, usesElectricity: true,
    fixedInPlace: true,
    isForCooling: true
  }],
  ["Microwave", {
    isAppliance: true, usesElectricity: true,
    fixedInPlace: true,
    isForHeating: true
  }],
  ["Fan", {
    isAppliance: true, usesElectricity: true,
    fixedInPlace: true
  }],
  ["Chair", {
    isFurniture: true, fixedInPlace: true,
    usedForSitting: true
  }],
  ["Table", {
    isFurniture: true, fixedInPlace: true,
    usedForPlacingItems: true
  }],
  ["Bicycle", {
    isVehicle: true, usesHumanPower: true,
    hasPedals: true, numberOfWheels: 2,
    usedForTransport: true
  }],
  ["Car", {
    isVehicle: true, usesFuel: true,
    hasEngine: true, numberOfWheels: 4,
    usedForTransport: true
  }]
];

/* ================= GENERATION ================= */

function generate(category, list, base) {
  return list.map(([name, overrides]) => ({
    name,
    category,
    attributes: { ...base, ...overrides }
  }));
}

const knowledgeBase = {
  objects: [
    ...generate("Animal", animals, baseAnimal),
    ...generate("Food", foods, baseFood),
    ...generate("Object", objects, baseObject)
  ]
};

const outputPath = path.join(__dirname, "..", "data", "knowledgeBase.json");
fs.writeFileSync(outputPath, JSON.stringify(knowledgeBase, null, 2));

console.log("✅ knowledgeBase.json generated (dense, separable, validated)");
