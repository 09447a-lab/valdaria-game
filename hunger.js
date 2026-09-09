// ============================================
// نظام الأكل والصحة
// ============================================

const Hunger = {
  // تطبيق الأكل على شخصية (لاعب أو جنود)
  feed(playerOrEnemy, foodKey, qty = 1){
    const data = State.get()[playerOrEnemy];
    const food = GAME_DATA.food[foodKey];
    if(!food) return { ok:false, msg:"طعام غير معروف" };
    const total = food.price * qty;
    if(data.money < total) return { ok:false, msg:`تحتاج ${total - data.money} أكثر` };
    data.money -= total;
    if(playerOrEnemy === "player"){
      data.food[foodKey] = (data.food[foodKey] || 0) + qty;
    }
    return { ok:true, msg:`تم شراء ${qty}× ${food.name}` };
  },

  // استهلاك الطعام لكل جولة
  consume(playerOrEnemy){
    const data = State.get()[playerOrEnemy];
    if(playerOrEnemy === "player"){
      // استهلاك جنود البطل
      const need = data.soldiers * 20; // كل جندي يحتاج 20 وحدة جوع
      let remaining = need;
      const order = ["cooked","meat","fruit","veggies","bread","bulk"];
      for(const fk of order){
        if(remaining <= 0) break;
        if(data.food[fk] > 0){
          const food = GAME_DATA.food[fk];
          const totalFood = data.food[fk] * food.hunger;
          if(totalFood >= remaining){
            const used = Math.ceil(remaining / food.hunger);
            data.food[fk] -= used;
            remaining = 0;
          } else {
            remaining -= totalFood;
            data.food[fk] = 0;
          }
        }
      }
      data.soldiersHunger = Math.max(0, 100 - Math.floor(remaining / (data.soldiers * 0.2)));
      if(data.soldiersHunger <= 0){
        // جنود يموتون
        const dead = Math.ceil(data.soldiers * 0.2);
        data.soldiers = Math.max(0, data.soldiers - dead);
        return { event:"soldiers_died", count: dead };
      }
    } else {
      // العدو: يفقد جوع أقل
      data.hunger = Math.max(0, data.hunger - 3);
      if(data.hunger <= 0) return { event:"enemy_died" };
    }
    return null;
  },

  // جوع اللاعب نفسه
  tickPlayer(){
    const p = State.get().player;
    p.hunger = Math.max(0, p.hunger - p.hungerDecay);
    if(p.hunger <= 0) return { event:"player_died" };
    return null;
  }
};
