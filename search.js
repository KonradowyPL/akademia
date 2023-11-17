// gets nrumber from end of string
// if no number is found returns null
function getNumberFromEnd(str) {
  const matches = str.match(/\d+$/);
  if (matches) {
    return parseInt(matches[0], 10);
  }
  return null;
}

function sort() {
  key = document.querySelector('input[name="sort"]:checked').value;
  reverse = document.getElementById("sortReverse").checked ? 1 : -1;
  localStorage.setItem("sortKey", key);
  localStorage.setItem("sortReverse", reverse);

  console.log(reverse);

  keys = {
    srotAz: (test) => test.title,
    sortPoints: (test) => test.maxPoints,
    sortId: (test) => test.id,
    sortQuestions: (test) => test.questions.length,
  };

  thisKey = keys[key];

  tests.sort((e1, e2) => {
    const a = thisKey(e1);
    const b = thisKey(e2);

    return a == b ? 0 : a > b ? reverse : -reverse;
  });
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
    if (querry.length != 0) {
      let regex = new RegExp(`(${escapeRegEx(querry)})`, "gi");
      title = test.title.replace(regex, '<span class="highlight">$1</span>');
    } else {
      title = test.title;
    }
    div.innerHTML = `
        <a href=./view.html?id=${test.id} class="exam hover">
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

logout = function () {
  localStorage.clear();
  window.location = "./login.html?from=logout";
};

// search
onsubmit = async function (event) {
  querry = document.getElementById("search_querry").value.toLowerCase();
  history.replaceState({ querry }, null, null);
  searchMeanger(querry);
};

document.getElementById("search_querry").addEventListener("input", onsubmit);

// relog users that have used older versions of app
if (localStorage.getItem("version") != "2.1") {
  window.location.href = `./login.html?userId=${localStorage.getItem("userId") || ""}`;
}

tests = JSON.parse(localStorage.getItem("tests"));

key = localStorage.getItem("sortKey");
document.querySelectorAll('input[type="radio"][name="sort"]').forEach((radio) => {
  if (radio.value == key) {
    radio.checked = true;
  }
  radio.addEventListener("change", function () {
    sort();
    onsubmit();
  });
});
document.getElementById("sortReverse").addEventListener("change", function () {
  sort();
  onsubmit();
});
if (localStorage.getItem("sortReverse") == 1) {
  document.getElementById("sortReverse").checked = true;
}

sort();

const urlParams = Object.fromEntries(new URLSearchParams(new URL(document.URL).search));

let querry = history.state?.querry || urlParams.querry || "";

searchMeanger(querry);
querry = document.getElementById("search_querry").value = querry;

document.getElementById("name").innerHTML = localStorage.getItem("userName");
