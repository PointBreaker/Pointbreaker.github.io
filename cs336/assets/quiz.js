// Universal quiz handler - supports both CS336 and 6.828 quiz formats
document.querySelectorAll(".quiz, [data-quiz]").forEach((quiz) => {
  // Support both data-answer (6.828) and data-answer (CS336) on container
  const answer = quiz.dataset.answer;

  // Find feedback element: [data-feedback] or .quiz-feedback
  const feedback = quiz.querySelector("[data-feedback]") || quiz.querySelector(".quiz-feedback");

  const buttons = quiz.querySelectorAll("button[data-choice]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((candidate) => candidate.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");

      // Determine correct/incorrect text
      // CS336 format: data-correct/data-incorrect on container
      // 6.828 format: data-correct/data-incorrect on button
      const correctText = quiz.dataset.correct || button.dataset.correct || "正确！";
      const incorrectText = quiz.dataset.incorrect || button.dataset.incorrect || "再想想。";

      if (button.dataset.choice === answer) {
        if (feedback) {
          feedback.dataset.state = "correct";
          feedback.textContent = correctText;
        }
        return;
      }

      if (feedback) {
        feedback.dataset.state = "incorrect";
        feedback.textContent = incorrectText;
      }
    });
  });
});
