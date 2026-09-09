// ============================================
// التحصينات
// ============================================

const Fortification = {
  builds: {},  // { cityId: { sandbag: 3, trench: 1, ... } }
  currentBuild: null,  // { cityId, fortKey, endTime }
  buildTimer: null,

  start(cityId, fortKey){
    const fort = GAME_DATA.fortifications[fortKey];
    const p = State.get().player;
    if(!fort) return { ok:false, msg:"تحصين غير معروف" };
    if(p.money < fort.cost) return { ok:false, msg:`تحتاج ${fort.cost - p.money} أكثر` };
    if(this.currentBuild) return { ok:false, msg:"يوجد بناء قيد التنفيذ بالفعل" };

    p.money -= fort.cost;
    this.currentBuild = {
      cityId, fortKey,
      endTime: Date.now() + fort.buildTime * 1000
    };

    return { ok:true, msg:`بدأ بناء ${fort.name} (${fort.buildTime} ثانية)`, time: fort.buildTime };
  },

  // استدعى كل ثانية من tick
  tick(callback){
    if(!this.currentBuild) return;
    const remaining = Math.max(0, this.currentBuild.endTime - Date.now());
    if(remaining === 0){
      const { cityId, fortKey } = this.currentBuild;
      this.builds[cityId] = this.builds[cityId] || {};
      this.builds[cityId][fortKey] = (this.builds[cityId][fortKey] || 0) + 1;
      const fort = GAME_DATA.fortifications[fortKey];
      this.currentBuild = null;
      callback && callback({ done:true, msg:`✅ تم بناء ${fort.name}` });
    } else {
      callback && callback({ done:false, remaining: Math.ceil(remaining/1000) });
    }
  },

  // مجموع مكافأة الدفاع لموقع
  getDefense(cityId){
    const builds = this.builds[cityId] || {};
    return Object.entries(builds).reduce((sum, [k, n]) => {
      return sum + (GAME_DATA.fortifications[k].defense * n);
    }, 0);
  }
};
