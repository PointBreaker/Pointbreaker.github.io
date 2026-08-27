// Universal quiz handler for both container-answer and button-answer formats.
document.querySelectorAll(".quiz, [data-quiz]").forEach((quiz) => {
  const compactCorrect = /^[a-d]$/i.test(quiz.dataset.correct || "")
    ? quiz.dataset.correct.toLowerCase()
    : "";
  const answer = (quiz.dataset.answer || compactCorrect).toLowerCase();
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
      buttons.forEach((candidate) => candidate.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");

      if (!answer && !button.dataset.answer) {
        feedback.dataset.state = "neutral";
        feedback.textContent = "参考解析：" + (quiz.dataset.correct || "请结合上文重新判断。答案仍待课程校订。" );
        window.renderCourseMath?.(feedback);
        return;
      }

      const isCorrect = button.dataset.answer
        ? button.dataset.answer === "correct"
        : button.dataset.choice === answer;
      const correctText = compactCorrect
        ? (button.dataset.correct || "正确。请再用上文的机制解释一次，而不是只记选项。")
        : (quiz.dataset.correct || button.dataset.correct || "正确！");
      const incorrectText = compactCorrect
        ? (button.dataset.incorrect || "再想想：检查你是否混淆了对象、边界条件或成本模型。")
        : (quiz.dataset.incorrect || button.dataset.incorrect || "再想想。");

      feedback.dataset.state = isCorrect ? "correct" : "incorrect";
      feedback.textContent = isCorrect ? correctText : incorrectText;
      window.renderCourseMath?.(feedback);
    });
  });
});
