// gets nrumber from end of string
// if no number is found returns null
function getNumberFromEnd(str) {
  const matches = str.match(/\d+$/);
  if (matches) {
    return parseInt(matches[0], 10);
  }
  return null;
}

// highlights querry in title
// is not case sensitive
function highlightQuerry(title, querry) {
  if (querry.length != 0) {
    let regex = new RegExp(`(${escapeRegEx(querry)})`, "gi");
    return title.replace(regex, '<span class="highlight">$1</span>');
  } else {
    return title;
  }
}

// escapes regEx characters
function escapeRegEx(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// sorts tests json obj for selected mode
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

function initSorting() {
  //adds event listiner to sort and refresh results
  addListiner = function (ele) {
    ele.addEventListener("change", function () {
      sort();
      onsubmit();
    });
  };

  key = localStorage.getItem("sortKey");

  // loops over all radio buttons for sorting
  document.querySelectorAll('input[type="radio"][name="sort"]').forEach((radio) => {
    // selects previous sorting mode from localstorage
    if (radio.value == key) {
      radio.checked = true;
    }
    addListiner(radio);
  });
  // adds listiner for reverse option
  addListiner(document.getElementById("sortReverse"));
  if (localStorage.getItem("sortReverse") == 1) {
    document.getElementById("sortReverse").checked = true;
  }

  // accually sorts
  sort();
}

// searches tests by querry and given id
function search(querry) {
  // cancels previous async search querry
  clearTimeout(INTERVALiD);

  const parent = document.getElementById("test_results");
  const groupSize = document.readyState === "complete" ? 4 : tests.length;
  var children = parent.childElementCount;
  var results = 0;
  const num = getNumberFromEnd(querry);

  searchFrom = function (from) {
    var sesionResults = 0;
    let index = from;

    // loops until there are groupSize results
    for (index = from; sesionResults < groupSize && index < tests.length; index++) {
      const test = tests[index];
      if (
        querry === "" || // if querry is none
        String(test.id).startsWith(num) || // if querry is none
        test.title.toLowerCase().includes(querry) // test title includes querry
      ) {
        // checks if it sould add child of replace it
        if (results >= children) {
          addResult(test, querry, results);
        } else {
          replaceResult(test, querry, results);
        }

        results++;
        sesionResults++;
      }
    }
    // calls next time after site is redrawn
    if (from + groupSize < tests.length) {
      INTERVALiD = setTimeout(searchFrom, 0, index);
    } else {
      // remove extra children
      const children = parent.childElementCount;
      for (let i = results; i < children; i++) {
        parent.removeChild(parent.children[parent.childElementCount - 1]);
      }
    }
  };
  searchFrom(0);
}

// replaces results with new content
function replaceResult(test, querry, index) {
  const child = document.querySelector(`#test_results >:nth-child(${index + 1})`);
  const footer = child.querySelector("a > .footer");

  title = highlightQuerry(test.title, querry);

  child.href = `./view.html?id=${test.id}`;
  child.querySelector("a > .title").innerHTML = title;
  footer.querySelector(":nth-child(1)").innerText = test.id;
  footer.querySelector(":nth-child(2)").innerText = test.questions.length;
  footer.querySelector(":nth-child(3)").innerText = test.maxPoints;
}

// displays results
function addResult(test, querry, index) {
  title = highlightQuerry(test.title, querry);

  const parent = document.getElementById("test_results");

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
  parent.appendChild(div);
}

// logs out user
logout = function () {
  localStorage.clear();
  window.location = "./login.html?action=logout";
};

// search
onsubmit = function () {
  const querry = document.getElementById("search_querry").value.toLowerCase();
  history.replaceState({ querry }, null, null);
  search(querry);
};

// relog users that have used older versions of app
if (localStorage.getItem("version") != "2.1") {
  window.location.href = `./login.html?action=relog`;
}

// adds event listiner for changes in input
document.getElementById("search_querry").addEventListener("input", onsubmit);
tests = JSON.parse(localStorage.getItem("tests"));

initSorting();

var INTERVALiD = null;

// get url params
const urlParams = Object.fromEntries(new URLSearchParams(new URL(document.URL).search));

// gets querry from state of url params
let querry = history.state?.querry || urlParams.querry || "";

//sets querry to input and searchs
querry = document.getElementById("search_querry").value = querry;
search(querry);

// displays user name
document.getElementById("name").innerHTML = localStorage.getItem("userName");
