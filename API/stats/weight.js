const { calculateTotalSenitherWeight } = require("../constants/weight.js");

module.exports = (profile, profileData) => {
  const senither = calculateTotalSenitherWeight(profile);
  return {
    senither: {
      total:
        senither.skills.farming.weight +
        senither.skills.mining.weight +
        senither.skills.combat.weight +
        senither.skills.foraging.weight +
        senither.skills.fishing.weight +
        senither.skills.enchanting.weight +
        senither.skills.alchemy.weight +
        senither.skills.taming.weight +
        senither.slayer.revenant.weight +
        senither.slayer.tarantula.weight +
        senither.slayer.sven.weight +
        senither.slayer.enderman.weight +
        senither.dungeons.catacombs.weight +
        senither.dungeons.classes.healer.weight +
        senither.dungeons.classes.mage.weight +
        senither.dungeons.classes.berserk.weight +
        senither.dungeons.classes.archer.weight +
        senither.dungeons.classes.tank.weight +
        senither.skills.farming.weight_overflow +
        senither.skills.mining.weight_overflow +
        senither.skills.combat.weight_overflow +
        senither.skills.foraging.weight_overflow +
        senither.skills.fishing.weight_overflow +
        senither.skills.enchanting.weight_overflow +
        senither.skills.alchemy.weight_overflow +
        senither.skills.taming.weight_overflow +
        senither.slayer.revenant.weight_overflow +
        senither.slayer.tarantula.weight_overflow +
        senither.slayer.sven.weight_overflow +
        senither.slayer.enderman.weight_overflow +
        senither.dungeons.catacombs.weight_overflow +
        senither.dungeons.classes.healer.weight_overflow +
        senither.dungeons.classes.mage.weight_overflow +
        senither.dungeons.classes.berserk.weight_overflow +
        senither.dungeons.classes.archer.weight_overflow +
        senither.dungeons.classes.tank.weight_overflow,
      weight:
        senither.skills.farming.weight +
        senither.skills.mining.weight +
        senither.skills.combat.weight +
        senither.skills.foraging.weight +
        senither.skills.fishing.weight +
        senither.skills.enchanting.weight +
        senither.skills.alchemy.weight +
        senither.skills.taming.weight +
        senither.slayer.revenant.weight +
        senither.slayer.tarantula.weight +
        senither.slayer.sven.weight +
        senither.slayer.enderman.weight +
        senither.dungeons.catacombs.weight +
        senither.dungeons.classes.healer.weight +
        senither.dungeons.classes.mage.weight +
        senither.dungeons.classes.berserk.weight +
        senither.dungeons.classes.archer.weight +
        senither.dungeons.classes.tank.weight,
      weight_overflow:
        senither.skills.farming.weight_overflow +
        senither.skills.mining.weight_overflow +
        senither.skills.combat.weight_overflow +
        senither.skills.foraging.weight_overflow +
        senither.skills.fishing.weight_overflow +
        senither.skills.enchanting.weight_overflow +
        senither.skills.alchemy.weight_overflow +
        senither.skills.taming.weight_overflow,
      skills: {
        farming: {
          total: senither.skills.farming.weight + senither.skills.farming.weight_overflow,
          weight: senither.skills.farming.weight,
          weight_overflow: senither.skills.farming.weight_overflow
        },
        mining: {
          total: senither.skills.mining.weight + senither.skills.mining.weight_overflow,
          weight: senither.skills.mining.weight,
          weight_overflow: senither.skills.mining.weight_overflow
        },
        combat: {
          total: senither.skills.combat.weight + senither.skills.combat.weight_overflow,
          weight: senither.skills.combat.weight,
          weight_overflow: senither.skills.combat.weight_overflow
        },
        foraging: {
          total: senither.skills.foraging.weight + senither.skills.foraging.weight_overflow,
          weight: senither.skills.foraging.weight,
          weight_overflow: senither.skills.foraging.weight_overflow
        },
        fishing: {
          total: senither.skills.fishing.weight + senither.skills.fishing.weight_overflow,
          weight: senither.skills.fishing.weight,
          weight_overflow: senither.skills.fishing.weight_overflow
        },
        enchanting: {
          total: senither.skills.enchanting.weight + senither.skills.enchanting.weight_overflow,
          weight: senither.skills.enchanting.weight,
          weight_overflow: senither.skills.enchanting.weight_overflow
        },
        alchemy: {
          total: senither.skills.alchemy.weight + senither.skills.alchemy.weight_overflow,
          weight: senither.skills.alchemy.weight,
          weight_overflow: senither.skills.alchemy.weight_overflow
        },
        taming: {
          total: senither.skills.taming.weight + senither.skills.taming.weight_overflow,
          weight: senither.skills.taming.weight,
          weight_overflow: senither.skills.taming.weight_overflow
        }
      },
      slayer: {
        total:
          senither.slayer.revenant.weight +
          senither.slayer.revenant.weight_overflow +
          senither.slayer.tarantula.weight +
          senither.slayer.tarantula.weight_overflow +
          senither.slayer.sven.weight +
          senither.slayer.sven.weight_overflow +
          senither.slayer.enderman.weight +
          senither.slayer.enderman.weight_overflow,
        weight: senither.slayer.revenant.weight + senither.slayer.tarantula.weight + senither.slayer.sven.weight + senither.slayer.enderman.weight,
        weight_overflow:
          senither.slayer.revenant.weight_overflow +
          senither.slayer.tarantula.weight_overflow +
          senither.slayer.sven.weight_overflow +
          senither.slayer.enderman.weight_overflow,
        slayer: {
          revenant: {
            total: senither.slayer.revenant.weight + senither.slayer.revenant.weight_overflow,
            weight: senither.slayer.revenant.weight,
            weight_overflow: senither.slayer.revenant.weight_overflow
          },
          tarantula: {
            total: senither.slayer.tarantula.weight + senither.slayer.tarantula.weight_overflow,
            weight: senither.slayer.tarantula.weight,
            weight_overflow: senither.slayer.tarantula.weight_overflow
          },
          sven: {
            total: senither.slayer.sven.weight + senither.slayer.sven.weight_overflow,
            weight: senither.slayer.sven.weight,
            weight_overflow: senither.slayer.sven.weight_overflow
          },
          enderman: {
            total: senither.slayer.enderman.weight + senither.slayer.enderman.weight_overflow,
            weight: senither.slayer.enderman.weight,
            weight_overflow: senither.slayer.enderman.weight_overflow
          }
        }
      },
      dungeons: {
        total:
          senither.dungeons.catacombs.weight +
          senither.dungeons.catacombs.weight_overflow +
          senither.dungeons.classes.healer.weight +
          senither.dungeons.classes.healer.weight_overflow +
          senither.dungeons.classes.mage.weight +
          senither.dungeons.classes.mage.weight_overflow +
          senither.dungeons.classes.berserk.weight +
          senither.dungeons.classes.berserk.weight_overflow +
          senither.dungeons.classes.archer.weight +
          senither.dungeons.classes.archer.weight_overflow +
          senither.dungeons.classes.tank.weight +
          senither.dungeons.classes.tank.weight_overflow,
        weight:
          senither.dungeons.catacombs.weight +
          senither.dungeons.classes.healer.weight +
          senither.dungeons.classes.mage.weight +
          senither.dungeons.classes.berserk.weight +
          senither.dungeons.classes.archer.weight +
          senither.dungeons.classes.tank.weight,
        weight_overflow:
          senither.dungeons.catacombs.weight_overflow +
          senither.dungeons.classes.healer.weight_overflow +
          senither.dungeons.classes.mage.weight_overflow +
          senither.dungeons.classes.berserk.weight_overflow +
          senither.dungeons.classes.archer.weight_overflow +
          senither.dungeons.classes.tank.weight_overflow,
        catacombs: {
          total: senither.dungeons.catacombs.weight + senither.dungeons.catacombs.weight_overflow,
          weight: senither.dungeons.catacombs.weight,
          weight_overflow: senither.dungeons.catacombs.weight_overflow
        },
        classes: {
          healer: {
            total: senither.dungeons.classes.healer.weight + senither.dungeons.classes.healer.weight_overflow,
            weight: senither.dungeons.classes.healer.weight,
            weight_overflow: senither.dungeons.classes.healer.weight_overflow
          },
          mage: {
            total: senither.dungeons.classes.mage.weight + senither.dungeons.classes.mage.weight_overflow,
            weight: senither.dungeons.classes.mage.weight,
            weight_overflow: senither.dungeons.classes.mage.weight_overflow
          },
          berserk: {
            total: senither.dungeons.classes.berserk.weight + senither.dungeons.classes.berserk.weight_overflow,
            weight: senither.dungeons.classes.berserk.weight,
            weight_overflow: senither.dungeons.classes.berserk.weight_overflow
          },
          archer: {
            total: senither.dungeons.classes.archer.weight + senither.dungeons.classes.archer.weight_overflow,
            weight: senither.dungeons.classes.archer.weight,
            weight_overflow: senither.dungeons.classes.archer.weight_overflow
          },
          tank: {
            total: senither.dungeons.classes.tank.weight + senither.dungeons.classes.tank.weight_overflow,
            weight: senither.dungeons.classes.tank.weight,
            weight_overflow: senither.dungeons.classes.tank.weight_overflow
          }
        }
      }
    }
  };
};
