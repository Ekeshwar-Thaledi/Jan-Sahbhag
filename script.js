let verifiedPartner = false;
let currentAccountType = null;
let photoObjectUrls = [];

const CHALLENGES = [
  { title: "Solar drying for lac growers", tag: "Agriculture", district: "Khunti", by: "Kisko Producer Group", state: "Review", stripe: "" },
  { title: "Safe water access during summer months", tag: "Water", district: "Palamu", by: "Gram Sabha, Satbarwa", state: "Routing", stripe: "water" },
  { title: "Maternal health referral access in remote villages", tag: "Healthcare", district: "West Singhbhum", by: "ASHA network", state: "Review", stripe: "health" },
  { title: "Post-harvest storage for vegetable growers", tag: "Agriculture", district: "Ranchi", by: "Ormanjhi Farmers Collective", state: "Routing", stripe: "" },
  { title: "Last-mile transport for schoolchildren in monsoon", tag: "Education", district: "Dhanbad", by: "Panchayat, Baghmara", state: "Review", stripe: "water" },
  { title: "Groundwater recharge for declining hand pumps", tag: "Water", district: "Palamu", by: "Satbarwa Gram Sabha", state: "Assigned", stripe: "water" },
  { title: "Affordable cold storage for tussar cocoons", tag: "Rural livelihoods", district: "Dhanbad", by: "Tribal Cooperative", state: "Review", stripe: "" },
  { title: "Early detection of anaemia in adolescent girls", tag: "Healthcare", district: "Ranchi", by: "ASHA network", state: "Assigned", stripe: "health" }
];

const PROJECTS = [
  { theme: "Water management", title: "Smart village water-point monitoring", by: "BIT Mesra + Jamshedpur Utilities", stage: "Prototype testing", pct: 72 },
  { theme: "Rural livelihoods", title: "Tussar silk quality traceability", by: "IIT (ISM) Dhanbad + Tribal Cooperative", stage: "Field validation", pct: 48 },
  { theme: "Accessibility", title: "Inclusive bus-stop wayfinding", by: "NIFFT + Ranchi Smart City", stage: "Design sprint", pct: 31 },
  { theme: "Agriculture", title: "Cold-chain routing for vegetable growers", by: "Birsa Agricultural University + Krishi Vigyan Kendra", stage: "Pilot deployment", pct: 58 },
  { theme: "Healthcare", title: "Referral tracking for maternal health cases", by: "RIMS Ranchi + ASHA network", stage: "Field validation", pct: 40 },
  { theme: "Water management", title: "Groundwater recharge sensor network", by: "BIT Mesra + Palamu district administration", stage: "Design sprint", pct: 22 }
];

function openModal() {
  document.getElementById("modalback").classList.add("open");
  document.getElementById("challengeText").focus();
}

function closeModal() {
  document.getElementById("modalback").classList.remove("open");
}

function openLogin() {
  if (verifiedPartner) {
    signOut();
    return;
  }

  document.getElementById("loginback").classList.add("open");
}

function signOut() {
  verifiedPartner = false;
  currentAccountType = null;

  const loginBtn = document.getElementById("loginBtn");
  loginBtn.textContent = "Sign in";
  loginBtn.classList.remove("primary");

  showToast("Signed out");
}

function closeLogin() {
  document.getElementById("loginback").classList.remove("open");
}

function openPartnerModal() {
  if (!verifiedPartner) {
    showToast("Sign in as an organisation to offer a solution");
    openLogin();
    return;
  }

  document.getElementById("partnerback").classList.add("open");
}

function closePartnerModal() {
  document.getElementById("partnerback").classList.remove("open");
}

function classify() {
  const value = document.getElementById("challengeText").value.toLowerCase();
  const hint = document.getElementById("aihint");

  let result =
    "AI-assisted routing will appear here as you describe the issue.";

  if (value.length > 15) {
    if (/water|well|tank|drinking/.test(value)) {
      result =
        "Suggested domain: Water resources · Likely match: BIT Mesra, Civil & Environmental Engineering";
    } else if (/farm|crop|farmer|lac|soil/.test(value)) {
      result =
        "Suggested domain: Agriculture · Likely match: Birsa Agricultural University";
    } else if (/health|doctor|clinic|mother/.test(value)) {
      result =
        "Suggested domain: Healthcare · Likely match: RIMS Ranchi";
    } else {
      result =
        "Suggested domain: Community innovation · A reviewer will refine the routing.";
    }
  }

  hint.textContent = result;
  hint.classList.add("show");
}

function clearPhotoPreviews() {
  photoObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  photoObjectUrls = [];
  document.getElementById("attachments").innerHTML = "";
}

function previewPhotos(input) {
  clearPhotoPreviews();

  const attachments = document.getElementById("attachments");
  const files = [...input.files].slice(0, 4);

  if (input.files.length > 4) {
    showToast("Only the first 4 photos were kept");
  }

  files.forEach((file) => {
    const url = URL.createObjectURL(file);
    photoObjectUrls.push(url);

    const image = document.createElement("img");
    image.className = "thumb";
    image.alt = "Selected challenge photo";
    image.src = url;
    attachments.appendChild(image);
  });
}

