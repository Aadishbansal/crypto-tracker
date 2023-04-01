const dropdownCoin = document.getElementById("coin");
const dropdownCurrency = document.getElementById("currency");
const baseUrl = "https://api.coingecko.com/api/v3";
const displayError = () => {
  const main = document.getElementById("main");
  const alertTemplate = `  <div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">
    <i class="bi bi-exclamation-triangle-fill me-2"></i>

    Something went wrong.
  </h4>
  <p>Sorry for inconvenience.</p>
  <hr />
  <p class="mb-0">Please try again later.</p>
</div>`;
  main.innerHTML = alertTemplate;
};

const fetchCoins = async () => {
  const res = await fetch(`${baseUrl}/coins/markets?vs_currency=btc`);
  return res.json();
};
const fetchCurrenys = async () => {
  const res = await fetch(`${baseUrl}/simple/supported_vs_currencies`);
  return res.json();
};
const displayCoinOptions = async () => {
  try {
    const options = await fetchCoins();
    options.forEach((ele) => {
      const newOption = document.createElement("option");
      newOption.value = ele.id;
      newOption.text = ele.name;
      dropdownCoin.appendChild(newOption);
    });
  } catch (err) {
    displayError();
  }
};
const displayCurrencyOptions = async () => {
  try {
    const options = await fetchCurrenys();
    options.forEach((ele) => {
      const newOption = document.createElement("option");
      newOption.value = ele;
      newOption.text = ele.toUpperCase();
      if (ele === "usd") newOption.selected = true;
      dropdownCurrency.appendChild(newOption);
    });
  } catch (err) {
    displayError();
  }
};
const displayCoin = (res, currency) => {
  const lastUpdated = res.last_updated.split("T")[0];
  const imageUrl = res.image.thumb;
  const name = res.name;
  const marketCap = res.market_data.market_cap[currency].toLocaleString();
  const price = res.market_data.current_price[currency].toLocaleString();
  const change24 = res.market_data.price_change_24h_in_currency[currency];
  let changeTextColor = change24 > 0 ? "text-success" : "text-danger";
  const tableTamplate = `<table class="table text-light" >
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Property</th>
      <th scope="col">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"><img src=${imageUrl} alt="icon"></th>
      <td>Name</td>
      <td>${name}</td>
    </tr>
    <tr>
      <th scope="row"></th>
      <td>Price (${currency.toUpperCase()})</td>
      <td>${price}</td>
    </tr>
    <tr>
      <th scope="row"></th>
      <td>Change (24hrs)</td>
      <td class=${changeTextColor}>${change24}</td>
    </tr>
    <tr>
      <th scope="row"></th>
      <td>Last updated</td>
      <td>${lastUpdated}</td>
    </tr>
    <tr>
    <th scope="row"></th>
    <td>Market cap (${currency.toUpperCase()})</td>
    <td>${marketCap}</td>
  </tr>
  </tbody>
</table>`;
  const section = document.getElementById("coin-data");

  section.innerHTML = tableTamplate;
};
displayCoinOptions();
displayCurrencyOptions();
const fetchCoin = (id, currency) => {
  fetch(`${baseUrl}/coins/${id}`)
    .then((res) => res.json())
    .then((res) => {
      displayCoin(res, currency);
    })
    .catch((err) => displayError());
};
const onSubmit = (event) => {
  event.preventDefault();
  const coinId = dropdownCoin.value;
  const currency = dropdownCurrency.value;
  fetchCoin(coinId, currency);
};

const form = document.getElementById("form-crypto");
form.addEventListener("submit", onSubmit);
