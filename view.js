function findtest(id) {
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    if (test.id == id) {
      return test;
    }
  }
  return { title: "", id: id, questions: [], maxPoints: 0 };
}

const urlParams = Object.fromEntries(new URLSearchParams(new URL(document.URL).search));

const id = Number(urlParams.id);
const from = urlParams.from;

const tests = JSON.parse(sessionStorage.getItem("tests"));
const test = findtest(id);

let objects = [];

test.questions.forEach((question, index) => {
  let list = ``;
  const correct = question.correct;
  for (let i = 0; i < question.anwsers.length; i++) {
    const anwser = question.anwsers[i];
    list += `<li ${anwser == correct ? "class='correct'" : ""} >${anwser}</li>`;
  }
  const element = `${question.question}<ul> ${list}</ul>`;
  const div = document.createElement("li");
  div.className = "question hover";
  div.innerHTML = element;
  div.id = `q${index}`;
  objects.push(div);
});

document.getElementById("title").innerHTML = test.title;
document.getElementById("lenght").innerHTML = test.questions.length;
document.getElementById("maxPoints").innerHTML = test.maxPoints;
document.getElementById("_id").innerHTML = test.id;

document.getElementById("results").href = `https://akademia.el12.pl/testy/wyniki-testu/${test.id}`;

document.getElementById("questions").replaceChildren(...objects);
document.title = `${test.title} - Odpowiedzi do testu`;

solve = function () {
  if (confirm(`Czy napewno chcesz rozwiązać test "${test.title}"?`)) {
    const win = window.open(`https://akademia.el12.pl/testy/rozwiazywanie-testu/${test.id}`, "_blank");
    win.focus();
  }
};
