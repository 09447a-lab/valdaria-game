// ============================================
// الخريطة التفاعلية SVG
// ============================================

const MapView = {
  svg: null,
  viewBox: { x:0, y:0, w:1000, h:600 },
  zoom: 1,
  isDragging: false,
  dragStart: null,

  init(svgEl, onLocationClick){
    this.svg = svgEl;
    this.svg.setAttribute("viewBox", `0 0 1000 600`);
    this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    this.render();
    this.attachEvents(onLocationClick);
  },

  render(){
    const svg = this.svg;
    svg.innerHTML = "";

    // خلفية الأرض
    const land = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    land.setAttribute("x",0); land.setAttribute("y",0);
    land.setAttribute("width",1000); land.setAttribute("height",600);
    land.setAttribute("fill","#d8cda8");
    svg.appendChild(land);

    // خطوط حدودية
    const border = document.createElementNS("http://www.w3.org/2000/svg", "path");
    border.setAttribute("d","M 50 50 Q 200 30 400 60 T 800 50 L 950 80 L 960 250 L 920 350 L 950 480 L 880 560 L 600 580 L 350 570 L 150 540 L 60 450 L 30 250 L 50 50 Z");
    border.setAttribute("fill","#c2b482");
    border.setAttribute("stroke","#7a6a3e");
    border.setAttribute("stroke-width","2");
    border.setAttribute("stroke-dasharray","6 4");
    svg.appendChild(border);

    // أنهار
    const river = document.createElementNS("http://www.w3.org/2000/svg", "path");
    river.setAttribute("d","M 0 350 Q 200 320 400 380 T 800 350 L 1000 360");
    river.setAttribute("fill","none");
    river.setAttribute("stroke","#5a8db5");
    river.setAttribute("stroke-width","6");
    river.setAttribute("opacity","0.7");
    svg.appendChild(river);

    // جبال (للمدينة المحصنة)
    const mountain = document.createElementNS("http://www.w3.org/2000/svg", "path");
    mountain.setAttribute("d","M 30 100 L 80 50 L 130 100 L 180 50 L 230 100 L 200 130 L 60 130 Z");
    mountain.setAttribute("fill","#8a7a5a");
    mountain.setAttribute("stroke","#5a4a2a");
    mountain.setAttribute("stroke-width","1.5");
    svg.appendChild(mountain);

    // القرى
    GAME_DATA.villages.forEach(v => {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx",v.x); c.setAttribute("cy",v.y); c.setAttribute("r",5);
      c.setAttribute("fill","#6a5a2a");
      c.setAttribute("stroke","#3a2a0a");
      c.setAttribute("stroke-width","1");
      c.setAttribute("data-id",v.id);
      c.setAttribute("data-type","village");
      c.setAttribute("class","map-marker");
      c.style.cursor = "pointer";
      svg.appendChild(c);
    });

    // المطارات
    GAME_DATA.airports.forEach(a => {
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x",a.x); t.setAttribute("y",a.y-12);
      t.setAttribute("text-anchor","middle");
      t.setAttribute("font-size","14");
      t.textContent = "✈";
      t.setAttribute("data-id",a.id);
      t.setAttribute("data-type","airport");
      t.setAttribute("class","map-marker");
      t.style.cursor = "pointer";
      svg.appendChild(t);
    });

    // مراكز الشرطة
    GAME_DATA.policeStations.forEach(p => {
      const star = document.createElementNS("http://www.w3.org/2000/svg", "text");
      star.setAttribute("x",p.x+10); star.setAttribute("y",p.y+4);
      star.setAttribute("font-size","12");
      star.textContent = "★";
      star.setAttribute("fill","#1a3a5a");
      star.setAttribute("data-id",p.id);
      star.setAttribute("data-type","police");
      star.setAttribute("class","map-marker");
      star.style.cursor = "pointer";
      svg.appendChild(star);
    });

    // المدن
    GAME_DATA.cities.forEach(city => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("data-id",city.id);
      g.setAttribute("data-type","city");
      g.setAttribute("class","map-marker");
      g.style.cursor = "pointer";

      // الدائرة الخارجية
      const outer = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      outer.setAttribute("cx",city.x); outer.setAttribute("cy",city.y);
      outer.setAttribute("r", city.type === "fortress" ? 18 : (city.type === "capital" ? 16 : 12));
      outer.setAttribute("fill", city.type === "fortress" ? "#B08D57" : (city.type === "capital" ? "#8C1C13" : "#2B3A42"));
      outer.setAttribute("stroke","#14120F");
      outer.setAttribute("stroke-width","2");
      g.appendChild(outer);

      // الأيقونة
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "text");
      icon.setAttribute("x",city.x); icon.setAttribute("y",city.y+5);
      icon.setAttribute("text-anchor","middle");
      icon.setAttribute("font-size", city.type === "fortress" ? "14" : "12");
      icon.setAttribute("fill","#fff");
      icon.textContent = city.type === "fortress" ? "⛫" : (city.type === "capital" ? "♛" : "■");
      g.appendChild(icon);

      // التسمية
      const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
      lbl.setAttribute("x",city.x); lbl.setAttribute("y",city.y + (city.type === "fortress" ? 36 : 28));
      lbl.setAttribute("text-anchor","middle");
      lbl.setAttribute("font-size","11");
      lbl.setAttribute("font-family","Tajawal, sans-serif");
      lbl.setAttribute("font-weight","700");
      lbl.setAttribute("fill","#14120F");
      lbl.textContent = city.name;
      g.appendChild(lbl);

      svg.appendChild(g);
    });

    // عنوان
    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x",500); title.setAttribute("y",30);
    title.setAttribute("text-anchor","middle");
    title.setAttribute("font-family","Amiri, serif");
    title.setAttribute("font-size","22");
    title.setAttribute("font-weight","700");
    title.setAttribute("fill","#14120F");
    title.textContent = "جمهورية فالداريا";
    svg.appendChild(title);
  },

  attachEvents(onClick){
    this.svg.querySelectorAll(".map-marker").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = el.getAttribute("data-id");
        const type = el.getAttribute("data-type");
        onClick && onClick({ id, type });
      });
    });

    // pan
    this.svg.addEventListener("mousedown", e => {
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener("mouseup", () => { this.isDragging = false; });
    this.svg.addEventListener("mousemove", e => {
      if(!this.isDragging) return;
      const dx = (this.dragStart.x - e.clientX) * 1.5;
      const dy = (this.dragStart.y - e.clientY) * 1.5;
      const vb = this.svg.viewBox.baseVal;
      this.svg.setAttribute("viewBox", `${vb.x + dx} ${vb.y + dy} ${vb.width} ${vb.height}`);
      this.dragStart = { x: e.clientX, y: e.clientY };
    });
  },

  zoomIn(){
    const vb = this.svg.viewBox.baseVal;
    const w = vb.width * 0.85;
    const h = vb.height * 0.85;
    this.svg.setAttribute("viewBox", `${vb.x + (vb.width-w)/2} ${vb.y + (vb.height-h)/2} ${w} ${h}`);
  },

  zoomOut(){
    const vb = this.svg.viewBox.baseVal;
    const w = Math.min(1000, vb.width * 1.2);
    const h = Math.min(600, vb.height * 1.2);
    this.svg.setAttribute("viewBox", `${vb.x - (w-vb.width)/2} ${vb.y - (h-vb.height)/2} ${w} ${h}`);
  },

  reset(){
    this.svg.setAttribute("viewBox","0 0 1000 600");
  }
};
