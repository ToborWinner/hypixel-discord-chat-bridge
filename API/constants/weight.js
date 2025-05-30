//CREDIT: https://github.com/Senither/hypixel-skyblock-facade
const dungeon_weights = {
  catacombs: 0.0002149604615,
  healer: 0.0000045254834,
  mage: 0.0000045254834,
  berserk: 0.0000045254834,
  archer: 0.0000045254834,
  tank: 0.0000045254834
};
const slayer_weights = {
  revenant: {
    divider: 2208,
    modifier: 0.15
  },
  tarantula: {
    divider: 2118,
    modifier: 0.08
  },
  sven: {
    divider: 1962,
    modifier: 0.015
  },
  enderman: {
    divider: 1430,
    modifier: 0.017
  }
};
const skill_weights = {
  mining: {
    exponent: 1.18207448,
    divider: 259634,
    maxLevel: 60
  },
  // Maxes out foraging at 850 points at level 50.
  foraging: {
    exponent: 1.232826,
    divider: 259634,
    maxLevel: 50
  },
  // Maxes out enchanting at 450 points at level 60.
  enchanting: {
    exponent: 0.96976583,
    divider: 882758,
    maxLevel: 60
  },
  // Maxes out farming at 2,200 points at level 60.
  farming: {
    exponent: 1.217848139,
    divider: 220689,
    maxLevel: 60
  },
  // Maxes out combat at 1,500 points at level 60.
  combat: {
    exponent: 1.15797687265,
    divider: 275862,
    maxLevel: 60
  },
  // Maxes out fishing at 2,500 points at level 50.
  fishing: {
    exponent: 1.406418,
    divider: 88274,
    maxLevel: 50
  },
  // Maxes out alchemy at 200 points at level 50.
  alchemy: {
    exponent: 1.0,
    divider: 1103448,
    maxLevel: 50
  },
  // Maxes out taming at 500 points at level 50.
  taming: {
    exponent: 1.14744,
    divider: 441379,
    maxLevel: 50
  }
};

function calculateSenitherWeight(type, level = null, experience) {
  const slayers = ["revenant", "tarantula", "sven", "enderman"];
  const dungeons = ["catacombs", "healer", "mage", "berserk", "archer", "tank"];
  const skills = ["mining", "foraging", "enchanting", "farming", "combat", "fishing", "alchemy", "taming"];
  if (slayers.includes(type)) {
    return calculateSlayerWeight(type, experience);
  } else if (dungeons.includes(type)) {
    return calculateDungeonWeight(type, level, experience);
  } else if (skills.includes(type)) {
    return calculateSkillWeight(type, level, experience);
  }
  return null;
}

function calculateDungeonWeight(type, level, experience) {
  const percentageModifier = dungeon_weights[type];

  const base = Math.pow(level, 4.5) * percentageModifier;

  if (experience <= 569809640) {
    return {
      weight: base,
      weight_overflow: 0
    };
  }

  const remaining = experience - 569809640;
  const splitter = (4 * 569809640) / base;

  return {
    weight: Math.floor(base),
    weight_overflow: Math.pow(remaining / splitter, 0.968) || 0
  };
}

function calculateSkillWeight(type, level, experience) {
  const skillGroup = skill_weights[type];
  if (skillGroup.exponent == undefined || skillGroup.divider == undefined) {
    return {
      weight: 0,
      weight_overflow: 0
    };
  }

  const maxSkillLevelXP = skillGroup.maxLevel == 60 ? 111672425 : 55172425;

  let base = Math.pow(level * 10, 0.5 + skillGroup.exponent + level / 100) / 1250;
  if (experience > maxSkillLevelXP) {
    base = Math.round(base);
  }
  if (experience <= maxSkillLevelXP) {
    return {
      weight: base,
      weight_overflow: 0
    };
  }

  return {
    weight: base,
    weight_overflow: Math.pow((experience - maxSkillLevelXP) / skillGroup.divider, 0.968)
  };
}

function calculateSlayerWeight(type, experience) {
  const slayerWeight = slayer_weights[type];

  if (experience <= 1000000) {
    return {
      weight: experience == 0 ? 0 : experience / slayerWeight.divider,
      weight_overflow: 0
    };
  }

  const base = 1000000 / slayerWeight.divider;
  let remaining = experience - 1000000;

  let modifier = slayerWeight.modifier;
  let overflow = 0;

  while (remaining > 0) {
    const left = Math.min(remaining, 1000000);

    overflow += Math.pow(left / (slayerWeight.divider * (1.5 + modifier)), 0.942);
    modifier += slayerWeight.modifier;
    remaining -= left;
  }

  return {
    weight: base,
    weight_overflow: overflow
  };
}

