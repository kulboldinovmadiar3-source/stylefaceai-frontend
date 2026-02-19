let hairstyles = [];
let currentIndex = 0;
let currentFaceShape = null;
let startX = 0;

// ---------------------
// SCROLL TO UPLOAD
// ---------------------
document.querySelector(".hero-btn")?.addEventListener("click", () => {
  document.querySelector("#upload")?.scrollIntoView({ behavior: "smooth" });
});

// ---------------------
// FACE SHAPE NORMALIZE
// ---------------------
const faceShapeTranslator = {
  "овальная": "oval",
  "круглая": "round",
  "квадратная": "square",
  "прямоугольная": "rectangle",
  "вытянутая": "long",
  "сердцевидная": "heart",
  "ромбовидная": "diamond",
  "треугольная": "triangle",

  "oval": "oval",
  "round": "round",
  "square": "square",
  "rectangle": "rectangle",
  "long": "long",
  "heart": "heart",
  "diamond": "diamond",
  "triangle": "triangle"
};

function normalizeFaceShape(faceShape) {
  if (!faceShape) return null;

  let shape = String(faceShape).toLowerCase().trim();

  shape = shape
    .replace("форма", "")
    .replace("лица", "")
    .replace("лицо", "")
    .trim();

  return faceShapeTranslator[shape] || null;
}

// ---------------------
// PHOTO PREVIEW
// ---------------------
document.getElementById("fileInput")?.addEventListener("change", function () {
  const file = this.files?.[0];
  const preview = document.getElementById("preview");
  const uploadText = document.getElementById("uploadText");

  if (!preview || !uploadText) return;

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    uploadText.style.display = "none";
  }
});

// ---------------------
// BACKEND ANALYZE (FLASK)
// ---------------------
async function uploadImage() {
  document.body.classList.add("loading");
  try {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput?.files?.[0];

    if (!file) {
      alert("Выберите фотографию");
      return;
    }

    const resultCard = document.getElementById("resultCard");
    const hairstylesContainer = document.getElementById("hairstyleContainer");
    const panel = document.getElementById("analysisPanel");

    if (panel) panel.classList.add("visible");

    if (resultCard) {
      resultCard.innerHTML = `<p>Анализируем...</p>`;
    }
    if (hairstylesContainer) {
      hairstylesContainer.innerHTML = "";
    }

    const formData = new FormData();
    formData.append("file", file);

    // ✅ ВОТ ЧЕГО ТЕБЕ НЕ ХВАТАЛО: fetch + response
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();

    currentFaceShape = normalizeFaceShape(result.face_shape);

    if (!currentFaceShape) {
      if (resultCard) resultCard.innerHTML = "<p>Не удалось определить форму лица</p>";
      return;
    }

    // 👉 КАРТОЧКА ФОРМЫ ЛИЦА
    if (resultCard) {
      resultCard.innerHTML = `
        <div class="face-shape-box">
          <img src="assets/face-shapes/${currentFaceShape}.jpg" alt="${currentFaceShape}">
          <div>
            <h2>Форма лица</h2>
            <p><strong>${result.face_shape}</strong></p>
          </div>
        </div>
      `;
    }

    loadHairstyles(currentFaceShape);

  } catch (error) {
    console.error(error);
    const resultCard = document.getElementById("resultCard");
    if (resultCard) resultCard.innerHTML = "<p>Ошибка анализа (проверь Console и Flask)</p>";
  }
  document.body.classList.remove("loading");
}

// делаем функцию доступной для onclick в HTML
window.uploadImage = uploadImage;

// ---------------------
// HAIRSTYLES DATABASE
// ---------------------
const hairstylesDatabase = {
  oval: [
    { name: "Помпадур", image: "assets/hairstyles/oval1.jpg" },
    { name: "Андеркат", image: "assets/hairstyles/oval2.jpg" },
    { name: "Side Part", image: "assets/hairstyles/square2.jpg" },
    { name: "Текстурированная длина", image: "assets/hairstyles/diamond1.jpg" }
  ],
  round: [
    { name: "Квифф", image: "assets/hairstyles/round1.jpg" },
    { name: "Высокий фейд", image: "assets/hairstyles/round2.jpg" },
    { name: "Объем сверху", image: "assets/hairstyles/round3.jpg" }
  ],
  square: [
    { name: "Текстурированный кроп", image: "assets/hairstyles/square1.jpg" },
    { name: "Side Part", image: "assets/hairstyles/diamond3.jpg" },
    { name: "Классический фейд", image: "assets/hairstyles/square3.jpg" }
  ],
  rectangle: [
    { name: "Средняя длина", image: "assets/hairstyles/rectangle2.jpg" },
    { name: "Слоистая укладка", image: "assets/hairstyles/rectangle3.jpg" }
  ],
  long: [
    { name: "Средняя длина", image: "assets/hairstyles/rectangle2.jpg" },
    { name: "Слоистая укладка", image: "assets/hairstyles/rectangle3.jpg" }
  ],
  heart: [
    { name: "Средняя длина", image: "assets/hairstyles/heart2.jpg" },
    { name: "Небрежная укладка", image: "assets/hairstyles/heart3.jpg" }
  ],
  diamond: [
    { name: "Текстурированная длина", image: "assets/hairstyles/diamond1.jpg" },
    { name: "Объемная челка", image: "assets/hairstyles/diamond2.jpg" }
  ],
  triangle: [
    { name: "Объем сверху", image: "assets/hairstyles/triangle1.jpg" },
    { name: "Квифф", image: "assets/hairstyles/round1.jpg" }
  ]
};

// ---------------------
// HAIRSTYLES UI
// ---------------------
function loadHairstyles(faceShape) {
  hairstyles = hairstylesDatabase[faceShape] || [];
  currentIndex = 0;
  showHairstyle();
}

function showHairstyle() {
  const container = document.getElementById("hairstyleContainer");
  if (!container) return;

  if (hairstyles.length === 0) {
    container.innerHTML = "<p>Нет рекомендаций</p>";
    return;
  }

  const style = hairstyles[currentIndex];

  container.innerHTML = `
    <h2>Рекомендуемая прическа</h2>
    <div class="slider">
      <button class="nav-btn left" onclick="prevHairstyle()">‹</button>
      <div class="slide fade">
        <img src="${style.image}" alt="${style.name}">
        <p>${style.name}</p>
      </div>
      <button class="nav-btn right" onclick="nextHairstyle()">›</button>
    </div>
  `;
}

function nextHairstyle() {
  currentIndex = (currentIndex + 1) % hairstyles.length;
  showHairstyle();
}

function prevHairstyle() {
  currentIndex = (currentIndex - 1 + hairstyles.length) % hairstyles.length;
  showHairstyle();
}

window.nextHairstyle = nextHairstyle;
window.prevHairstyle = prevHairstyle;

// ---------------------
// SWIPE
// ---------------------
const hsEl = document.getElementById("hairstyleContainer");
hsEl?.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
hsEl?.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  if (Math.abs(diff) > 40) diff > 0 ? nextHairstyle() : prevHairstyle();
});

// ---------------------
// BURGER MENU
// ---------------------
const burger = document.getElementById("burger");
const navMenu = document.getElementById("navMenu");

burger?.addEventListener("click", () => {
  burger.classList.toggle("active");
  navMenu?.classList.toggle("active");
});

// ACTIVE LINK
document.querySelectorAll(".nav-link").forEach(link => {
  if (link.href === window.location.href) link.classList.add("active");
});

// NAVBAR SCROLL
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  window.scrollY > 40 ? navbar.classList.add("scrolled") : navbar.classList.remove("scrolled");
});
