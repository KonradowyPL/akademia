function findtest(id) {
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    if (test.id == id) {
      return test;
    }
  }
}

const urlParams = Object.fromEntries(
  new URLSearchParams(new URL(document.URL).search)
);

const id = Number(urlParams.id);

const tests = JSON.parse(localStorage.getItem("tests"));
const test = findtest(id);

let objects = [];

test.questions.forEach((question, index) => {
  list = ``;
  const correct = question.correct;
  for (let i = 0; i < question.anwsers.length; i++) {
    const anwser = question.anwsers[i];
    list += `<li class="${anwser == correct ? "correct" : ""}" >${anwser}</li>`;
  }
  let element = `${question.question}<ul> ${list}</ul>`;
  let div = document.createElement("li");
  div.className = "question";
  div.innerHTML = element;
  div.id = `q${index}`;
  objects.push(div);
});

document.getElementById("title").innerHTML = test.title;
document.getElementById("lenght").innerHTML = test.questions.length;
document.getElementById("maxPoints").innerHTML = test.maxPoints;
document.getElementById("_id").innerHTML = test.id;

document.getElementById(
  "results"
).href = `https://akademia.el12.pl/testy/wyniki-testu/${test.id}`;

document.getElementById("questions").replaceChildren(...objects);
document.title = `${test.title} - Odpowiedzi do testu`;

document.getElementById("solve").onclick = function (e) {
  if (confirm(`Czy napewno chcesz rozwiązać test "${test.title}"?`)) {
    var win = window.open(
      `https://akademia.el12.pl/testy/rozwiazywanie-testu/${test.id}`,
      "_blank"
    );
    win.focus();
  }
};
