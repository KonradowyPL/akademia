var INTERVALiD = null;

// gets nrumber from end of string
// if no number is found returns null
function getNumberFromEnd(str) {
  const matches = str.match(/\d+$/);
  if (matches) {
    return parseInt(matches[0], 10);
  }
  return null;
}

// escapes regEx characters
function escapeRegEx(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sort() {
  key = document.querySelector('input[name="sort"]:checked').value;
  reverse = document.getElementById("sortReverse").checked ? 1 : -1;
  localStorage.setItem("sortKey", key);
  localStorage.setItem("sortReverse", reverse);

  keys = {
    srotAz: (test) => test.title,
    sortPoints: (test) => test.maxPoints,
    sortId: (test) => test.id,
    sortQuestions: (test) => test.questions.length,
  };

  const thisKey = keys[key];

  tests.sort((e1, e2) => {
    const a = thisKey(e1);
    const b = thisKey(e2);

    return a == b ? 0 : a > b ? reverse : -reverse;
  });
}

// searches tests by querry and given id
function search(querry) {
  if (querry === "") {
    return tests;
  }
  const num = getNumberFromEnd(querry);
  let results = [];
  tests.forEach((test) => {
    if (
      // id string has to start with querry
      String(test.id).startsWith(num) ||
      test.title.toLowerCase().includes(querry)
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

// displays results
function display(results, querry) {
  console.time("display");
  console.log(results.length);
  let objects = [];
  const parent = document.getElementById("test_results");
  var children = parent.childElementCount;

  results.forEach((test, index) => {
    // highlights querry in title
    // is not case sensitive
    if (querry.length != 0) {
      let regex = new RegExp(`(${escapeRegEx(querry)})`, "gi");
      title = test.title.replace(regex, '<span class="highlight">$1</span>');
    } else {
      title = test.title;
    }

    const div = document.createElement("li");
    const anchor = document.createElement("a");
    const titleEle = document.createElement("span");
    const footer = document.createElement("div");
    const testId = document.createElement("span");
    const testQuestions = document.createElement("span");
    const testPoints = document.createElement("span");

    anchor.classList = "exam hover";
    anchor.href = `./view.html?id=${test.id}`;

    footer.classList = "footer";
    titleEle.classList = "title";
    testPoints.classList = "points icon";
    testQuestions.classList = "questions icon";
    testId.classList = "id icon";

    titleEle.innerHTML = title;
    testId.innerText = test.id;
    testQuestions.innerText = test.questions.length;
    testPoints.innerText = test.maxPoints;

    anchor.appendChild(titleEle);
    footer.appendChild(testId);
    footer.appendChild(testQuestions);
    footer.appendChild(testPoints);
    anchor.appendChild(footer);

    div.appendChild(anchor);
    if (index >= children) {
      parent.appendChild(div);
    } else {
      parent.replaceChild(div, parent.children[index]);
    }
  });

  // remove extra children
  children = parent.childElementCount;
  for (let i = results.length; i < children; i++) {
    parent.removeChild(parent.children[parent.childElementCount - 1]);
  }

  console.timeEnd("display");
}

logout = function () {
  localStorage.clear();
  window.location = "./login.html?from=logout";
};

// search
onsubmit = async function (event) {
  const querry = document.getElementById("search_querry").value.toLowerCase();
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