function submitChallenge(event) {
  event.preventDefault();

  closeModal();
  event.target.reset();

  clearPhotoPreviews();
  document.getElementById("aihint").classList.remove("show");

  showToast("Challenge submitted — reference JH-2026-1842");
}

function updateVerification() {
  const accountType = document.getElementById("accountType").value;
  const note = document.getElementById("verificationNote");

  const verificationNotes = {
    HEI: "Verification required: institutional email domain and designated faculty / innovation-cell authorisation.",
    Government:
      "Verification required: official government email and department nodal-officer authorisation.",
    NGO: "Verification required: organisation email, NGO registration details and authorised signatory approval."
  };

  note.textContent = verificationNotes[accountType];
}

function signIn(event) {
  event.preventDefault();

  const accountType = document.getElementById("accountType").value;

  verifiedPartner = true;
  currentAccountType = accountType;
  closeLogin();
  event.target.reset();
  updateVerification();

  const loginBtn = document.getElementById("loginBtn");
  loginBtn.textContent = `Verified ${accountType} ✓`;
  loginBtn.classList.add("primary");

  showToast("Verified organisation session active");
}

function submitOffer(event) {
  event.preventDefault();

  const publicUpdate = document.getElementById("firstUpdate").value;
  const updatesList = document.getElementById("updatesList");

  const update = document.createElement("div");
  update.className = "update";

  const cleanUpdate = publicUpdate.replace(/[<>]/g, "");

  update.innerHTML = `
    <i class="dot"></i>
    <div>
      <strong>New partner proposal received</strong>
      <span>${cleanUpdate}</span>
    </div>
  `;

  updatesList.prepend(update);

  closePartnerModal();
  event.target.reset();

  showToast("Proposal sent for government review");
}

function toggleDistrictDetails() {
  const extra = document.getElementById("extraDistricts");
  const toggle = document.getElementById("districtToggle");
  const showing = extra.classList.toggle("show");

  toggle.textContent = showing ? "Hide" : "Details";
}

function challengeCard(item) {
  const card = document.createElement("article");
  card.className = "challenge";

  card.innerHTML = `
    <span class="stripe ${item.stripe}"></span>
    <div>
      <h3>${item.title}</h3>
      <p><span class="tag">${item.tag}</span>${item.district} · Submitted by ${item.by}</p>
    </div>
    <span class="state">${item.state}</span>
  `;

  return card;
}

function renderBrowseList() {
  const list = document.getElementById("browseList");
  const district = document.getElementById("browseFilter").value;

  list.innerHTML = "";

  const filtered = CHALLENGES.filter(
    (item) => !district || item.district === district
  );

  if (filtered.length === 0) {
    list.innerHTML =
      '<div class="emptystate">No challenges yet for this district.</div>';
    return;
  }

  filtered.forEach((item) => list.appendChild(challengeCard(item)));
}

function openBrowseModal() {
  const filter = document.getElementById("browseFilter");

  if (filter.options.length === 1) {
    [...new Set(CHALLENGES.map((item) => item.district))]
      .sort()
      .forEach((district) => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        filter.appendChild(option);
      });
  }

  renderBrowseList();
  document.getElementById("browseback").classList.add("open");
}

function closeBrowseModal() {
  document.getElementById("browseback").classList.remove("open");
}

function projectCard(item) {
  const card = document.createElement("article");
  card.className = "project";

  card.innerHTML = `
    <span class="tag">${item.theme}</span>
    <h3>${item.title}</h3>
    <p>${item.by}</p>
    <div class="progresslabel">
      <span>${item.stage}</span>
      <span>${item.pct}%</span>
    </div>
    <div class="progress"><i style="width:${item.pct}%"></i></div>
  `;

  return card;
}

function renderDirectoryList() {
  const list = document.getElementById("directoryList");
  const theme = document.getElementById("directoryFilter").value;

  list.innerHTML = "";

  const filtered = PROJECTS.filter((item) => !theme || item.theme === theme);

  if (filtered.length === 0) {
    list.innerHTML =
      '<div class="emptystate">No projects yet in this theme.</div>';
    return;
  }

  filtered.forEach((item) => list.appendChild(projectCard(item)));
}

function openDirectoryModal() {
  const filter = document.getElementById("directoryFilter");

  if (filter.options.length === 1) {
    [...new Set(PROJECTS.map((item) => item.theme))]
      .sort()
      .forEach((theme) => {
        const option = document.createElement("option");
        option.value = theme;
        option.textContent = theme;
        filter.appendChild(option);
      });
  }

  renderDirectoryList();
  document.getElementById("directoryback").classList.add("open");
}

function closeDirectoryModal() {
  document.getElementById("directoryback").classList.remove("open");
}

function closeAllModals() {
  document
    .querySelectorAll(".modalback.open")
    .forEach((el) => el.classList.remove("open"));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modalback").forEach((back) => {
    back.addEventListener("click", (event) => {
      if (event.target === back) {
        back.classList.remove("open");
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });
});

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4200);
}