// ── DATA ──
function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem("uc_users") || "[]");
  } catch (e) {
    return [];
  }
}
function saveUsers(u) {
  localStorage.setItem("uc_users", JSON.stringify(u));
}
function loadMe() {
  try {
    return JSON.parse(localStorage.getItem("uc_me") || "null");
  } catch (e) {
    return null;
  }
}
function saveMe(u) {
  localStorage.setItem("uc_me", u ? JSON.stringify(u) : "null");
}
if (loadUsers().length === 0) {
  saveUsers([
    {
      id: "2021001",
      name: "রহিম আহমেদ",
      type: "student",
      dept: "CSE",
      password: "1234",
      balance: 250,
    },
    {
      id: "2021002",
      name: "করিম হোসেন",
      type: "student",
      dept: "Math",
      password: "1234",
      balance: 180,
    },
    {
      id: "S001",
      name: "ফারহানা বেগম",
      type: "staff",
      dept: "Admin",
      password: "1234",
      balance: 500,
    },
  ]);
}
let currentUser = loadMe();

// ── JU CAMPUS DATA ──
const LOCS = {
  maingate: { name: "মেইন গেট", lat: 23.8776, lng: 90.2687 },
  "shahid-minar": { name: "শহিদ মিনার", lat: 23.8792, lng: 90.2712 },
  bottola: { name: "বটতলা", lat: 23.8804, lng: 90.2735 },
  srj: { name: "শহিদ রফিক-জব্বার হল", lat: 23.8829, lng: 90.2776 },
  "notun-kola": { name: "নতুন কলা ভবন", lat: 23.8816, lng: 90.2754 },
  "puraton-kola": { name: "পুরাতন কলা ভবন", lat: 23.8841, lng: 90.2791 },
};
const CARTS = [
  {
    id: "UC-101",
    driver: "আব্দুল করিম",
    lat: 23.8776,
    lng: 90.2687,
    passengers: 3,
    capacity: 6,
    status: "active",
    route: "মেইন গেট → শহিদ রফিক-জব্বার হল",
  },
  {
    id: "UC-102",
    driver: "মোহাম্মদ আলী",
    lat: 23.8792,
    lng: 90.2712,
    passengers: 5,
    capacity: 8,
    status: "active",
    route: "মেইন গেট → বিশমাইল",
  },
  {
    id: "UC-103",
    driver: "জামাল উদ্দিন",
    lat: 23.8804,
    lng: 90.2735,
    passengers: 2,
    capacity: 6,
    status: "active",
    route: "প্রান্তিক গেট → শহিদ মিনার",
  },
  {
    id: "UC-104",
    driver: "রফিক মিয়া",
    lat: 23.8829,
    lng: 90.2776,
    passengers: 0,
    capacity: 8,
    status: "inactive",
    route: "বিরতি",
  },
  {
    id: "UC-105",
    driver: "হাসান আলী",
    lat: 23.8841,
    lng: 90.2791,
    passengers: 0,
    capacity: 6,
    status: "inactive",
    route: "বিরতি",
  },
];
const FARES = {
  "maingate-srj": { distance: 1.8, student: 10, staff: 10, guest: 10 },
  "shahid-minar-srj": { distance: 1.2, student: 8, staff: 8, guest: 8 },
  "bottola-srj": { distance: 0.95, student: 5, staff: 5, guest: 5 },
  "maingate-shahid-minar": { distance: 0.6, student: 5, staff: 5, guest: 5 },
  "notun-kola-srj": { distance: 1.4, student: 9, staff: 9, guest: 9 },
  "puraton-kola-srj": { distance: 1.6, student: 10, staff: 10, guest: 10 },
};

// ── MAP ──
let leafMap,
  cartMarkers = [];
