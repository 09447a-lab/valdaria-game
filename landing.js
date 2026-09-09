// ============================================
// صفحة الهبوط (index.html)
// ============================================

(function(){
  // تعبئة حالة الزر تحميل
  const loadBtn = document.getElementById("btn-load");
  if(Storage.has()) loadBtn.disabled = false;

  // أحداث
  document.getElementById("btn-new").addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim() || "أليكس";
    const difficulty = document.getElementById("difficulty").value;
    sessionStorage.setItem("new_game", JSON.stringify({ name, difficulty }));
    window.location.href = "game.html";
  });

  document.getElementById("btn-load").addEventListener("click", () => {
    sessionStorage.setItem("load_game", "1");
    window.location.href = "game.html";
  });

  document.getElementById("btn-archive").addEventListener("click", () => {
    window.open("secret.html", "_blank");
  });
})();
