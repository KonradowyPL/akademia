function findtest(id) {
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    if (test.id == id) {
      console.log(test);
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

test.questions.forEach((question) => {
  list = ``;
  const correct = question.correct;
  for (let i = 0; i < question.anwsers.length; i++) {
    const anwser = question.anwsers[i];
    if (anwser == correct) {
      list += `<li><b>${anwser}</b></li>`;
    } else {
      list += `<li>${anwser}</li>`;
    }
  }
  let element = `${question.question}<ol> ${list}</ol>`;
  let div = document.createElement("li");
  div.innerHTML = element;
  objects.push(div);
});

document.getElementById("title").innerHTML = `${test.title}`;
document.getElementById(
  "lenght"
).innerHTML = `Ilość pytań:${test.questions.length}`;
document.getElementById(
  "maxPoints"
).innerHTML = `Maskymalna ilość punktów:${test.maxPoints}`;
document.getElementById("_id").innerHTML = `Id: ${test.id}`;
document.getElementById("questions").replaceChildren(...objects);
document.title = `${test.title} - Odpowiedzi do testu`;
