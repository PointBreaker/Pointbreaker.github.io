#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const lessonsDir = path.join(root, "courses/eecs498/lessons");
const files = fs.readdirSync(lessonsDir).filter((name) => /^\d{4}.*\.html$/.test(name)).sort();

const required = [
  ["problem or contract", /id="(?:problem|why|objective|same-objective|depth-lab|walkthrough|dynamics-lab|spatial-lab|representation-lab|detection-lab|generation-lab)"/],
  ["mental model", /class="[^"]*mental-model/],
  ["shape trace", /class="[^"]*(?:shape-flow|tensor-ledger)|\[N,[A-ZKTHW0-9]/],
  ["repository code", /class="[^"]*your-code/],
  ["why / mechanism", /class="[^"]*mechanism-walkthrough/],
  ["counterfactual", /class="[^"]*counterfactual/],
  ["misconception", /class="[^"]*misconception|Common Misconception/],
  ["transfer question", /class="[^"]*transfer-question/],
  ["explain it yourself", /class="[^"]*explain-it-yourself/],
  ["next connection", /class="[^"]*lesson-connection/],
  ["source provenance", /class="[^"]*provenance/],
];

let failures = 0;
console.log("EECS498 Depth QA");
console.log("lesson  bytes  checks  result");

for (const file of files) {
  const html = fs.readFileSync(path.join(lessonsDir, file), "utf8");
  const byteLength = Buffer.byteLength(html, "utf8");
  const lesson = file.slice(0, 4);
  const missing = required.filter(([, re]) => !re.test(html)).map(([label]) => label);
  const checkCount = (html.match(/class="[^"]*(?:concept-check|depth-check)/g) || []).length;
  const p0 = Number(lesson) >= 7 && Number(lesson) <= 13;
  const transformer = Number(lesson) >= 9 && Number(lesson) <= 13;
  if (checkCount < (p0 ? 4 : 3)) missing.push(`checks ${checkCount}/${p0 ? 4 : 3}`);
  if (!/github\.com\/PointBreaker\/EECS498\/blob\/1b495ae8/.test(html)) missing.push("stable source link");
  if (p0 && byteLength < 10000) missing.push(`P0 depth ${byteLength}/10000 bytes`);
  if (transformer && !/transformer-thread/.test(html)) missing.push("shared arithmetic thread");
  if (transformer && !/class="[^"]*worked-example/.test(html)) missing.push("Transformer worked example");
  if (!html.includes("../../../assets/course/lesson.css") || !html.includes("../assets/course.css")) missing.push("shared lesson styles");
  if (!html.includes("../assets/eecs498.js")) missing.push("course-scoped interaction script");
  const status = missing.length ? `FAIL: ${missing.join(", ")}` : "PASS";
  console.log(`${lesson}   ${String(byteLength).padStart(5)}   ${String(checkCount).padStart(2)}      ${status}`);
  failures += missing.length ? 1 : 0;
}

if (files.length !== 14) {
  console.error(`FAIL: expected 14 lessons, found ${files.length}`);
  failures += 1;
}

const courseInfo = fs.readFileSync(path.join(root, "courses/eecs498/course-info.json"), "utf8");
for (const file of files) {
  if (!courseInfo.includes(`lessons/${file}`)) {
    console.error(`FAIL: course homepage missing ${file}`);
    failures += 1;
  }
}

const parsedInfo = JSON.parse(courseInfo);
const parsedStatus = JSON.parse(fs.readFileSync(path.join(root, "courses/eecs498/api/status.json"), "utf8"));
const reviewDir = path.join(root, "courses/eecs498/reviews");
const reviewFiles = fs.readdirSync(reviewDir).filter((file) => /^a[1-6]\.html$/.test(file)).sort();
if (reviewFiles.length !== 6) {
  console.error(`FAIL: expected 6 Review Lab wrappers, found ${reviewFiles.length}`);
  failures += 1;
}
for (const inventory of [parsedInfo.assignments, parsedStatus.assignments]) {
  if (inventory?.length !== 6) {
    console.error("FAIL: course-info/status must expose all 6 Review Labs");
    failures += 1;
  }
  for (const item of inventory || []) {
    if (!item.contentFile || !fs.existsSync(path.join(root, "courses/eecs498", item.contentFile))) {
      console.error(`FAIL: missing Review Lab ${item.contentFile || item.number}`);
      failures += 1;
    }
  }
}
const reviewContext = { window: {} };
vm.createContext(reviewContext);
vm.runInContext(fs.readFileSync(path.join(root, "courses/eecs498/assets/review-lab-bank.js"), "utf8"), reviewContext);
const reviewBank = reviewContext.window.EECS498ReviewLabs || {};
if (Object.keys(reviewBank).length !== 6) {
  console.error(`FAIL: expected 6 Review Lab data entries, found ${Object.keys(reviewBank).length}`);
  failures += 1;
}
for (const [id, lab] of Object.entries(reviewBank)) {
  if ((lab.stages || []).length < 3) { console.error(`FAIL: ${id} needs at least 3 stages`); failures += 1; }
  for (const stage of lab.stages || []) {
    if (!stage.contract?.input || !stage.contract?.output || stage.contract?.invariants?.length < 2 || stage.contract?.forbidden?.length < 2) { console.error(`FAIL: ${id}/${stage.id} contract incomplete`); failures += 1; }
    if (stage.failures?.length < 2 || stage.hints?.length !== 3 || stage.evidence?.length < 3 || stage.gate?.length < 3) { console.error(`FAIL: ${id}/${stage.id} workbook scaffold incomplete`); failures += 1; }
  }
}
const reviewRenderer = fs.readFileSync(path.join(root, "courses/eecs498/assets/review-labs.js"), "utf8");
for (const marker of ["Tiny sanity check", "Prediction → Experiment → Evidence", "Progressive hints", "Retrospective"]) {
  if (!reviewRenderer.includes(marker)) { console.error(`FAIL: Review Lab renderer missing ${marker}`); failures += 1; }
}

const homeCatalog = fs.readFileSync(path.join(root, "courses.json"), "utf8");
if (!homeCatalog.includes('"path": "courses/eecs498/"')) {
  console.error("FAIL: pointbreaker.github.io homepage has no EECS498 entry");
  failures += 1;
}

if (failures) {
  console.error(`\nDepth QA failed in ${failures} checks/groups.`);
  process.exit(1);
}
console.log("\nAll 14 lessons pass the structural depth gate. Manual teaching-quality review is still required.");
