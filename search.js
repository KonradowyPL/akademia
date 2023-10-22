var url = "";

async function load() {
  const request = "https://konradowy.pythonanywhere.com?url=" + url;
  if (localStorage.getItem("version") == url || url == "") {
    tests = JSON.parse(localStorage.getItem("tests"));
  } else {
    const response = await fetch(request);
    const value = await response.text();
    tests = JSON.parse(value);
    localStorage.setItem("version", url);
    localStorage.setItem("tests", value);
  }
  return tests;
}

function serachTests(querry) {
  let results = [];
  tests.forEach((test) => {
    if (test.title.toLowerCase().includes(querry)) {
      results.push(test);
    }
  });

  return results;
}

function search(querry) {
  querry = querry.toLowerCase();
  results = {
    tests: serachTests(querry),
  };
  return results;
}

async function searchMeanger(querry) {
  console.log("submited!");
  await load();
  results = search(querry);
  display(results);
}

function display(results) {
  let objects = [];

  results.tests.forEach((test) => {
    let div = document.createElement("li");
    div.innerHTML = `
        <a href=./view.html?id=${test.id} class="exam">
            <span class="title">${test.title}</span>

            <div class="footer">
              <span class="id icon">${test.id}</span>
              <span class="questions icon">${test.questions.length}</span>
              <span class="points icon">${test.maxPoints}</span>
            </div>

        </a>`;
    objects.push(div);
  });

  if (objects.length == 0) {
    let noResult = document.createElement("span");
    noResult.innerHTML = "Brak Wyników";
    objects.push(noResult);
  }
  document.getElementById("test_results").replaceChildren(...objects);
}

document.getElementById("search").addEventListener("submit", function (event) {
  event.preventDefault();

  querry = document.getElementById("search_querry").value;
  document.title = `"${querry}" - Odpowiedzi akademia el12`;
  searchMeanger(querry);
});

document.getElementById("_url").onclick = async function () {
  navigator.clipboard.readText().then((text) => {
    url = text;
    localStorage.setItem("tests", " ");
  });
};

if (localStorage.getItem("tests") != null) {
  temp = async function () {
    await load();
    searchMeanger("");
  };
  temp();
}
