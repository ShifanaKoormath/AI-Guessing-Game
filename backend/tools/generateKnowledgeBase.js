const fs = require("fs");

// ================= ATTRIBUTES =================

const baseAnimal = {
  isMammal: false,
  isBird: false,
  isReptile: false,
  isAquatic: false,
  canFly: false,
  isPet: false,
  isWild: true,
  isHerbivore: false,
  isCarnivore: false,
  isOmnivore: false,
  isVenomous: false,
  isLarge: false
};

const baseFood = {
  isSweet: false,
  isSalty: false,
  isSpicy: false,
  isCooked: false,
  isVegetarian: true,
  isFruit: false,
  isLiquid: false,
  isDairy: false,
  isFrozen: false,
  isStaple: false
};

const baseObject = {
  isElectronic: false,
  usesElectricity: false,
  isPortable: false,
  isFurniture: false,
  isAppliance: false,
  isTool: false,
  hasScreen: false,
  hasButtons: false,
  isVehicle: false,
  isHeavy: false
};

// ================= DATA SOURCES =================

// Animals
const animals = [
  ["Cat", { isMammal: true, isPet: true, isCarnivore: true }],
  ["Dog", { isMammal: true, isPet: true, isOmnivore: true, isLarge: true }],
  ["Cow", { isMammal: true, isHerbivore: true, isLarge: true }],
  ["Goat", { isMammal: true, isHerbivore: true }],
  ["Sheep", { isMammal: true, isHerbivore: true }],
  ["Horse", { isMammal: true, isHerbivore: true, isLarge: true }],
  ["Buffalo", { isMammal: true, isHerbivore: true, isLarge: true }],
  ["Pig", { isMammal: true, isOmnivore: true }],

  ["Lion", { isMammal: true, isCarnivore: true, isWild: true, isLarge: true }],
  ["Tiger", { isMammal: true, isCarnivore: true, isWild: true, isLarge: true }],
  ["Leopard", { isMammal: true, isCarnivore: true, isWild: true }],
  ["Cheetah", { isMammal: true, isCarnivore: true, isWild: true }],
  ["Elephant", { isMammal: true, isHerbivore: true, isWild: true, isLarge: true }],
  ["Bear", { isMammal: true, isOmnivore: true, isWild: true, isLarge: true }],
  ["Deer", { isMammal: true, isHerbivore: true, isWild: true }],
  ["Monkey", { isMammal: true, isOmnivore: true, isWild: true }],

  ["Eagle", { isBird: true, canFly: true, isCarnivore: true }],
  ["Parrot", { isBird: true, canFly: true, isPet: true, isHerbivore: true }],
  ["Sparrow", { isBird: true, canFly: true }],
  ["Crow", { isBird: true, canFly: true, isOmnivore: true }],
  ["Pigeon", { isBird: true, canFly: true }],
  ["Owl", { isBird: true, canFly: true, isCarnivore: true }],
  ["Peacock", { isBird: true, canFly: true }],

  ["Snake", { isReptile: true, isCarnivore: true, isVenomous: true }],
  ["Lizard", { isReptile: true }],
  ["Crocodile", { isReptile: true, isAquatic: true, isCarnivore: true, isLarge: true }],
  ["Turtle", { isReptile: true, isAquatic: true }],

  ["Fish", { isAquatic: true }],
  ["Shark", { isAquatic: true, isCarnivore: true, isLarge: true }],
  ["Dolphin", { isAquatic: true, isMammal: true }],
  ["Whale", { isAquatic: true, isMammal: true, isLarge: true }],
  ["Octopus", { isAquatic: true }],

  ["Ant", { isSmall: true }],
  ["Bee", { isSmall: true }],
  ["Butterfly", { isSmall: true }],
  ["Mosquito", { isSmall: true }]
];


