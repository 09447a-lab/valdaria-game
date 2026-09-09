// ============================================
// نظام المعارك
// ============================================

const Battle = {
  // حساب القوة
  computeArmyPower(force){
    let power = 0;
    const weapons = force.weapons || {};
    Object.entries(weapons).forEach(([wkey, w]) => {
      const def = GAME_DATA.weapons[wkey];
      if(!def) return;
      power += def.power * w.qty;
    });
    if(!Object.keys(weapons).length && force.soldiers){
      power = force.soldiers * 3; // سلاح افتراضي ضعيف
    }
    return power;
  },

  // القوة الكلية (مع عوامل)
  totalPower(force, opts = {}){
    let power = this.computeArmyPower(force);
    const hungerFactor = (force.soldiersHunger || 100) / 100;
    const defenseFactor = (opts.defense || 0) / 100 + 1;
    const ammoFactor = Math.min(1, (force.totalAmmo || 1) / 30);
    return power * hungerFactor * defenseFactor * ammoFactor;
  },

  totalAmmo(force){
    let total = 0;
    Object.values(force.weapons || {}).forEach(w => total += w.ammo || 0);
    return total;
  },

  // محاكاة معركة
  simulate(attacker, defender, options){
    // options: { strategy, ammoStage, isPlayerAttacking }
    const strat = GAME_DATA.strategies[options.strategy] || GAME_DATA.strategies.frontal;
    const ammoStage = GAME_DATA.ammoStages[options.ammoStage] || GAME_DATA.ammoStages[1];

    const aPower = this.totalPower(attacker) * strat.power * ammoStage.powerMod;
    const dPower = this.totalPower(defender, { defense: 50 }) * strat.defense;

    // استهلاك ذخيرة
    const ammoUsed = Math.ceil(this.totalAmmo(attacker) * (1 - ammoStage.save) * strat.ammo);
    attacker.weapons && Object.values(attacker.weapons).forEach(w => {
      const used = Math.min(ammoUsed, w.ammo || 0);
      w.ammo = Math.max(0, (w.ammo || 0) - used);
    });

    // استنزاف ذخيرة العدو (المرحلة 3)
    if(ammoStage.enemyDrain > 0){
      Object.values(defender.weapons || {}).forEach(w => {
        w.ammo = Math.max(0, Math.floor((w.ammo || 0) * (1 - ammoStage.enemyDrain)));
      });
    }

    const aPowerFinal = aPower;
    const dPowerFinal = dPower;

    const winner = aPowerFinal > dPowerFinal ? "attacker" : "defender";

    return {
      winner,
      attackerPower: Math.round(aPowerFinal),
      defenderPower: Math.round(dPowerFinal),
      strategy: strat.name,
      ammoStage: ammoStage.name,
      ammoSaved: ammoStage.save
    };
  }
};
