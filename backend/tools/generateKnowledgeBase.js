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

  // discriminators
  isGrainDish: false,
  isBreadType: false,

  // 🔥 NEW discriminators (fix separability)
  isRound: false,
  isSmallSized: false,
  growsInBunches: false,
  isSolidSnack: false,
  isFingerFood: false
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

  isForCooling: false,
  isForHeating: false,
  usedForSitting: false,
  usedForPlacingItems: false,
  hasManySeeds: false,
hasHairySkin: false,
hasHardOuterShell: false,
// --- appliances ---
usedForFoodStorage: false,
usedForCoolingAir: false,

// --- fixtures ---
usedForEntryExit: false,
usedForViewingOutside: false


};

/* ================= DATA ================= */

// ---------- ANIMALS ----------
const animals = [
  ["Dog", { isMammal: true, livesOnLand: true, isDomestic: true, isOmnivore: true, hasFur: true, canBite: true, isMedium: true }],
  ["Cat", { isMammal: true, livesOnLand: true, isDomestic: true, isCarnivore: true, hasFur: true, canBite: true, isMedium: true }],
  ["Cow", { isMammal: true, livesOnLand: true, isDomestic: true, isHerbivore: true, hasHorns: true, isLarge: true }],
  ["Goat", { isMammal: true, livesOnLand: true, isDomestic: true, isHerbivore: true, hasHorns: true, isMedium: true }],
  ["Lion", { isMammal: true, livesOnLand: true, isWild: true, isCarnivore: true, isPredator: true, isLarge: true }],
  ["Tiger", { isMammal: true, livesOnLand: true, isWild: true, isCarnivore: true, isPredator: true, hasStripes: true, isLarge: true }],
  ["Elephant", { isMammal: true, livesOnLand: true, isWild: true, isHerbivore: true, isLarge: true }],
  ["Horse", { isMammal: true, livesOnLand: true, isDomestic: true, isHerbivore: true, isLarge: true }],

  ["Eagle", { isBird: true, livesInAir: true, isCarnivore: true, isPredator: true, hasFeathers: true, hasWings: true, isMedium: true }],
  ["Owl", { isBird: true, livesInAir: true, isCarnivore: true, isNocturnal: true, hasFeathers: true, hasWings: true, isMedium: true }],
  ["Parrot", { isBird: true, livesInAir: true, isHerbivore: true, hasFeathers: true, hasWings: true, isMedium: true }],
  ["Crow", { isBird: true, livesInAir: true, isOmnivore: true, hasFeathers: true, hasWings: true, isMedium: true }],

  ["Snake", { isReptile: true, livesOnLand: true, isCarnivore: true, hasScales: true, canBite: true }],
  ["Fish", { isFish: true, livesInWater: true, isMedium: true }],

  ["Ant", { isInsect: true, livesOnLand: true, isTiny: true }],
  ["Bee", { isInsect: true, livesInAir: true, hasWings: true, canSting: true, isTiny: true }],
  ["Butterfly", { isInsect: true, livesInAir: true, hasWings: true, isTiny: true }],
  ["Mosquito", { isInsect: true, livesInAir: true, hasWings: true, feedsOnBlood: true, isTiny: true,  canSting: true,        // ✅ FIX
 }]
];

