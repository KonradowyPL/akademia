// gets number from end of string
// if no number is found returns null
function getNumberFromEnd(str) {
  const matches = str.match(/\d+$/);
  if (matches) {
    return parseInt(matches[0], 10);
  }
  return null;
}

// searches tests by querry and given id
function search(querry) {
  querry = querry.toLowerCase();

  let num = getNumberFromEnd(querry);
  let results = [];
  tests.forEach((test) => {
    if (
      test.title.toLowerCase().includes(querry) ||
      // id string has to start with querry
      String(test.id).startsWith(num)
    ) {
      results.push(test);
    }
  });
  return results;
}

function searchMeanger(querry) {
  const results = search(querry);
  display(results, querry);
}

// escapes regEx characters
function escapeRegEx(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// displays results
function display(results, querry) {
  let objects = [];

  results.forEach((test) => {
    let div = document.createElement("li");

    // highlights querry in title
    // is not case sensitive
    let regex = new RegExp(`(${escapeRegEx(querry)})`, "gi");
    title = test.title.replace(regex, '<span class="highlight">$1</span>');

    div.innerHTML = `
        <a href=./view.html?id=${test.id} class="exam">
            <span class="title">${title}</span>

            <div class="footer">
              <span class="id icon">${test.id}</span>
              <span class="questions icon">${test.questions.length}</span>
              <span class="points icon">${test.maxPoints}</span>
            </div>

        </a>`;
    objects.push(div);
  });

  document.getElementById("test_results").replaceChildren(...objects);
}

// search
onsubmit = async function (event) {
  event.preventDefault();
  querry = document.getElementById("search_querry").value.toLowerCase();
  history.replaceState({ querry }, null, null);
  searchMeanger(querry);
};

document.getElementById("search_querry").addEventListener("input", onsubmit);

// relog users that have used older versions of app
if (localStorage.getItem("version") != "1.3") {
  window.location.href = `./login.html?userId=${localStorage.getItem("userId") || ""}`;
}

tests = JSON.parse(localStorage.getItem("tests"));

const urlParams = Object.fromEntries(new URLSearchParams(new URL(document.URL).search));

let querry = history.state?.querry || urlParams.querry || "";

searchMeanger(querry);
