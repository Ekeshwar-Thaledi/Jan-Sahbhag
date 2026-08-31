let verifiedPartner = false;

function openModal() {
  document.getElementById("modalback").classList.add("open");
  document.getElementById("challengeText").focus();
}

function closeModal() {
  document.getElementById("modalback").classList.remove("open");
}

function openLogin() {
  document.getElementById("loginback").classList.add("open");
}

function closeLogin() {
  document.getElementById("loginback").classList.remove("open");
}

function openPartnerModal() {
  if (!verifiedPartner) {
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

function previewPhotos(input) {
  const attachments = document.getElementById("attachments");
  attachments.innerHTML = "";

  [...input.files].slice(0, 4).forEach((file) => {
    const image = document.createElement("img");
    image.className = "thumb";
    image.alt = "Selected challenge photo";
    image.src = URL.createObjectURL(file);
    attachments.appendChild(image);
  });
}

function submitChallenge(event) {
  event.preventDefault();

  closeModal();
  event.target.reset();

  document.getElementById("attachments").innerHTML = "";
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
  closeLogin();
  event.target.reset();

  document.getElementById("loginBtn").textContent =
    `Verified ${accountType} ✓`;

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

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4200);
}