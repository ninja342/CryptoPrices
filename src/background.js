var btc_price = 1;
var eth_price = 1;
var wbtc_price = 1;
var wsteth_price = 1;



afterFetch = function (json) {
  console.log("After fetch");
  btc_price = json.bitcoin.usd;
  eth_price = json.ethereum.usd;
  wbtc_price = json["wrapped-bitcoin"].usd;
  wsteth_price = json["wrapped-steth"].usd;

  chrome.contextMenus.create({
    id: "ETH_PRICE",
    title: "ETH: " + eth_price,
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "BTC_PRICE",
    title: "BTC: " + btc_price,
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "WBTC_PRICE",
    title: "WBTC: " + wbtc_price,
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "WSTETH_PRICE",
    title: "WSTETH: " + wsteth_price,
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "ETH_VALUE",
    title: 0 + " ETH: " + 0 + " USD",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "BTC_VALUE",
    title: 0 + " BTC: " + 0 + " USD",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "WBTC_VALUE",
    title: 0 + " WBTC: " + 0 + " USD",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "WSTETH_VALUE",
    title: 0 + " WSTETH: " + 0 + " USD",
    contexts: ["selection"],
  });
}


chrome.contextMenus.removeAll(function () {
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cwrapped-bitcoin%2wrapped-steth&vs_currencies=usd")
    .then((response) => response.json())
    .then((json) => afterFetch(json));
})

function update(json) {
  btc_price = json.bitcoin.usd;
  eth_price = json.ethereum.usd;
  wbtc_price = json["wrapped-bitcoin"].usd;
  wsteth_price = json["wrapped-steth"].usd;
  console.log("NEW ETH price: " + eth_price);
}

function updatePrices() {
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cwrapped-bitcoin%2wrapped-steth&vs_currencies=usd")
    .then((response) => response.json())
    .then((json) => update(json));
}

setInterval(function () { updatePrices(); }, 100000);


//add a message listener that will modify the context menu however you see fit
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == 'updateContextMenu') {
    if (request.selection) {
      amount = request.selection;
      console.log("background: " + amount);
      chrome.contextMenus.update("ETH_VALUE", {
        'title': amount + " ETH: " + eth_price * amount + " USD",
        'enabled': true,
        "contexts": ["selection"]
      });
      chrome.contextMenus.update("BTC_VALUE", {
        'title': amount + " BTC: " + btc_price * amount + " USD",
        'enabled': true,
        "contexts": ["selection"]
      });
      chrome.contextMenus.update("WBTC_VALUE", {
        'title': amount + " WBTC: " + wbtc_price * amount + " USD",
        'enabled': true,
        "contexts": ["selection"]
      });
      chrome.contextMenus.update("WSTETH_VALUE", {
        'title': amount + " WSTETH: " + wsteth_price * amount + " USD",
        'enabled': true,
        "contexts": ["selection"]
      });
    }
  }
});