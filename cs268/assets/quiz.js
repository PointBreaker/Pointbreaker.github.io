document.querySelectorAll("[data-quiz]").forEach((quiz) => {
  const answer = quiz.dataset.answer;
  const feedback = quiz.querySelector("[data-feedback]");
  const buttons = quiz.querySelectorAll("button[data-choice]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((candidate) => candidate.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");

      if (button.dataset.choice === answer) {
        feedback.dataset.state = "correct";
        feedback.textContent = quiz.dataset.correct;
        return;
      }

      feedback.dataset.state = "incorrect";
      feedback.textContent = quiz.dataset.incorrect;
    });
  });
});
