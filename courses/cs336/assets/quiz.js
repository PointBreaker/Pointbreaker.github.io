// Universal quiz handler for both container-answer and button-answer formats.
document.querySelectorAll(".quiz, [data-quiz]").forEach((quiz) => {
  const answer = quiz.dataset.answer;
  let feedback = quiz.querySelector("[data-feedback]") || quiz.querySelector(".quiz-feedback");
  if (!feedback) {
    feedback = document.createElement("p");
    feedback.className = "quiz-feedback";
    feedback.dataset.feedback = "";
    quiz.appendChild(feedback);
  }

  const buttons = quiz.querySelectorAll("button[data-choice], button[data-answer]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((candidate) => {
        candidate.setAttribute("aria-pressed", "false");
        candidate.classList.remove("is-selected", "is-correct", "is-incorrect");
      });
      button.setAttribute("aria-pressed", "true");
      button.classList.add("is-selected");

      if (!answer && !button.dataset.answer) {
        feedback.dataset.state = "neutral";
        feedback.textContent = "参考解析：" + (quiz.dataset.correct || "请结合上文重新判断。答案仍待课程校订。" );
        window.renderCourseMath?.(feedback);
        return;
      }

      const isCorrect = button.dataset.answer
        ? button.dataset.answer === "correct"
        : button.dataset.choice === answer;
      const correctText = quiz.dataset.correct || button.dataset.correct || button.dataset.incorrect || "正确！";
      const incorrectText = button.dataset.diagnosis || quiz.dataset.incorrect || button.dataset.incorrect || "再想想。";

      feedback.dataset.state = isCorrect ? "correct" : "incorrect";
      button.classList.add(isCorrect ? "is-correct" : "is-incorrect");
      feedback.textContent = isCorrect ? correctText : `理解诊断：${incorrectText}`;
      window.renderCourseMath?.(feedback);
    });
  });
});
