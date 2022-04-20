// Focus div based on nav button click
const homenav = document.getElementById("homenav");
const home = document.getElementById("home");
homenav.addEventListener("click", activeHome);

const singlenav = document.getElementById("singlenav");
const single = document.getElementById("single");
singlenav.addEventListener("click", activeSingle);

const multinav = document.getElementById("multinav");
const multi = document.getElementById("multi");
multinav.addEventListener("click", activeMulti);

const guessnav = document.getElementById("guessnav");
const guess = document.getElementById("guess");
guessnav.addEventListener("click", activeGuess);

async function activeHome() {
  home.className = "active";
  single.className = "hidden";
  multi.className = "hidden";
  guess.className = "hidden";
}

async function activeSingle() {
  home.className = "hidden";
  single.className = "active";
  multi.className = "hidden";
  guess.className = "hidden";
}

async function activeMulti() {
  home.className = "hidden";
  single.className = "hidden";
  multi.className = "active";
  guess.className = "hidden";
}

async function activeGuess() {
  home.className = "hidden";
  single.className = "hidden";
  multi.className = "hidden";
  guess.className = "active";
}

const uri = document.baseURI;

// Flip one coin and show coin image to match result when button clicked
const flip = document.getElementById("flip");
flip.addEventListener("click", flipCoin);
function flipCoin() {
  const endpoint = "app/flip";
  const url = uri + endpoint;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log(result);
      document
        .getElementById("quarter")
        .setAttribute("src", "./assets/img/" + result.flip + ".png");
      flip.disabled = true;
    });
}

const coins = document.getElementById("coins");
coins.addEventListener("submit", flipCoins);
async function flipCoins(event) {
  event.preventDefault();

  const endpoint = "app/flip/coins/";
  const url = uri + endpoint;
  const formEvent = event.currentTarget;

  try {
    const formData = new FormData(formEvent);
    const flips = await sendFlips({ url, formData });
    console.log(flips);
    document.getElementById("heads").innerHTML = flips.summary.heads || "0";
    document.getElementById("tails").innerHTML = flips.summary.tails || "0";
  } catch (e) {
    console.error(e);
  }
}

async function sendFlips({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJson = JSON.stringify(plainFormData);
  console.log(formDataJson);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJson,
  };
  console.log(options);
  const res = await fetch(url, options);
  return res.json();
}

const g = document.getElementById("guess");
g.addEventListener("submit", guessFlip);

async function guessFlip(event) {
  event.preventDefault();

  const endpoint = "app/flip/call/";
  const url = uri + endpoint;

  try {
    let rad = document.guess.call;
    console.log(rad.value);
    let vals = { call: rad.value };
    vals = JSON.stringify(vals);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: vals,
    };

    await fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (results) {
        console.log(results);
        document
          .getElementById("quarter2")
          .setAttribute("src", "./assets/img/" + results.flip + ".png");
        document.getElementById("status").innerHTML = results.result;
        document.getElementById("quarter3").setAttribute("src","./assets/img/" + rad.value + ".png")
      });
  } catch (e) {
    console.error(e);
  }
}
// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button
