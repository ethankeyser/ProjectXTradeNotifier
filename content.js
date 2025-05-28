chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_TRADE_DATA_OPEN") {
    console.log("📥 Background requested trade data");
    setTimeout(() => {
        // const priceElement = document.querySelectorAll('div.MuiBox-root.css-0');
        // let priceValue = "Position Closed";
        // for(const ele of priceElement)
        // {
        //     if(ele.innerText.includes("UP&L"))
        //     {
        //         const price = ele.firstChild.firstChild.firstChild.firstChild;
        //         priceValue = price?.innerText || "Position Closed";
        //         break;
        //     }
        // }

        const pl = document.querySelectorAll('div.balance_balance__euf9g')
        const rpl = pl[2].innerText;
        const upl = pl[3].innerText; 

        chrome.runtime.sendMessage({
        type: "TRADE_INFO_ORDER",
        data: {
            rpl,
            upl,
            url: window.location.href,
            body: msg.data
        }
        });
    }, 1000);
    
  }
  else if(msg.type === "GET_TRADE_DATA_CLOSE") 
  {
    const priceValue = "No Active Position";
    const pl = document.querySelectorAll('div.balance_balance__euf9g')
    const rpl = pl[2].innerText;
    const upl = pl[3].innerText; 

    chrome.runtime.sendMessage({
    type: "TRADE_INFO_CLOSE",
    data: {
        priceValue,
        rpl, 
        upl,
        url: window.location.href
    }
    });
  }
  else if(msg.type === "GET_TRADE_DATA_CANCEL") 
  {
    const priceValue = "Limit Order Cancelled";
    const pl = document.querySelectorAll('div.balance_balance__euf9g')
    const rpl = pl[2].innerText;
    const upl = pl[3].innerText; 

    chrome.runtime.sendMessage({
    type: "TRADE_INFO_CANCELLED",
    data: {
        priceValue,
        rpl, 
        upl,
        url: window.location.href
    }
    });
  }
  else if(msg.type ==="GET_TRADE_DATA_BRACKETS")
  {
    const priceValue = "No Active Position";
    const pl = document.querySelectorAll('div.balance_balance__euf9g')
    const rpl = pl[2].innerText;
    const upl = pl[3].innerText; 

    chrome.runtime.sendMessage({
        type: "TRADE_INFO_BRACKETS",
        data: {
            priceValue,
            rpl, 
            upl,
            body: msg.data
        }
    });
  }
});

