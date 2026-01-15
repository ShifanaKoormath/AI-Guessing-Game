const knowledgeBase = require("../data/knowledgeBase.json");

function areObjectsSeparable(a, b) {
  const attrsA = a.attributes;
  const attrsB = b.attributes;

  const allKeys = new Set([
    ...Object.keys(attrsA),
    ...Object.keys(attrsB)
  ]);

  for (const key of allKeys) {
    const valA = attrsA[key];
    const valB = attrsB[key];

    if (valA !== valB) {
      return true; // found separating attribute
    }
  }

  return false;
}

function findSeparabilityIssues(objects) {
  const issues = [];

  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      const a = objects[i];
      const b = objects[j];

      if (!areObjectsSeparable(a, b)) {
        issues.push({
          category: a.category,
          objectA: a.name,
          objectB: b.name
        });
      }
    }
  }

  return issues;
}

function groupByCategory(objects) {
  return objects.reduce((acc, obj) => {
    acc[obj.category] = acc[obj.category] || [];
    acc[obj.category].push(obj);
    return acc;
  }, {});
}

// ================= RUN =================

const grouped = groupByCategory(knowledgeBase.objects);
let hasErrors = false;

for (const category of Object.keys(grouped)) {
  const issues = findSeparabilityIssues(grouped[category]);

  if (issues.length > 0) {
    hasErrors = true;

    console.error(`\n❌ Separability violations in category: ${category}`);
    issues.forEach(issue => {
      console.error(
        `   • ${issue.objectA} ↔ ${issue.objectB} (indistinguishable)`
      );
    });
  } else {
    console.log(`✅ Category "${category}" is fully separable`);
  }
}

if (hasErrors) {
  console.error(
    "\n🚫 Knowledge base is NOT provably distinguishable. Fix attributes."
  );
  process.exit(1);
} else {
  console.log("\n🎯 Knowledge base is fully separable. Safe to deploy.");
}
