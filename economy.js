// ============================================
// نظام الاقتصاد
// ============================================

const Economy = {
  // بناء مصدر دخل
  buildSource(key){
    const src = GAME_DATA.incomeSources[key];
    if(!src) return { ok:false, msg:"مصدر غير معروف" };
    const p = State.get().player;
    if(p.money < src.cost) return { ok:false, msg:`تحتاج ${src.cost - p.money} أكثر` };
    p.money -= src.cost;
    p.income.push({ key, built: true, destroyed: false });
    return { ok:true, msg:`تم بناء ${src.name}. العائد ${src.yield} كل جولة` };
  },

  // تدمير مصدر دخل
  destroySource(playerOrEnemy, idx){
    const data = State.get()[playerOrEnemy];
    const src = data.income[idx];
    if(!src) return;
    src.destroyed = true;
  },

  // حساب الدخل الصافي
  computeIncome(playerOrEnemy){
    const data = State.get()[playerOrEnemy];
    if(!data.income) return 0;
    return data.income.reduce((sum, s) => {
      const src = GAME_DATA.incomeSources[s.key];
      if(!src) return sum;
      if(s.destroyed) return sum + Math.floor(src.yield * 0.3); // 30% بعد التدمير
      return sum + src.yield;
    }, 0);
  },

  // إنفاق
  spend(playerOrEnemy, amount){
    const data = State.get()[playerOrEnemy];
    if(data.money < amount) return { ok:false };
    data.money -= amount;
    return { ok:true };
  },

  // كسب
  earn(playerOrEnemy, amount){
    State.get()[playerOrEnemy].money += amount;
  }
};
