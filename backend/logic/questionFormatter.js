// logic/questionFormatter.js

/**
 * Human-friendly question mappings for internal attributes.
 * Internal attribute names must NEVER leak directly to users.
 */

const QUESTION_MAP = {
  // ================= ANIMALS =================

  isMammal: {
    q: "Is it a mammal?",
    help: "Like dogs, cats, cows"
  },

  isBird: {
    q: "Is it a bird?",
    help: "Has feathers and lays eggs"
  },

  isReptile: {
    q: "Is it a reptile?",
    help: "Like snakes or lizards"
  },

  isFish: {
    q: "Is it a fish?"
  },

  isInsect: {
    q: "Is it an insect?",
    help: "Very small body, often with wings"
  },

  livesOnLand: {
    q: "Does it live mostly on land?"
  },

  livesInWater: {
    q: "Does it live in water?"
  },

  livesInAir: {
    q: "Does it spend most of its time flying?"
  },

  isDomestic: {
    q: "Is it commonly kept by humans?"
  },

  isWild: {
    q: "Is it a wild animal?"
  },

  isNocturnal: {
    q: "Is it active mainly at night?"
  },

  isPredator: {
    q: "Does it hunt other animals?"
  },

  hasFur: {
    q: "Does it have fur?"
  },

  hasFeathers: {
    q: "Does it have feathers?"
  },

  hasScales: {
    q: "Does it have scales?"
  },

  hasWings: {
    q: "Does it have wings?"
  },

  hasHorns: {
    q: "Does it have horns?"
  },

  hasStinger: {
    q: "Can it sting?",
    help: "Like a bee"
  },

  hasStripes: {
    q: "Does it have stripes?"
  },

  feedsOnBlood: {
    q: "Does it feed on blood?",
    help: "Like mosquitoes"
  },

  // ===== DIET (correctly phrased) =====

  isHerbivore: {
    q: "Does it eat only plants?",
    help: "Grass, leaves, fruits"
  },

  isCarnivore: {
    q: "Does it eat other animals?",
    help: "Meat or insects"
  },

  isOmnivore: {
    q: "Does it eat both plants and animals?"
  },

  // ================= FOOD =================

  isFruit: {
    q: "Is it a fruit?"
  },

  isStaple: {
    q: "Is it a staple food?",
    help: "Eaten regularly as a main food"
  },

  isDairy: {
    q: "Is it a dairy product?"
  },

  isPlantBased: {
    q: "Is it made from plants?"
  },

  isAnimalBased: {
    q: "Is it made from animal products?"
  },

  isProcessed: {
    q: "Is it processed or manufactured?"
  },

  isSweet: {
    q: "Does it taste sweet?"
  },

  isSalty: {
    q: "Does it taste salty?"
  },

  eatenRaw: {
    q: "Is it usually eaten raw?"
  },

  eatenCooked: {
    q: "Is it usually eaten after cooking?"
  },

  baked: {
    q: "Is it baked?"
  },

  isFrozen: {
    q: "Is it usually frozen?"
  },

  isLiquid: {
    q: "Is it a liquid?"
  },

  isCitrus: {
    q: "Is it a citrus fruit?",
    help: "Like orange or lemon"
  },

  isTropical: {
    q: "Is it a tropical fruit?",
    help: "Common in hot climates"
  },

  hasSeeds: {
    q: "Does it contain seeds?"
  },

  hasThickPeel: {
    q: "Does it have a thick peel?"
  },

  // ================= OBJECTS =================

  isElectronic: {
    q: "Is it an electronic item?"
  },

  isAppliance: {
    q: "Is it a household appliance?"
  },

  isFurniture: {
    q: "Is it a piece of furniture?"
  },

  isVehicle: {
    q: "Is it a vehicle?"
  },

  usesElectricity: {
    q: "Does it use electricity?"
  },

  usesFuel: {
    q: "Does it run on fuel?"
  },

  usesHumanPower: {
    q: "Is it powered by human effort?",
    help: "Pedaling or pushing"
  },

  hasScreen: {
    q: "Does it have a screen?"
  },

  hasKeyboard: {
    q: "Does it have a keyboard?"
  },

  hasButtons: {
    q: "Does it have buttons?"
  },

  hasTouchInput: {
    q: "Does it have a touch screen?"
  },

  usedForCommunication: {
    q: "Is it mainly used for communication?",
    help: "Calling, texting, messaging"
  },

  usedForWork: {
    q: "Is it mainly used for work?"
  },

  usedForEntertainment: {
    q: "Is it mainly used for entertainment?"
  },

  usedForTransport: {
    q: "Is it used for transportation?"
  },

  usedForCooking: {
    q: "Is it used for cooking or food storage?"
  },

  fullyPortable: {
    q: "Can it be easily carried around?"
  },

  fixedInPlace: {
    q: "Is it usually fixed in one place?"
  },
  // ===== SIZE (Animals) =====

isTiny: {
  q: "Is it very small?",
  help: "Like an ant or mosquito"
},

isMedium: {
  q: "Is it about the size of a dog or cat?"
},

isLarge: {
  q: "Is it much larger than a human?"
},
canBite: {
  q: "Can it bite?"
},

canSting: {
  q: "Can it sting?"
},

feedsOnBlood: {
  q: "Does it feed on blood?",
  help: "Like mosquitoes"
},

usesElectricity: {
  q: "Does it use electricity?"
}


};

function formatQuestion(attribute) {
  const entry = QUESTION_MAP[attribute];

  if (entry) {
    return entry.help
      ? `${entry.q}\n(${entry.help})`
      : entry.q;
  }

  // Safe fallback (should almost never be used)
  const readable = attribute
    .replace(/^is/, "")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase();

return `Is it ${readable}?`;
}

module.exports = { formatQuestion };
