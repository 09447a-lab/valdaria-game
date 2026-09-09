// ============================================
// AI Opponent
// ============================================

const AI = {
  tick(){
    const diff = GAME_DATA.difficulty[State.get().player.difficulty];
    const p = State.get().player;
    const e = State.get().enemy;

    // دخل دوري
    const income = Economy.computeIncome("enemy");
    const bonus = diff.resourceBonus;
    e.money += Math.floor(income * (1 + bonus));
    e.hunger = Math.min(100, e.hunger + 30);

    // بناء تحصينات أحياناً
    if(Math.random() < 0.3){
      // تعزيز دفاع مدينة عشوائية
    }

    // هجوم دوري
    if(p.round % diff.attackEvery === 0 && p.round > 0){
      // يهاجم البطل
      this.attackPlayer();
    }
  },

  attackPlayer(){
    const p = State.get().player;
    const lost = Math.floor(Math.random() * 3) + 1;
    p.soldiers = Math.max(0, p.soldiers - lost);
    p.log = p.log || [];
    p.log.unshift(`[الجولة ${p.round}] قوات فيلانت هاجمت قاعدة. خسرت ${lost} جنود.`);
    p.log = p.log.slice(0, 20);
    if(p.soldiers <= 0){
      return { event:"player_defeated" };
    }
    return null;
  }
};