function initMap() {
  leafMap = L.map("map").setView([23.8805, 90.2745], 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(leafMap);
  Object.values(LOCS).forEach((loc) => {
    L.marker([loc.lat, loc.lng], {
      icon: L.divIcon({
        className: "",
        html: `<div style="background:rgba(40,167,69,.9);color:white;font-size:10px;font-weight:700;padding:3px 8px;border-radius:5px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.3)">${loc.name}</div>`,
        iconAnchor: [40, 10],
      }),
    }).addTo(leafMap);
  });
  renderMarkers();
  setInterval(moveSim, 3000);
}
function renderMarkers() {
  cartMarkers.forEach((m) => leafMap.removeLayer(m));
  cartMarkers = [];
  CARTS.filter((c) => c.status === "active").forEach((cart) => {
    const p = cart.passengers / cart.capacity;
    const col = p >= 1 ? "#dc3545" : p >= 0.7 ? "#ffc107" : "#28a745";
    const m = L.marker([cart.lat, cart.lng], {
      icon: L.divIcon({
        className: "",
        html: `<div style="background:white;border:3px solid ${col};border-radius:50%;width:44px;height:44px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,.3);cursor:pointer"><span style="font-size:19px">🚗</span><span style="font-size:9px;color:${col};font-weight:700">${cart.passengers}/${cart.capacity}</span></div>`,
        iconAnchor: [22, 22],
      }),
    }).addTo(leafMap);
    m.bindPopup(
      `<div style="text-align:center;font-family:'Segoe UI',sans-serif"><b style="color:#667eea">${cart.id}</b><br>ড্রাইভার: ${cart.driver}<br>যাত্রী: <span style="color:${col};font-weight:700">${cart.passengers}/${cart.capacity}</span><br><small style="color:#888">রুট: ${cart.route}</small></div>`,
    );
    cartMarkers.push(m);
  });
}
function moveSim() {
  CARTS.forEach((c) => {
    if (c.status === "active") {
      c.lat += (Math.random() - 0.5) * 0.0003;
      c.lng += (Math.random() - 0.5) * 0.0003;
      c.lat = Math.min(Math.max(c.lat, 23.875), 23.886);
      c.lng = Math.min(Math.max(c.lng, 90.265), 90.281);
    }
  });
  renderMarkers();
  renderCartList();
  updateStats();
}

// ── STATS ──
function updateStats() {
  const act = CARTS.filter((c) => c.status === "active");
  const pass = CARTS.reduce((s, c) => s + c.passengers, 0);
  const free = act.reduce((s, c) => s + (c.capacity - c.passengers), 0);
  document.getElementById("sTot").textContent = CARTS.length;
  document.getElementById("sAct").textContent = act.length;
  document.getElementById("sPas").textContent = pass;
  document.getElementById("sFre").textContent = free;
}

// ── CART LIST ──
function renderCartList() {
  const con = document.getElementById("cartListContainer");
  con.innerHTML = "";
  CARTS.filter((c) => c.status === "active").forEach((cart) => {
    const p = cart.passengers / cart.capacity;
    const fc = p >= 1 ? "full" : p >= 0.7 ? "mid" : "";
    const free = cart.capacity - cart.passengers;
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `<div class="cart-info">
      <div class="cart-number">${cart.id}</div>
      <div class="cart-status active">চলমান</div>
      <div class="cart-passengers">যাত্রী: ${cart.passengers}/${cart.capacity} &nbsp;|&nbsp; <span style="color:#28a745;font-weight:600">খালি: ${free}</span></div>
      <div class="seat-text"><span>${Math.round(p * 100)}% পূর্ণ</span><span>রুট: ${cart.route}</span></div>
      <div class="seat-bar"><div class="seat-fill ${fc}" style="width:${Math.round(p * 100)}%"></div></div>
    </div>
    <button class="btn-secondary" onclick="trackCart('${cart.id}')">ট্র্যাক করুন</button>`;
    con.appendChild(el);
  });
}
function trackCart(id) {
  const cart = CARTS.find((c) => c.id === id);
  if (!cart) return;
  goTab("map", document.querySelectorAll(".tab-btn")[0]);
  leafMap.setView([cart.lat, cart.lng], 18);
  const idx = CARTS.filter((c) => c.status === "active").findIndex(
    (c) => c.id === id,
  );
  if (cartMarkers[idx]) cartMarkers[idx].openPopup();
}

// ── TAB ──
function goTab(name, btn) {
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById(name + "Tab").classList.add("active");
  if (btn) btn.classList.add("active");
}

// ── AUTH ──
function openAuth() {
  document.getElementById("authModal").classList.add("open");
}
function closeAuth() {
  document.getElementById("authModal").classList.remove("open");
  document.getElementById("qrResultBox").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("regForm").style.display = "none";
  switchMTab("login");
}
function switchMTab(t) {
  document.getElementById("mtLogin").classList.toggle("active", t === "login");
  document.getElementById("mtReg").classList.toggle("active", t === "register");
  document.getElementById("loginForm").style.display =
    t === "login" ? "block" : "none";
  document.getElementById("regForm").style.display =
    t === "register" ? "block" : "none";
  document.getElementById("qrResultBox").style.display = "none";
}
function doLogin() {
  const id = document.getElementById("lId").value.trim();
  const pw = document.getElementById("lPass").value;
  if (!id || !pw) {
    toast("⚠️", "আইডি ও পাসওয়ার্ড লিখুন", "warn");
    return;
  }
  const user = loadUsers().find((u) => u.id === id && u.password === pw);
  if (!user) {
    toast("❌", "ভুল আইডি বা পাসওয়ার্ড!", "err");
    return;
  }
  currentUser = user;
  saveMe(user);
  updateUserUI();
  closeAuth();
  toast("✓", `স্বাগতম, ${user.name}!`, "ok");
}
function doRegister() {
  const Sname = document.getElementById("rName").value.trim();
  const id = document.getElementById("rId").value.trim();
  const type = document.getElementById("rType").value;
  const dept = document.getElementById("rDept").value.trim();
  const pw = document.getElementById("rPass").value;
  if (!Sname || !id || !dept || !pw) {
    toast("⚠️", "সব ঘর পূরণ করুন", "warn");
    return;
  }
  if (pw.length < 6) {
    toast("⚠️", "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে", "warn");
    return;
  }
  const users = loadUsers();
  if (users.find((u) => u.id === id)) {
    toast("❌", "এই আইডি ইতিমধ্যে নিবন্ধিত!", "err");
    return;
  }
  const u = { id, Sname, type, dept, password: pw, balance: 100 };
  fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(u),
  });
  users.push(u);
  saveUsers(users);
  currentUser = u;
  saveMe(u);
  updateUserUI();
  showQR(u);
  toast("✓", "রেজিস্ট্রেশন সফল! QR কোড তৈরি হয়েছে", "ok");
}
function showQR(user) {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("regForm").style.display = "none";
  document.getElementById("qrResultBox").style.display = "block";
  document.getElementById("qrUserName").textContent = user.name;
  document.getElementById("qrUserId").textContent =
    `আইডি: ${user.id} • ${user.type === "student" ? "স্টুডেন্ট" : "স্টাফ"} • ${user.dept}`;
  const div = document.getElementById("qrGenDiv");
  div.innerHTML = "";
  new QRCode(div, {
    text: JSON.stringify({ id: user.id, name: user.name, type: user.type }),
    width: 200,
    height: 200,
    colorDark: "#333",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}
function downloadQR() {
  setTimeout(() => {
    const canvas = document.querySelector("#qrGenDiv canvas");
    if (!canvas) {
      toast("❌", "QR পাওয়া যায়নি", "err");
      return;
    }
    const a = document.createElement("a");
    a.download = `unicart_${currentUser.id}.png`;
    a.href = canvas.toDataURL();
    a.click();
    toast("✓", "QR ডাউনলোড হচ্ছে...", "ok");
  }, 100);
}
function updateUserUI() {
  const btn = document.getElementById("authBtn");
  if (currentUser) {
    document.getElementById("userName").textContent = currentUser.name;
    document.getElementById("userName").className = "loggedin";
    document.getElementById("walBal").textContent = currentUser.balance;
    btn.textContent = "লগআউট";
    btn.onclick = doLogout;
    btn.className = "btn-danger";
  } else {
    document.getElementById("userName").textContent = "রেজিস্ট্রার/ লগইন করুন";
    document.getElementById("userName").className = "";
    btn.textContent = "লগইন";
    btn.onclick = openAuth;
    btn.className = "btn-secondary";
  }
}
function doLogout() {
  currentUser = null;
  saveMe(null);
  updateUserUI();
  toast("👋", "লগআউট সফল", "ok");
}

// ── LIVE QR SCANNER ──
let camStream = null,
  scanLoop = null,
  scannedUser = null;
function toggleCamera() {
  if (camStream) {
    stopCamera();
    return;
  }
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      camStream = stream;
      const v = document.getElementById("videoEl");
      v.srcObject = stream;
      v.classList.add("on");
      document.getElementById("qrPlaceholder").style.display = "none";
      document.getElementById("camBtn").textContent = "📷 ক্যামেরা বন্ধ করুন";
      startLoop();
    })
    .catch(() =>
      toast(
        "❌",
        "ক্যামেরা অ্যাক্সেস দিন অথবা ম্যানুয়াল আইডি ব্যবহার করুন",
        "err",
      ),
    );
}
function stopCamera() {
  if (camStream) {
    camStream.getTracks().forEach((t) => t.stop());
    camStream = null;
  }
  if (scanLoop) {
    cancelAnimationFrame(scanLoop);
    scanLoop = null;
  }
  const v = document.getElementById("videoEl");
  v.classList.remove("on");
  document.getElementById("qrPlaceholder").style.display = "block";
  document.getElementById("camBtn").textContent = "📷 ক্যামেরা চালু করুন";
}
function startLoop() {
  const v = document.getElementById("videoEl"),
    c = document.getElementById("qrCanvas"),
    ctx = c.getContext("2d");
  function tick() {
    if (v.readyState === v.HAVE_ENOUGH_DATA) {
      c.height = v.videoHeight;
      c.width = v.videoWidth;
      ctx.drawImage(v, 0, 0, c.width, c.height);
      const img = ctx.getImageData(0, 0, c.width, c.height);
      const code = jsQR(img.data, img.width, img.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        try {
          const data = JSON.parse(code.data);
          if (data.id && data.name) {
            const user = loadUsers().find((u) => u.id === data.id);
            if (user) {
              showScanResult(user);
              stopCamera();
              return;
            } else toast("❌", "অজানা QR — নিবন্ধিত নয়", "err");
          }
        } catch (e) {
          toast("⚠️", "QR পড়া যাচ্ছে না", "warn");
        }
      }
    }
    scanLoop = requestAnimationFrame(tick);
  }
  scanLoop = requestAnimationFrame(tick);
}
function verifyManual() {
  const id = document.getElementById("manId").value.trim();
  if (!id) {
    toast("⚠️", "আইডি লিখুন", "warn");
    return;
  }
  const user = loadUsers().find((u) => u.id === id);
  if (!user) {
    toast("❌", "এই আইডি নিবন্ধিত নয়", "err");
    return;
  }
  showScanResult(user);
}
function showScanResult(user) {
  scannedUser = user;
  document.getElementById("sName").textContent = user.name;
  document.getElementById("sId").textContent = user.id;
  document.getElementById("sType").textContent =
    user.type === "student" ? "🎓 স্টুডেন্ট" : "👨‍💼 স্টাফ";
  document.getElementById("sBal").textContent = user.balance;
  document.getElementById("scanResult").style.display = "block";
  toast("✓", `${user.name} যাচাই সম্পন্ন`, "ok");
}
function confirmBoard() {
  if (!scannedUser) return;
  const cart = CARTS.find(
    (c) => c.status === "active" && c.passengers < c.capacity,
  );
  if (cart) {
    cart.passengers++;
    renderCartList();
    updateStats();
    renderMarkers();
  }
  toast("🚗", `${scannedUser.name} সফলভাবে বোর্ড হয়েছেন!`, "ok");
  cancelScan();
}
function cancelScan() {
  scannedUser = null;
  document.getElementById("scanResult").style.display = "none";
  document.getElementById("manId").value = "";
}

