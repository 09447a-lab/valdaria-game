// ============================================
// الأسواق
// ============================================

const Market = {
  // شراء من سوق (عام)
  buy(category, key, qty = 1){
    const sets = {
      food: GAME_DATA.food,
      clothes: GAME_DATA.clothes,
      vehicles: GAME_DATA.vehicles,
      weapons: GAME_DATA.weapons
    };
    const item = sets[category]?.[key];
    if(!item) return { ok:false, msg:"منتج غير معروف" };
    const p = State.get().player;
    const total = item.price * qty;
    if(p.money < total) return { ok:false, msg:`تحتاج ${total - p.money} أكثر` };

    if(category === "weapons"){
      if(item.illegal) return { ok:false, msg:"هذا سلاح محظور، استخدم نظام التهريب" };
      p.weapons[key] = p.weapons[key] || { qty:0, ammo:0 };
      p.weapons[key].qty += qty;
      p.weapons[key].ammo += item.ammo * qty;
    } else if(category === "vehicles"){
      p.vehicles[key] = (p.vehicles[key] || 0) + qty;
    } else if(category === "clothes"){
      p.clothes = key;
    } else {
      // food handled by Hunger.feed
      return Hunger.feed("player", key, qty);
    }
    p.money -= total;
    return { ok:true, msg:`تم شراء ${item.name}` };
  },

  // شراء ذخيرة
  buyAmmo(weaponKey, qty = 1){
    const w = GAME_DATA.weapons[weaponKey];
    if(!w) return { ok:false, msg:"سلاح غير معروف" };
    const p = State.get().player;
    const total = w.ammoCost * w.ammo * qty;
    if(p.money < total) return { ok:false, msg:`تحتاج ${total - p.money} أكثر` };
    p.weapons[weaponKey] = p.weapons[weaponKey] || { qty:0, ammo:0 };
    p.weapons[weaponKey].qty += qty;
    p.weapons[weaponKey].ammo += w.ammo * qty;
    p.money -= total;
    return { ok:true, msg:`تم شراء ${qty}× ${w.name} + ذخيرة كاملة` };
  }
};
