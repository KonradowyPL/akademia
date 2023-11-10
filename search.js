function getNumberFromEnd(str) {
  const matches = str.match(/\d+$/);
  if (matches) {
    return parseInt(matches[0], 10);
  }
  return null;
}

function search(querry) {
  querry = querry.toLowerCase();

  num = getNumberFromEnd(querry);
  let results = [];
  tests.forEach((test) => {
    if (test.title.toLowerCase().includes(querry) || num == test.id) {
      results.push(test);
    }
  });
  return results;
}

async function searchMeanger(querry) {
  results = search(querry);
  display(results);
}

function display(results) {
  let objects = [];

  results.forEach((test) => {
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

  document.getElementById("test_results").replaceChildren(...objects);
}

onsubmit = function (event) {
  event.preventDefault();
  querry = document.getElementById("search_querry").value;
  document.title = `Odpowiedzi akademia el12`;
  searchMeanger(querry);
};

document.getElementById("search").addEventListener("submit", onsubmit);

document.getElementById("search_querry").addEventListener("input", onsubmit);

if (localStorage.getItem("version") != "1.3") {
  window.location.href = `./login.html?userId=${
    localStorage.getItem("userId") || ""
  }`;
}

tests = JSON.parse(localStorage.getItem("tests"));

searchMeanger("");