// ── FARE ──
function calculateFare() {
  const from = document.getElementById("fromLocation").value;
  const to = document.getElementById("toLocation").value;
  const type = document.getElementById("userType").value;
  if (!from || !to) {
    toast("⚠️", "শুরু ও গন্তব্য নির্বাচন করুন", "warn");
    return;
  }
  if (from === to) {
    toast("⚠️", "একই স্থান নির্বাচন করা যাবে না", "warn");
    return;
  }
  const rule = FARES[`${from}-${to}`] || FARES[`${to}-${from}`];
  let dist = 1.0,
    fare = type === "student" ? 8 : type === "staff" ? 9 : 10;
  if (rule) {
    dist = rule.distance;
    fare = rule[type];
  }
  const names = { student: "স্টুডেন্ট", staff: "স্টাফ", guest: "অতিথি" };
  document.getElementById("fareDistance").textContent = dist + " km";
  document.getElementById("fareType").textContent = names[type];
  document.getElementById("totalFare").textContent = "৳" + fare;
  document.getElementById("fareResult").style.display = "block";
}

// ── TOPUP ──
function openTopup() {
  if (!currentUser) {
    toast("⚠️", "প্রথমে লগইন করুন", "warn");
    openAuth();
    return;
  }
  document.getElementById("topupModal").classList.add("open");
}
function closeTopup() {
  document.getElementById("topupModal").classList.remove("open");
}
function setTP(v) {
  document.getElementById("tpAmt").value = v;
}
function doTopup() {
  const amt = parseFloat(document.getElementById("tpAmt").value);
  if (!amt || amt <= 0) {
    toast("⚠️", "সঠিক পরিমাণ লিখুন", "warn");
    return;
  }
  currentUser.balance += amt;
  const users = loadUsers(),
    i = users.findIndex((u) => u.id === currentUser.id);
  if (i > -1) {
    users[i].balance = currentUser.balance;
    saveUsers(users);
  }
  saveMe(currentUser);
  document.getElementById("walBal").textContent = currentUser.balance;
  closeTopup();
  toast("💰", `৳${amt} সফলভাবে যোগ হয়েছে!`, "ok");
}

// ── TOAST ──
function toast(icon, msg, type = "ok") {
  const t = document.getElementById("toast");
  document.getElementById("t-ico").textContent = icon;
  document.getElementById("t-msg").textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 3200);
}

// ── INIT ──
window.onload = () => {
  initMap();
  renderCartList();
  updateStats();
  updateUserUI();
  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("open");
    });
  });
  setInterval(() => {
    document.querySelectorAll(".stat-value").forEach((s) => {
      s.style.transform = "scale(1.1)";
      setTimeout(() => (s.style.transform = "scale(1)"), 200);
    });
  }, 5000);
};
