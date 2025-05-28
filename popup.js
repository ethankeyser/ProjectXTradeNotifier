document.getElementById("save").addEventListener("click", () => {
  const webhook = document.getElementById("webhook").value.trim();
  const username = document.getElementById("username").value.trim();

  chrome.storage.local.set({ webhook, username }, () => {
    document.getElementById("status").textContent = "✅ Saved!";
  });

  console.log("Saved webhook:", webhook);
});

// Load saved values
chrome.storage.local.get(["webhook", "username"], (data) => {
  if (data.webhook) document.getElementById("webhook").value = data.webhook;
  if (data.username) document.getElementById("username").value = data.username;
});
