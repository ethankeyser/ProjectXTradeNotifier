chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.url.includes("Position/close"))
    {
        console.log("📡 Trade request detected:", details.url);

      // Ask content.js for current trade data
      chrome.tabs.sendMessage(details.tabId, { type: "GET_TRADE_DATA_CLOSE" });
    }
    else if(details.url.includes("Order/cancel"))
    {
        chrome.tabs.sendMessage(details.tabId, { type: "GET_TRADE_DATA_CANCEL" });
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if(details.url.includes("editStopLoss"))
        {
            const body = details.requestBody;
            if (body?.formData) {
                console.log("📥 Form Data:", body.formData);
            } else if (body?.raw) {
                const decoder = new TextDecoder("utf-8");
                const bodyText = decoder.decode(body.raw[0].bytes);
                const jsonBody = JSON.parse(bodyText);
                console.log("📦 Raw Body:", bodyText);
                chrome.tabs.sendMessage(details.tabId, { type: "GET_TRADE_DATA_BRACKETS", data: jsonBody });
            }
            
        }
        else if (details.url.includes("Order"))
        {
            const body = details.requestBody;
            if (body?.formData) {
                console.log("📥 Form Data:", body.formData);
            } else if (body?.raw) {
                const decoder = new TextDecoder("utf-8");
                const bodyText = decoder.decode(body.raw[0].bytes);
                const jsonBody = JSON.parse(bodyText);
                console.log("📦 Raw Body:", bodyText);
                chrome.tabs.sendMessage(details.tabId, { type: "GET_TRADE_DATA_OPEN", data: jsonBody });
            }
        }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"] 
    
);

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "TRADE_INFO_ORDER") {
    chrome.storage.local.get(["webhook", "username"], ({ webhook, username }) => {
      if (!webhook) return;
      const positionSize = String(message.data.body.positionSize ?? "N/A");
      const ticker = String(message.data.body.symbolId ?? "N/A");
      const rpl = String(message.data.rpl ?? "N/A");
      const limitPrice = String(message.data.body.limitPrice ?? "N/A");
      const stopPrice = String(message.data.body?.stopPrice ?? "N/A");
      let content = [];
      if(message.data.body.type == 1)
      {
        content = [
            {
                title: `📊 Limit Order Placed`,
                color: 5763719,
                fields: [
                    { name: "Contracts", value: `**${positionSize}**`, inline: true },
                    { name: "Ticker", value: `**${ticker.substring(5, ticker.length)}**`, inline: true },
                    { name: "Limit Price", value: `**${limitPrice}**`, inline: true },
                    { name: "RP&L", value: `**${rpl.substring(6, rpl.length)}**`, inline: true }
                ],
                footer: { text: "TopstepX" },
                timestamp: new Date().toISOString()
            }
            ]
      }
      else if(message.data.body.type == 2)
      {
        content = [
            {
                title: `📊 Market Order Placed`,
                color: 5763719,
                fields: [
                    { name: "Contracts", value: `**${positionSize}**`, inline: true },
                    { name: "Ticker", value: `**${ticker.substring(5, ticker.length)}**`, inline: true },
                    { name: "RP&L", value: `**${rpl.substring(6, rpl.length)}**`, inline: true }
                ],
                footer: { text: "TopstepX" },
                timestamp: new Date().toISOString()
            }
            ]
      }
      else if(message.data.body.type == 4)
      {
        content = [
            {
                title: `📊 Stop Order Placed`,
                color: 5763719,
                fields: [
                    { name: "Contracts", value: `**${positionSize}**`, inline: true },
                    { name: "Ticker", value: `**${ticker.substring(5, ticker.length)}**`, inline: true },
                    { name: "Stop Price", value: `**${stopPrice}**`, inline: true },
                    { name: "RP&L", value: `**${rpl.substring(6, rpl.length)}**`, inline: true }
                ],
                footer: { text: "TopstepX" },
                timestamp: new Date().toISOString()
            }
            ]
      }
      else if(message.data.body.type == 6)
      {
        content = [
            {
                title: `📊 Bid Joined`,
                color: 5763719,
                fields: [
                    { name: "Contracts", value: `**${positionSize}**`, inline: true },
                    { name: "Ticker", value: `**${ticker.substring(5, ticker.length)}**`, inline: true },
                    { name: "RP&L", value: `**${rpl.substring(6, rpl.length)}**`, inline: true }
                ],
                footer: { text: "TopstepX" },
                timestamp: new Date().toISOString()
            }
            ]
      }
      else if(message.data.body.type == 7)
      {
        content = [
            {
                title: `📊 Ask Joined`,
                color: 5763719,
                fields: [
                    { name: "Contracts", value: `**${positionSize}**`, inline: true },
                    { name: "Ticker", value: `**${ticker.substring(5, ticker.length)}**`, inline: true },
                    { name: "RP&L", value: `**${rpl.substring(6, rpl.length)}**`, inline: true }
                ],
                footer: { text: "TopstepX" },
                timestamp: new Date().toISOString()
            }
            ]
      }

      const payload = {
        username: username || "Trade Bot",
        embeds: content
      };

      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    });
  }
  else if(message.type === "TRADE_INFO_CLOSE") 
  {
    chrome.storage.local.get(["webhook", "username"], ({ webhook, username }) => {
      if (!webhook) return;
        const payload = {
            username: username || "Trade Bot",
            embeds: [
            {
                title: `📊 Trade Closed by by ${username}`,
                color: 5763719,
                fields: [
                    { name: "RP&L", value: `**${rpl.substring(6, rpl.length)}**`, inline: true },
                ],
                footer: { text: "TopstepX" },
                timestamp: new Date().toISOString()
            }
            ]
        };

        fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    })
  }
  else if(message.type === "TRADE_INFO_CANCELLED") 
  {
    chrome.storage.local.get(["webhook", "username"], ({ webhook, username }) => {
        if (!webhook) return;
        const rpl = String(message.data.rpl ?? "N/A");
        const payload = {
            username: username || "Trade Bot",
            embeds: [
            {
                title: `📊 Limit Order Cancelled by ${username}`,
                color: 5763719,
                fields: [
                    { name: "RP&L", value: `**${rpl.substring(6, rpl.length)}**`, inline: true },
                ],
                footer: { text: "TopstepX" },
                timestamp: new Date().toISOString()
            }
            ]
        };

        fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    })
  }
  else if(message.type === "TRADE_INFO_BRACKETS") 
  {
    chrome.storage.local.get(["webhook", "username"], ({ webhook, username }) => {
        if (!webhook) return;
        console.log(message)
        const takeProfit = String(message.data.body?.takeProfit ?? "N/A");
        const stopLoss = String(message.data.body?.stopLoss ?? "N/A");
        const rpl = String(message.data.rpl ?? "N/A");
        const upl = String(message.data.upl ?? "N/A");

        const payload = {
            username: username || "Trade Bot",
            embeds: [
            {
                title: `📊 Stop Loss/Take Profit Edited`,
                color: 5763719,
                fields: [
                    { name: "Take Profit", value: `**${takeProfit}**`, inline: true },
                    { name: "Stop Loss", value: `**${stopLoss}**`, inline: true },
                    { name: "RP&L", value: `**${rpl.substring(6, rpl.length)}**`, inline: true },
                    { name: "UP&L", value: `**${upl.substring(6, upl.length)}**`, inline: true }
                ],
                footer: { text: "TopstepX" },
                timestamp: new Date().toISOString()
            }
            ]
        };

        fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) {
                console.error("❌ Discord webhook error:", res.status);
                res.text().then(console.error);
            } else {
                console.log("✅ Webhook sent");
            }
            })
        .catch(console.error);
    })
  }
});
