const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3336;

// 课程数据
const courseData = require('./course-info.json');

// 静态文件服务
app.use('/lessons', express.static(path.join(__dirname, '..', 'lessons')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use('/reference', express.static(path.join(__dirname, '..', 'reference')));

// 扫描已生成的课程（匹配 0001-xxx.html 格式）
function scanLessons() {
  const lessonsDir = path.join(__dirname, '..', 'lessons');
  const lessons = [];
  if (fs.existsSync(lessonsDir)) {
    fs.readdirSync(lessonsDir)
      .filter(f => /^\d{4}-(.+)\.html$/.test(f))
      .sort()
      .forEach(file => {
        const match = file.match(/^(\d{4})-(.+)\.html$/);
        if (match) {
          lessons.push({
            file,
            number: parseInt(match[1]),
            slug: match[2],
            path: `/lessons/${file}`
          });
        }
      });
  }
  return lessons;
}

// 扫描 assignment 导读文件（匹配 ass01-xxx.html 格式）
function scanAssignmentGuides() {
  const dir = path.join(__dirname, '..', 'lessons', 'assignments');
  const guides = {};
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir)
      .filter(f => /^ass(\d+)-(.+)\.html$/.test(f))
      .forEach(file => {
        const match = file.match(/^ass(\d+)-(.+)\.html$/);
        if (match) {
          const num = parseInt(match[1]);
          guides[num] = `/lessons/assignments/${file}`;
        }
      });
  }
  return guides;
}

// API: 课程状态
app.get('/api/status', (req, res) => {
  const generatedLessons = scanLessons();
  const generatedNumbers = new Set(generatedLessons.map(l => l.number));
  const assignmentGuides = scanAssignmentGuides();

  const lectures = courseData.lectures.map(lec => ({
    ...lec,
    status: generatedNumbers.has(lec.number) ? 'completed' : 'upcoming',
    lessonFile: generatedLessons.find(l => l.number === lec.number)?.path || null
  }));

  const assignments = courseData.assignments.map(asgn => ({
    ...asgn,
    assGuideFile: assignmentGuides[asgn.number] || null
  }));

  res.json({
    lectures,
    assignments,
    generatedCount: generatedLessons.length,
    totalLectures: courseData.lectures.length
  });
});

// 主页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🎓 CS336 课程仪表盘已启动`);
  console.log(`   访问: http://localhost:${PORT}\n`);
});