const { getLevelByXp } = require("./skills.js");

function calculateTotalSenitherWeight(profile) {
  const weight = {
    skills: {
      farming: calculateSenitherWeight(
        "farming",
        getLevelByXp(profile?.player_data?.experience?.SKILL_FARMING || 0, { type: "farming" }).levelWithProgress,
        profile?.player_data?.experience?.SKILL_FARMING || 0
      ),
      mining: calculateSenitherWeight(
        "mining",
        getLevelByXp(profile?.player_data?.experience?.SKILL_MINING || 0, { type: "mining" }).levelWithProgress,
        profile?.player_data?.experience?.SKILL_MINING || 0
      ),
      combat: calculateSenitherWeight(
        "combat",
        getLevelByXp(profile?.player_data?.experience?.SKILL_COMBAT || 0, { type: "combat" }).levelWithProgress,
        profile?.player_data?.experience?.SKILL_COMBAT || 0
      ),
      foraging: calculateSenitherWeight(
        "foraging",
        getLevelByXp(profile?.player_data?.experience?.SKILL_FORAGING || 0, { type: "foraging" }).levelWithProgress,
        profile?.player_data?.experience?.SKILL_FORAGING || 0
      ),
      fishing: calculateSenitherWeight(
        "fishing",
        getLevelByXp(profile?.player_data?.experience?.SKILL_FISHING || 0, { type: "fishing" }).levelWithProgress,
        profile?.player_data?.experience?.SKILL_FISHING || 0
      ),
      enchanting: calculateSenitherWeight(
        "enchanting",
        getLevelByXp(profile?.player_data?.experience?.SKILL_ENCHANTING || 0, { type: "enchanting" }).levelWithProgress,
        profile?.player_data?.experience?.SKILL_ENCHANTING || 0
      ),
      alchemy: calculateSenitherWeight(
        "alchemy",
        getLevelByXp(profile?.player_data?.experience?.SKILL_ALCHEMY || 0, { type: "alchemy" }).levelWithProgress,
        profile?.player_data?.experience?.SKILL_ALCHEMY || 0
      ),
      taming: calculateSenitherWeight(
        "taming",
        getLevelByXp(profile?.player_data?.experience?.SKILL_TAMING || 0, { type: "taming" }).levelWithProgress,
        profile?.player_data?.experience?.SKILL_TAMING || 0
      )
    },
    slayer: {
      revenant: calculateSenitherWeight("revenant", null, profile?.slayer?.slayer_bosses?.zombie?.xp || 0),
      tarantula: calculateSenitherWeight("tarantula", null, profile?.slayer?.slayer_bosses?.spider?.xp || 0),
      sven: calculateSenitherWeight("sven", null, profile?.slayer?.slayer_bosses?.wolf?.xp || 0),
      enderman: calculateSenitherWeight("enderman", null, profile?.slayer?.slayer_bosses?.enderman?.xp || 0)
    },
    dungeons: {
      catacombs: calculateSenitherWeight(
        "catacombs",
        getLevelByXp(profile.dungeons?.dungeon_types?.catacombs?.experience || 0, { type: "dungeoneering" }).levelWithProgress,
        profile.dungeons?.dungeon_types?.catacombs?.experience || 0
      ),
      classes: {
        healer: calculateSenitherWeight(
          "healer",
          getLevelByXp(profile?.dungeons?.player_classes.healer.experience || 0, { type: "dungeoneering" }).levelWithProgress,
          profile?.dungeons?.player_classes.healer.experience || 0
        ),
        mage: calculateSenitherWeight(
          "mage",
          getLevelByXp(profile?.dungeons?.player_classes.mage.experience || 0, { type: "dungeoneering" }).levelWithProgress,
          profile?.dungeons?.player_classes.mage.experience || 0
        ),
        berserk: calculateSenitherWeight(
          "berserk",
          getLevelByXp(profile?.dungeons?.player_classes.berserk.experience || 0, { type: "dungeoneering" }).levelWithProgress,
          profile?.dungeons?.player_classes.berserk.experience || 0
        ),
        archer: calculateSenitherWeight(
          "archer",
          getLevelByXp(profile?.dungeons?.player_classes.archer.experience || 0, { type: "dungeoneering" }).levelWithProgress,
          profile?.dungeons?.player_classes.archer.experience || 0
        ),
        tank: calculateSenitherWeight(
          "tank",
          getLevelByXp(profile?.dungeons?.player_classes.tank.experience || 0, { type: "dungeoneering" }).levelWithProgress,
          profile?.dungeons?.player_classes.tank.experience || 0
        )
      }
    }
  };
  return weight;
}

module.exports = { calculateTotalSenitherWeight };