// ---------- FOOD ----------
const foods = [
  // ===== COMMON FRUITS =====

  ["Apple", {
    isFruit: true,
    isPlantBased: true,
    isSweet: true,
    eatenRaw: true,
    hasSeeds: true,
    isRound: true,
    isSmallSized: true
  }],

  ["Banana", {
    isFruit: true,
    isPlantBased: true,
    isSweet: true,
    eatenRaw: true,
    hasThickPeel: true,
    isSmallSized: true
  }],

  ["Orange", {
    isFruit: true,
    isPlantBased: true,
    isSweet: true,
    eatenRaw: true,
    hasSeeds: true,
    hasThickPeel: true,
    isRound: true,
    isSmallSized: true
  }],

  ["Mango", {
    isFruit: true,
    isPlantBased: true,
    isSweet: true,
    eatenRaw: true,
    hasSeeds: true,        // stone seed
    hasThickPeel: true,
    isSmallSized: true
  }],

  ["Grapes", {
    isFruit: true,
    isPlantBased: true,
    isSweet: true,
    eatenRaw: true,
    hasSeeds: true,
    growsInBunches: true,
    isSmallSized: true
  }],

  ["Watermelon", {
    isFruit: true,
    isPlantBased: true,
    isSweet: true,
    eatenRaw: true,
    hasSeeds: true,
    isRound: true,
    isLarge: true
  }],

  ["Pineapple", {
    isFruit: true,
    isPlantBased: true,
    isSweet: true,
    eatenRaw: true,
    hasThickPeel: true,
    isLarge: true
  }],

  ["Papaya", {
    isFruit: true,
    isPlantBased: true,
    isSweet: true,
    eatenRaw: true,
    hasSeeds: true,
    isLarge: true
  }],

  ["Guava", {
  isFruit: true,
  isPlantBased: true,
  isSweet: true,
  eatenRaw: true,
  hasSeeds: true,
  hasManySeeds: true,   // ✅ discriminator
  isRound: true,
  isSmallSized: true
}]
,

  ["Strawberry", {
    isFruit: true,
    isPlantBased: true,
    isSweet: true,
    eatenRaw: true,
    hasSeeds: true,
    isSmallSized: true
  }],

["Kiwi", {
  isFruit: true,
  isPlantBased: true,
  isSweet: true,
  eatenRaw: true,
  hasSeeds: true,
  hasThickPeel: true,
  hasHairySkin: true,   // ✅ discriminator
  isSmallSized: true
}]
,

 ["Pomegranate", {
  isFruit: true,
  isPlantBased: true,
  isSweet: true,
  eatenRaw: true,
  hasSeeds: true,
  hasHardOuterShell: true, // ✅ discriminator
  isRound: true,
  isLarge: true
}]



,

  // Staples
  ["Rice", { isStaple: true, isPlantBased: true, eatenCooked: true, servedHot: true, isGrainDish: true }],
  ["Chapati", { isStaple: true, isPlantBased: true, eatenCooked: true, servedHot: true, isBreadType: true }],
  ["Bread", { isStaple: true, isPlantBased: true, baked: true, eatenCooked: true, isBreadType: true }],

  // Dairy
  ["Milk", { isDairy: true, isAnimalBased: true, isLiquid: true, servedCold: true }],
  ["Ice Cream", { isDairy: true, isProcessed: true, isSweet: true, isFrozen: true, servedCold: true }],

  // Fast food (fixed)
  ["Burger", { isProcessed: true, isSalty: true, eatenCooked: true, servedHot: true, isFingerFood: true, isSolidSnack: true }],
  ["French Fries", { isProcessed: true, isSalty: true, eatenCooked: true, servedHot: true, isFingerFood: true }],
  ["Pizza", { isProcessed: true, isSalty: true, baked: true, eatenCooked: true, servedHot: true }],
  ["Sandwich", { isProcessed: true, eatenCooked: true, isFingerFood: true }],
  ["Pasta", { isProcessed: true, eatenCooked: true, servedHot: true }]
];

// ---------- OBJECTS ----------
const objects = [
  // ===== ELECTRONICS =====
  ["Mobile Phone", {
    isElectronic: true,
    usesElectricity: true,
    hasScreen: true,
    hasTouchInput: true,
    usedForCommunication: true,
    fullyPortable: true
  }],

  ["Laptop", {
    isElectronic: true,
    usesElectricity: true,
    hasScreen: true,
    hasKeyboard: true,
    usedForWork: true,
    semiPortable: true
  }],

  ["Desktop", {
    isElectronic: true,
    usesElectricity: true,
    hasScreen: true,
    hasKeyboard: true,
    usedForWork: true,
    fixedInPlace: true
  }],

  ["Television", {
    isElectronic: true,
    usesElectricity: true,
    hasScreen: true,
    usedForEntertainment: true,
    fixedInPlace: true
  }],

  // ===== APPLIANCES =====
 ["Refrigerator", {
  isAppliance: true,
  usesElectricity: true,
  fixedInPlace: true,
  isForCooling: true,
  usedForFoodStorage: true   // ✅ discriminator
}],

["Air Conditioner", {
  isAppliance: true,
  usesElectricity: true,
  fixedInPlace: true,
  isForCooling: true,
  usedForCoolingAir: true    // ✅ discriminator
}],

  ["Microwave", {
    isAppliance: true,
    usesElectricity: true,
    fixedInPlace: true,
    isForHeating: true
  }],

  ["Fan", {
    isAppliance: true,
    usesElectricity: true,
    fixedInPlace: true
  }],

  // ===== FURNITURE & FIXTURES =====
  ["Chair", {
    isFurniture: true,
    fixedInPlace: true,
    usedForSitting: true
  }],

  ["Table", {
    isFurniture: true,
    fixedInPlace: true,
    usedForPlacingItems: true
  }],

 ["Door", {
  isFurniture: true,
  fixedInPlace: true,
  usedForEntryExit: true     // ✅ discriminator
}],

["Window", {
  isFurniture: true,
  fixedInPlace: true,
  usedForViewingOutside: true // ✅ discriminator
}],


  // ===== VEHICLES =====
  ["Bicycle", {
    isVehicle: true,
    usesHumanPower: true,
    hasPedals: true,
    numberOfWheels: 2,
    usedForTransport: true
  }],

  ["Car", {
    isVehicle: true,
    usesFuel: true,
    hasEngine: true,
    numberOfWheels: 4,
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

console.log("✅ knowledgeBase.json generated (dense, separable, demo-safe)");
