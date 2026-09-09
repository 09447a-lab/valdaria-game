// ============================================
// نظام تهريب الأسلحة
// ============================================

const Smuggling = {
  attempt(weaponKey, difficultyKey){
    const weapon = GAME_DATA.weapons[weaponKey];
    if(!weapon) return { ok:false, msg:"سلاح غير معروف" };
    if(!weapon.illegal) return { ok:false, msg:"هذا السلاح متوفر في السوق الرسمي" };

    const diff = GAME_DATA.smuggling[difficultyKey];
    if(!diff) return { ok:false, msg:"مستوى صعوبة غير معروف" };

    const p = State.get().player;
    const total = weapon.price * 2; // سعر السوق السوداء ضعف

    if(p.money < total) return { ok:false, msg:`تحتاج ${total - p.money} أكثر` };

    // رمي النرد
    const roll = Math.random();
    if(roll < diff.success){
      // نجاح
      p.money -= total;
      p.weapons[weaponKey] = p.weapons[weaponKey] || { qty:0, ammo:0 };
      p.weapons[weaponKey].qty += 1;
      p.weapons[weaponKey].ammo += weapon.ammo;
      return { ok:true, msg:`✅ تهريب ناجح عبر "${diff.name}". تم الحصول على ${weapon.name}.` };
    } else {
      // فشل - المخاطرة على المشتري
      const fineRoll = Math.random();
      if(fineRoll < 0.5){
        // اعتقال
        p.money = Math.max(0, p.money - diff.fine);
        p.soldiers = Math.max(0, p.soldiers - 2);
        return { ok:false, msg:`❌ ${diff.msg}. خسرت ${diff.fine} و 2 جنود.` };
      } else if(fineRoll < 0.85){
        // مصادرة
        p.money = Math.max(0, p.money - diff.fine);
        return { ok:false, msg:`❌ ${diff.msg}. خسرت ${diff.fine}.` };
      } else {
        // مطاردة
        p.money = Math.max(0, p.money - diff.fine);
        return { ok:false, msg:`❌ ${diff.msg}. الشرطة تلاحقك. خسرت ${diff.fine}.` };
      }
    }
  }
};