// Foods
const foods = [
  ["Apple", { isSweet: true, isFruit: true }],
  ["Banana", { isSweet: true, isFruit: true }],
  ["Orange", { isSweet: true, isFruit: true }],
  ["Mango", { isSweet: true, isFruit: true }],
  ["Grapes", { isSweet: true, isFruit: true }],
  ["Papaya", { isSweet: true, isFruit: true }],
  ["Watermelon", { isSweet: true, isFruit: true }],
  ["Pineapple", { isSweet: true, isFruit: true }],

  ["Rice", { isCooked: true, isStaple: true }],
  ["Wheat", { isStaple: true }],
  ["Bread", { isCooked: true, isStaple: true, isSalty: true }],
  ["Chapati", { isCooked: true, isStaple: true }],
  ["Noodles", { isCooked: true }],
  ["Pasta", { isCooked: true }],

  ["Potato", { isCooked: true }],
  ["Tomato", { isVegetarian: true }],
  ["Onion", { isVegetarian: true }],
  ["Carrot", { isVegetarian: true }],
  ["Cabbage", { isVegetarian: true }],
  ["Cauliflower", { isVegetarian: true }],

  ["Milk", { isLiquid: true, isDairy: true }],
  ["Curd", { isDairy: true }],
  ["Butter", { isDairy: true }],
  ["Cheese", { isDairy: true }],
  ["Paneer", { isDairy: true }],

  ["Egg", { isVegetarian: false }],
  ["Chicken", { isVegetarian: false }],
  ["Fish Curry", { isVegetarian: false, isCooked: true }],
  ["Mutton", { isVegetarian: false }],

  ["Ice Cream", { isSweet: true, isFrozen: true, isDairy: true }],
  ["Chocolate", { isSweet: true }],
  ["Biscuit", { isSweet: true }],
  ["Cake", { isSweet: true }],

  ["Juice", { isLiquid: true, isSweet: true }],
  ["Tea", { isLiquid: true, isCooked: true }],
  ["Coffee", { isLiquid: true, isCooked: true }],
  ["Water", { isLiquid: true }],

  ["Pizza", { isCooked: true, isSalty: true }],
  ["Burger", { isCooked: true, isSalty: true }],
  ["Sandwich", { isCooked: true }]
];


// Objects
const objects = [
  ["Mobile Phone", { isElectronic: true, usesElectricity: true, isPortable: true, hasScreen: true }],
  ["Laptop", { isElectronic: true, usesElectricity: true, isPortable: true, hasScreen: true, isHeavy: true }],
  ["Tablet", { isElectronic: true, usesElectricity: true, isPortable: true, hasScreen: true }],
  ["Desktop", { isElectronic: true, usesElectricity: true, hasScreen: true, isHeavy: true }],
  ["Television", { isElectronic: true, usesElectricity: true, hasScreen: true }],

  ["Fan", { isAppliance: true, usesElectricity: true }],
  ["Refrigerator", { isAppliance: true, usesElectricity: true, isHeavy: true }],
  ["Washing Machine", { isAppliance: true, usesElectricity: true, isHeavy: true }],
  ["Microwave", { isAppliance: true, usesElectricity: true }],
  ["Air Conditioner", { isAppliance: true, usesElectricity: true, isHeavy: true }],

  ["Chair", { isFurniture: true, isPortable: true }],
  ["Table", { isFurniture: true, isHeavy: true }],
  ["Sofa", { isFurniture: true, isHeavy: true }],
  ["Bed", { isFurniture: true, isHeavy: true }],
  ["Cupboard", { isFurniture: true, isHeavy: true }],

  ["Bottle", { isPortable: true }],
  ["Bag", { isPortable: true }],
  ["Wallet", { isPortable: true }],
  ["Watch", { isPortable: true }],
  ["Glasses", { isPortable: true }],

  ["Pen", { isTool: true, isPortable: true }],
  ["Pencil", { isTool: true, isPortable: true }],
  ["Eraser", { isTool: true, isPortable: true }],
  ["Book", { isPortable: true }],
  ["Notebook", { isPortable: true }],

  ["Camera", { isElectronic: true, isPortable: true, hasButtons: true }],
  ["Headphones", { isElectronic: true, isPortable: true }],
  ["Speaker", { isElectronic: true }],
  ["Charger", { usesElectricity: true }],
  ["Power Bank", { isElectronic: true, isPortable: true }],

  ["Car", { isVehicle: true, isHeavy: true }],
  ["Bike", { isVehicle: true }],
  ["Bicycle", { isVehicle: true }],
  ["Bus", { isVehicle: true, isHeavy: true }],
  ["Train", { isVehicle: true, isHeavy: true }]
];


// ================= GENERATION =================

function generate(domain, list, base) {
  return list.map(([name, overrides]) => ({
    name,
    category: domain,
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

fs.writeFileSync(
  "../data/knowledgeBase.json",
  JSON.stringify(knowledgeBase, null, 2)
);

console.log("knowledgeBase.json generated successfully");
