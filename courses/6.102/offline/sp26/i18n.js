/* MIT 6.102 SP26 — shared EN / 中文 page switch */
(function () {
  'use strict';

  const script = document.currentScript;
  const rootUrl = script && script.src
    ? new URL('.', script.src)
    : new URL('/courses/6.102/offline/sp26/', document.baseURI);
  const rootPath = rootUrl.pathname.endsWith('/') ? rootUrl.pathname : `${rootUrl.pathname}/`;
  const STATIC_HTML_PAGES = new Set([
    "announcements.html",
    "calendar-agenda.html",
    "calendar.html",
    "classes/01-static-checking/index.html",
    "classes/01-static-checking/zh/index.html",
    "classes/02-testing/index.html",
    "classes/02-testing/zh/index.html",
    "classes/03-code-review/index.html",
    "classes/03-code-review/zh/index.html",
    "classes/04-specifications/index.html",
    "classes/04-specifications/zh/index.html",
    "classes/05-designing-specs/index.html",
    "classes/05-designing-specs/zh/index.html",
    "classes/06-abstract-data-types/index.html",
    "classes/06-abstract-data-types/zh/index.html",
    "classes/07-abstraction-functions-rep-invariants/code.html",
    "classes/07-abstraction-functions-rep-invariants/index.html",
    "classes/07-abstraction-functions-rep-invariants/zh/code.html",
    "classes/07-abstraction-functions-rep-invariants/zh/index.html",
    "classes/08-interfaces-subtyping/index.html",
    "classes/08-interfaces-subtyping/zh/index.html",
    "classes/09-equality/index.html",
    "classes/09-equality/zh/index.html",
    "classes/10-functional-programming/code.html",
    "classes/10-functional-programming/index.html",
    "classes/10-functional-programming/zh/code.html",
    "classes/10-functional-programming/zh/index.html",
    "classes/11-recursive-data-types/index.html",
    "classes/11-recursive-data-types/recursion-and-iteration-review.html",
    "classes/11-recursive-data-types/recursion-review.html",
    "classes/11-recursive-data-types/zh/index.html",
    "classes/11-recursive-data-types/zh/recursion-and-iteration-review.html",
    "classes/11-recursive-data-types/zh/recursion-review.html",
    "classes/12-grammars-parsing/code.html",
    "classes/12-grammars-parsing/index.html",
    "classes/12-grammars-parsing/zh/code.html",
    "classes/12-grammars-parsing/zh/index.html",
    "classes/13-debugging/index.html",
    "classes/13-debugging/zh/index.html",
    "classes/14-concurrency/index.html",
    "classes/14-concurrency/zh/index.html",
    "classes/15-promises/index.html",
    "classes/15-promises/zh/index.html",
    "classes/16-mutual-exclusion/code.html",
    "classes/16-mutual-exclusion/index.html",
    "classes/16-mutual-exclusion/zh/code.html",
    "classes/16-mutual-exclusion/zh/index.html",
    "classes/17-callbacks-guis/addendum.html",
    "classes/17-callbacks-guis/code.html",
    "classes/17-callbacks-guis/index.html",
    "classes/17-callbacks-guis/zh/addendum.html",
    "classes/17-callbacks-guis/zh/code.html",
    "classes/17-callbacks-guis/zh/index.html",
    "classes/18-message-passing-networking/code.html",
    "classes/18-message-passing-networking/index.html",
    "classes/18-message-passing-networking/zh/code.html",
    "classes/18-message-passing-networking/zh/index.html",
    "classes/19-little-languages/code.html",
    "classes/19-little-languages/index.html",
    "classes/19-little-languages/zh/code.html",
    "classes/19-little-languages/zh/index.html",
    "exams/archive/index.html",
    "exams/archive/zh/index.html",
    "general/code-review.html",
    "general/collaboration.html",
    "general/further-reading.html",
    "general/index.html",
    "general/previous-semesters.html",
    "general/staff.html",
    "general/toc.html",
    "general/zh/code-review.html",
    "general/zh/collaboration.html",
    "general/zh/further-reading.html",
    "general/zh/index.html",
    "general/zh/previous-semesters.html",
    "general/zh/staff.html",
    "general/zh/toc.html",
    "inclass/ic01-static-checking/index.html",
    "index.html",
    "project/starb/browser.html",
    "project/starb/index.html",
    "project/starb/pull-req-review.html",
    "project/starb/reflection.html",
    "project/starb/team-contract.html",
    "project/starb/testing.html",
    "project/starb/zh/browser.html",
    "project/starb/zh/index.html",
    "project/starb/zh/pull-req-review.html",
    "project/starb/zh/reflection.html",
    "project/starb/zh/team-contract.html",
    "project/starb/zh/testing.html",
    "psets/ps0/addendum.html",
    "psets/ps0/doc/classes/turtle.DrawableTurtle.html",
    "psets/ps0/doc/classes/turtle.LineSegment.html",
    "psets/ps0/doc/classes/turtle.Point.html",
    "psets/ps0/doc/enums/turtle.PenColor.html",
    "psets/ps0/doc/functions/turtlesoup.chordLength.html",
    "psets/ps0/doc/functions/turtlesoup.distance.html",
    "psets/ps0/doc/functions/turtlesoup.drawApproximateCircle.html",
    "psets/ps0/doc/functions/turtlesoup.drawPersonalArt.html",
    "psets/ps0/doc/functions/turtlesoup.drawSquare.html",
    "psets/ps0/doc/functions/turtlesoup.findPath.html",
    "psets/ps0/doc/functions/turtlesoup.main.html",
    "psets/ps0/doc/index.html",
    "psets/ps0/doc/interfaces/turtle.Turtle.html",
    "psets/ps0/doc/modules/turtle.html",
    "psets/ps0/doc/modules/turtlesoup.html",
    "psets/ps0/index.html",
    "psets/ps0/reflection/alpha.html",
    "psets/ps0/reflection/beta.html",
    "psets/ps0/zh/addendum.html",
    "psets/ps0/zh/doc/classes/turtle.DrawableTurtle.html",
    "psets/ps0/zh/doc/classes/turtle.LineSegment.html",
    "psets/ps0/zh/doc/classes/turtle.Point.html",
    "psets/ps0/zh/doc/enums/turtle.PenColor.html",
    "psets/ps0/zh/doc/functions/turtlesoup.chordLength.html",
    "psets/ps0/zh/doc/functions/turtlesoup.distance.html",
    "psets/ps0/zh/doc/functions/turtlesoup.drawApproximateCircle.html",
    "psets/ps0/zh/doc/functions/turtlesoup.drawPersonalArt.html",
    "psets/ps0/zh/doc/functions/turtlesoup.drawSquare.html",
    "psets/ps0/zh/doc/functions/turtlesoup.findPath.html",
    "psets/ps0/zh/doc/functions/turtlesoup.main.html",
    "psets/ps0/zh/doc/index.html",
    "psets/ps0/zh/doc/interfaces/turtle.Turtle.html",
    "psets/ps0/zh/doc/modules/turtle.html",
    "psets/ps0/zh/doc/modules/turtlesoup.html",
    "psets/ps0/zh/index.html",
    "psets/ps0/zh/reflection/alpha.html",
    "psets/ps0/zh/reflection/beta.html",
    "psets/ps1/doc/functions/lib_animate.animateToFile.html",
    "psets/ps1/doc/functions/src_colors.fillGradient.html",
    "psets/ps1/doc/functions/src_colors.interpolate.html",
    "psets/ps1/doc/functions/src_colors.lerpColor.html",
    "psets/ps1/doc/functions/src_colors.makePalette.html",
    "psets/ps1/doc/functions/src_curves.bezierInterpolate.html",
    "psets/ps1/doc/functions/src_curves.bezierPath.html",
    "psets/ps1/doc/functions/src_lerp.lerp.html",
    "psets/ps1/doc/functions/src_toolbox.handoutExampleOne.html",
    "psets/ps1/doc/functions/src_toolbox.handoutExampleTwo.html",
    "psets/ps1/doc/functions/src_toolbox.todo.html",
    "psets/ps1/doc/functions/src_utils.assertApproxEqual.html",
    "psets/ps1/doc/functions/src_utils.hslToRgb.html",
    "psets/ps1/doc/functions/src_utils.rgbToHsl.html",
    "psets/ps1/doc/index.html",
    "psets/ps1/doc/modules/lib_animate.html",
    "psets/ps1/doc/modules/src_colors.html",
    "psets/ps1/doc/modules/src_curves.html",
    "psets/ps1/doc/modules/src_lerp.html",
    "psets/ps1/doc/modules/src_toolbox.html",
    "psets/ps1/doc/modules/src_utils.html",
    "psets/ps1/doc/types/lib_animate.Animation.html",
    "psets/ps1/doc/types/lib_animate.Frame.html",
    "psets/ps1/doc/types/lib_animate.Polyline.html",
    "psets/ps1/doc/types/src_colors.Color.html",
    "psets/ps1/doc/types/src_curves.Point.html",
    "psets/ps1/doc/variables/lib_animate.framerate.html",
    "psets/ps1/doc/variables/src_lerp.forTestingOnly.html",
    "psets/ps1/doc/variables/src_utils.defaultTolerance.html",
    "psets/ps1/index.html",
    "psets/ps1/reflection/alpha.html",
    "psets/ps1/reflection/beta.html",
    "psets/ps1/zh/index.html",
    "psets/ps1/zh/reflection/alpha.html",
    "psets/ps1/zh/reflection/beta.html",
    "psets/ps2/doc/classes/interval.Interval.html",
    "psets/ps2/doc/classes/intervalset-impls.RepArrayIntervalSet.html",
    "psets/ps2/doc/classes/intervalset-impls.RepMapIntervalSet.html",
    "psets/ps2/doc/classes/intervalset.IntervalConflictError.html",
    "psets/ps2/doc/classes/multiintervalset.MultiIntervalSet.html",
    "psets/ps2/doc/functions/intervalset-impls.implementationsForTesting.html",
    "psets/ps2/doc/functions/intervalset.makeIntervalSet.html",
    "psets/ps2/doc/functions/similarity.similarity.html",
    "psets/ps2/doc/index.html",
    "psets/ps2/doc/interfaces/intervalset.IntervalSet.html",
    "psets/ps2/doc/modules/interval.html",
    "psets/ps2/doc/modules/intervalset-impls.html",
    "psets/ps2/doc/modules/intervalset.html",
    "psets/ps2/doc/modules/multiintervalset.html",
    "psets/ps2/doc/modules/similarity.html",
    "psets/ps2/doc/types/similarity.LabelSimilarity.html",
    "psets/ps2/index.html",
    "psets/ps2/reflection/alpha.html",
    "psets/ps2/reflection/beta.html",
    "psets/ps2/zh/doc/classes/interval.Interval.html",
    "psets/ps2/zh/doc/classes/intervalset-impls.RepArrayIntervalSet.html",
    "psets/ps2/zh/doc/classes/intervalset-impls.RepMapIntervalSet.html",
    "psets/ps2/zh/doc/classes/intervalset.IntervalConflictError.html",
    "psets/ps2/zh/doc/classes/multiintervalset.MultiIntervalSet.html",
    "psets/ps2/zh/doc/functions/intervalset-impls.implementationsForTesting.html",
    "psets/ps2/zh/doc/functions/intervalset.makeIntervalSet.html",
    "psets/ps2/zh/doc/functions/similarity.similarity.html",
    "psets/ps2/zh/doc/index.html",
    "psets/ps2/zh/doc/interfaces/intervalset.IntervalSet.html",
    "psets/ps2/zh/doc/modules/interval.html",
    "psets/ps2/zh/doc/modules/intervalset-impls.html",
    "psets/ps2/zh/doc/modules/intervalset.html",
    "psets/ps2/zh/doc/modules/multiintervalset.html",
    "psets/ps2/zh/doc/modules/similarity.html",
    "psets/ps2/zh/doc/types/similarity.LabelSimilarity.html",
    "psets/ps2/zh/index.html",
    "psets/ps2/zh/reflection/alpha.html",
    "psets/ps2/zh/reflection/beta.html",
    "psets/ps3/doc/classes/imagelibrary.ImageLibrary.html",
    "psets/ps3/doc/functions/commands.image.html",
    "psets/ps3/doc/functions/commands.size.html",
    "psets/ps3/doc/functions/expression.parse.html",
    "psets/ps3/doc/functions/expressionparser.parseExpression.html",
    "psets/ps3/doc/functions/imagelibrary.createCanvas.html",
    "psets/ps3/doc/index.html",
    "psets/ps3/doc/interfaces/expression.MemeExpression.html",
    "psets/ps3/doc/interfaces/imagelibrary.Canvas.html",
    "psets/ps3/doc/interfaces/imagelibrary.Image.html",
    "psets/ps3/doc/interfaces/imagelibrary.TextMetrics.html",
    "psets/ps3/doc/modules/commands.html",
    "psets/ps3/doc/modules/expression.html",
    "psets/ps3/doc/modules/expressionparser.html",
    "psets/ps3/doc/modules/imagelibrary.html",
    "psets/ps3/index.html",
    "psets/ps3/reflection/alpha.html",
    "psets/ps3/reflection/beta.html",
    "psets/ps3/zh/doc/classes/imagelibrary.ImageLibrary.html",
    "psets/ps3/zh/doc/functions/commands.image.html",
    "psets/ps3/zh/doc/functions/commands.size.html",
    "psets/ps3/zh/doc/functions/expression.parse.html",
    "psets/ps3/zh/doc/functions/expressionparser.parseExpression.html",
    "psets/ps3/zh/doc/functions/imagelibrary.createCanvas.html",
    "psets/ps3/zh/doc/index.html",
    "psets/ps3/zh/doc/interfaces/expression.MemeExpression.html",
    "psets/ps3/zh/doc/interfaces/imagelibrary.Canvas.html",
    "psets/ps3/zh/doc/interfaces/imagelibrary.Image.html",
    "psets/ps3/zh/doc/interfaces/imagelibrary.TextMetrics.html",
    "psets/ps3/zh/doc/modules/commands.html",
    "psets/ps3/zh/doc/modules/expression.html",
    "psets/ps3/zh/doc/modules/expressionparser.html",
    "psets/ps3/zh/doc/modules/imagelibrary.html",
    "psets/ps3/zh/index.html",
    "psets/ps3/zh/reflection/alpha.html",
    "psets/ps3/zh/reflection/beta.html",
    "psets/ps4/doc/classes/board.Board.html",
    "psets/ps4/doc/functions/commands.flip.html",
    "psets/ps4/doc/functions/commands.look.html",
    "psets/ps4/doc/functions/commands.map.html",
    "psets/ps4/doc/functions/commands.watch.html",
    "psets/ps4/doc/index.html",
    "psets/ps4/doc/modules/board.html",
    "psets/ps4/doc/modules/commands.html",
    "psets/ps4/index.html",
    "psets/ps4/reflection/alpha.html",
    "psets/ps4/reflection/beta.html",
    "psets/ps4/zh/doc/classes/board.Board.html",
    "psets/ps4/zh/doc/functions/commands.flip.html",
    "psets/ps4/zh/doc/functions/commands.look.html",
    "psets/ps4/zh/doc/functions/commands.map.html",
    "psets/ps4/zh/doc/functions/commands.watch.html",
    "psets/ps4/zh/doc/index.html",
    "psets/ps4/zh/doc/modules/board.html",
    "psets/ps4/zh/doc/modules/commands.html",
    "psets/ps4/zh/index.html",
    "psets/ps4/zh/reflection/alpha.html",
    "psets/ps4/zh/reflection/beta.html",
    "search.html",
    "tools/faq/index.html",
    "tools/faq/zh/index.html",
    "tools/getting-started/index.html",
    "tools/getting-started/zh/index.html",
    "tools/git-1-version-control/index.html",
    "tools/git-1-version-control/zh/index.html",
    "tools/git-2-disaster-recovery/index.html",
    "tools/git-2-disaster-recovery/zh/index.html",
    "tools/git-3-team-version-control/index.html",
    "tools/git-3-team-version-control/zh/index.html",
    "tools/typescript/index.html",
    "tools/typescript/zh/index.html",
    "zh/announcements.html",
    "zh/calendar-agenda.html",
    "zh/calendar.html",
    "zh/classes/01-static-checking/index.html",
    "zh/classes/02-testing/index.html",
    "zh/classes/03-code-review/index.html",
    "zh/classes/04-specifications/index.html",
    "zh/classes/05-designing-specs/index.html",
    "zh/classes/06-abstract-data-types/index.html",
    "zh/classes/07-abstraction-functions-rep-invariants/index.html",
    "zh/classes/08-interfaces-subtyping/index.html",
    "zh/classes/09-equality/index.html",
    "zh/classes/10-functional-programming/index.html",
    "zh/classes/11-recursive-data-types/index.html",
    "zh/classes/11-recursive-data-types/recursion-and-iteration-review.html",
    "zh/classes/11-recursive-data-types/recursion-review.html",
    "zh/classes/12-grammars-parsing/code.html",
    "zh/classes/12-grammars-parsing/index.html",
    "zh/classes/13-debugging/index.html",
    "zh/classes/14-concurrency/index.html",
    "zh/classes/15-promises/index.html",
    "zh/classes/16-mutual-exclusion/code.html",
    "zh/classes/16-mutual-exclusion/index.html",
    "zh/classes/17-callbacks-guis/addendum.html",
    "zh/classes/17-callbacks-guis/code.html",
    "zh/classes/17-callbacks-guis/index.html",
    "zh/classes/18-message-passing-networking/code.html",
    "zh/classes/18-message-passing-networking/index.html",
    "zh/classes/19-little-languages/code.html",
    "zh/classes/19-little-languages/index.html",
    "zh/exams/archive/index.html",
    "zh/general/code-review.html",
    "zh/general/collaboration.html",
    "zh/general/further-reading.html",
    "zh/general/index.html",
    "zh/general/previous-semesters.html",
    "zh/general/staff.html",
    "zh/general/toc.html",
    "zh/index.html",
    "zh/project/starb/browser.html",
    "zh/project/starb/index.html",
    "zh/project/starb/pull-req-review.html",
    "zh/project/starb/reflection.html",
    "zh/project/starb/team-contract.html",
    "zh/project/starb/testing.html",
    "zh/psets/ps0/addendum.html",
    "zh/psets/ps0/doc/classes/turtle.DrawableTurtle.html",
    "zh/psets/ps0/doc/classes/turtle.LineSegment.html",
    "zh/psets/ps0/doc/classes/turtle.Point.html",
    "zh/psets/ps0/doc/enums/turtle.PenColor.html",
    "zh/psets/ps0/doc/functions/turtlesoup.chordLength.html",
    "zh/psets/ps0/doc/functions/turtlesoup.distance.html",
    "zh/psets/ps0/doc/functions/turtlesoup.drawApproximateCircle.html",
    "zh/psets/ps0/doc/functions/turtlesoup.drawPersonalArt.html",
    "zh/psets/ps0/doc/functions/turtlesoup.drawSquare.html",
    "zh/psets/ps0/doc/functions/turtlesoup.findPath.html",
    "zh/psets/ps0/doc/functions/turtlesoup.main.html",
    "zh/psets/ps0/doc/index.html",
    "zh/psets/ps0/doc/interfaces/turtle.Turtle.html",
    "zh/psets/ps0/doc/modules/turtle.html",
    "zh/psets/ps0/doc/modules/turtlesoup.html",
    "zh/psets/ps0/index.html",
    "zh/psets/ps0/reflection/alpha.html",
    "zh/psets/ps0/reflection/beta.html",
    "zh/psets/ps1/index.html",
    "zh/psets/ps2/doc/classes/interval.Interval.html",
    "zh/psets/ps2/doc/classes/intervalset-impls.RepArrayIntervalSet.html",
    "zh/psets/ps2/doc/classes/intervalset-impls.RepMapIntervalSet.html",
    "zh/psets/ps2/doc/classes/intervalset.IntervalConflictError.html",
    "zh/psets/ps2/doc/classes/multiintervalset.MultiIntervalSet.html",
    "zh/psets/ps2/doc/functions/intervalset-impls.implementationsForTesting.html",
    "zh/psets/ps2/doc/functions/intervalset.makeIntervalSet.html",
    "zh/psets/ps2/doc/functions/similarity.similarity.html",
    "zh/psets/ps2/doc/index.html",
    "zh/psets/ps2/doc/interfaces/intervalset.IntervalSet.html",
    "zh/psets/ps2/doc/modules/interval.html",
    "zh/psets/ps2/doc/modules/intervalset-impls.html",
    "zh/psets/ps2/doc/modules/intervalset.html",
    "zh/psets/ps2/doc/modules/multiintervalset.html",
    "zh/psets/ps2/doc/modules/similarity.html",
    "zh/psets/ps2/doc/types/similarity.LabelSimilarity.html",
    "zh/psets/ps2/index.html",
    "zh/psets/ps2/reflection/alpha.html",
    "zh/psets/ps2/reflection/beta.html",
    "zh/psets/ps3/doc/classes/imagelibrary.ImageLibrary.html",
    "zh/psets/ps3/doc/functions/commands.image.html",
    "zh/psets/ps3/doc/functions/commands.size.html",
    "zh/psets/ps3/doc/functions/expression.parse.html",
    "zh/psets/ps3/doc/functions/expressionparser.parseExpression.html",
    "zh/psets/ps3/doc/functions/imagelibrary.createCanvas.html",
    "zh/psets/ps3/doc/index.html",
    "zh/psets/ps3/doc/interfaces/expression.MemeExpression.html",
    "zh/psets/ps3/doc/interfaces/imagelibrary.Canvas.html",
    "zh/psets/ps3/doc/interfaces/imagelibrary.Image.html",
    "zh/psets/ps3/doc/interfaces/imagelibrary.TextMetrics.html",
    "zh/psets/ps3/doc/modules/commands.html",
    "zh/psets/ps3/doc/modules/expression.html",
    "zh/psets/ps3/doc/modules/expressionparser.html",
    "zh/psets/ps3/doc/modules/imagelibrary.html",
    "zh/psets/ps3/index.html",
    "zh/psets/ps3/reflection/alpha.html",
    "zh/psets/ps3/reflection/beta.html",
    "zh/psets/ps4/doc/classes/board.Board.html",
    "zh/psets/ps4/doc/functions/commands.flip.html",
    "zh/psets/ps4/doc/functions/commands.look.html",
    "zh/psets/ps4/doc/functions/commands.map.html",
    "zh/psets/ps4/doc/functions/commands.watch.html",
    "zh/psets/ps4/doc/index.html",
    "zh/psets/ps4/doc/modules/board.html",
    "zh/psets/ps4/doc/modules/commands.html",
    "zh/psets/ps4/index.html",
    "zh/psets/ps4/reflection/alpha.html",
    "zh/psets/ps4/reflection/beta.html",
    "zh/search.html",
    "zh/tools/faq/index.html",
    "zh/tools/getting-started/index.html",
    "zh/tools/git-1-version-control/index.html",
    "zh/tools/git-2-disaster-recovery/index.html",
    "zh/tools/git-3-team-version-control/index.html",
    "zh/tools/typescript/index.html",
  ]);

  function relativePath(pathname = window.location.pathname) {
    return pathname.startsWith(rootPath) ? pathname.slice(rootPath.length) : pathname.replace(/^\//, '');
  }

  function pageUrl(relative) {
    return new URL(relative, rootUrl);
  }

  function isRootChinesePath(relative) {
    return relative === 'zh' || relative.startsWith('zh/');
  }

  function chineseSegmentIndex(relative) {
    const parts = relative.split('/');
    return parts.lastIndexOf('zh');
  }

  function currentLanguage(relative) {
    return isRootChinesePath(relative) || chineseSegmentIndex(relative) !== -1 ? 'zh' : 'en';
  }

  const currentRelative = relativePath();
  const currentLang = currentLanguage(currentRelative);

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function candidatePaths(target) {
    if (target === currentLang) return [currentRelative];

    if (target === 'zh') {
      const slash = currentRelative.lastIndexOf('/');
      const directory = slash === -1 ? '' : currentRelative.slice(0, slash);
      const filename = currentRelative.slice(slash + 1);
      const inPlace = directory ? `${directory}/zh/${filename}` : `zh/${filename}`;
      const rootMirror = `zh/${currentRelative}`;
      return unique([inPlace, rootMirror]);
    }

    if (isRootChinesePath(currentRelative)) {
      return [currentRelative.replace(/^zh\/?/, '')];
    }

    const parts = currentRelative.split('/');
    const zhIndex = chineseSegmentIndex(currentRelative);
    if (zhIndex !== -1) parts.splice(zhIndex, 1);
    return [parts.join('/')];
  }

  function chineseCandidatesForEnglish(relative) {
    const slash = relative.lastIndexOf('/');
    const directory = slash === -1 ? '' : relative.slice(0, slash);
    const filename = relative.slice(slash + 1);
    const inPlace = directory ? `${directory}/zh/${filename}` : `zh/${filename}`;
    return unique([inPlace, `zh/${relative}`]);
  }

  async function pageExists(relative) {
    if (window.location.protocol === 'file:') return STATIC_HTML_PAGES.has(relative);
    try {
      const response = await fetch(pageUrl(relative), { method: 'HEAD', cache: 'no-store' });
      if (response.ok) return true;
      if (response.status === 405) {
        const fallback = await fetch(pageUrl(relative), { cache: 'no-store' });
        return fallback.ok;
      }
      return false;
    } catch (_error) {
      // Local file URLs do not expose fetch; let the first candidate work there.
      return null;
    }
  }

  async function findExistingCandidate(candidates) {
    let fetchUnavailable = false;
    for (const candidate of candidates) {
      const exists = await pageExists(candidate);
      if (exists === true) return candidate;
      if (exists === null) fetchUnavailable = true;
    }
    return fetchUnavailable ? candidates[0] : null;
  }

  async function findDestination(target) {
    return findExistingCandidate(candidatePaths(target));
  }

  function preserveUrlParts(url) {
    url.search = window.location.search;
    url.hash = window.location.hash;
    return url.href;
  }

  async function switchLanguage(target) {
    if (target === currentLang) return;
    const destination = await findDestination(target);
    if (!destination) return;
    localStorage.setItem('mit6102-lang', target);
    window.location.assign(preserveUrlParts(pageUrl(destination)));
  }

  async function rewriteRootMirrorLinks() {
    if (!isRootChinesePath(currentRelative)) return;
    const links = [...document.querySelectorAll('a[href]')];
    await Promise.all(links.map(async link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || /^(?:[a-z]+:|\/\/)/i.test(href)) return;
      if (/\.(?:pdf|zip|png|jpe?g|gif|svg|ico|css|js)(?:[?#].*)?$/i.test(href)) return;
      const resolved = new URL(href, window.location.href);
      if (resolved.origin !== window.location.origin) return;
      const resolvedRelative = relativePath(resolved.pathname);
      const englishRelative = resolvedRelative.replace(/^zh\/?/, '');
      const destination = await findExistingCandidate(chineseCandidatesForEnglish(englishRelative));
      if (destination) {
        const destinationUrl = pageUrl(destination);
        destinationUrl.search = resolved.search;
        destinationUrl.hash = resolved.hash;
        link.href = destinationUrl.href;
      }
    }));
  }

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .i18n-switch {
        position: fixed;
        top: 4px;
        right: 12px;
        z-index: 9999;
        display: inline-flex;
        gap: 2px;
        padding: 2px;
        border: 1px solid rgba(255, 255, 255, .58);
        border-radius: 999px;
        background: rgba(42, 32, 84, .42);
        box-shadow: 0 2px 8px rgba(20, 18, 40, .18);
        font-family: inherit;
        line-height: 1;
      }
      .i18n-switch button {
        min-width: 30px;
        padding: 4px 8px;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: rgba(255, 255, 255, .9);
        font: inherit;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        transition: background-color .16s ease, color .16s ease, opacity .16s ease;
      }
      .i18n-switch button:hover:not(:disabled) {
        background: rgba(255, 255, 255, .18);
      }
      .i18n-switch button[aria-pressed="true"] {
        background: #fff;
        color: #5d4f94;
      }
      .i18n-switch button:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 1px;
      }
      .i18n-switch button:disabled {
        cursor: not-allowed;
        opacity: .45;
      }
      @media (max-width: 600px) {
        .i18n-switch {
          top: 4px;
          right: 8px;
        }
        .i18n-switch button {
          min-width: 28px;
          padding-inline: 6px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function addSwitch() {
    if (document.getElementById('i18n-switch')) return document.getElementById('i18n-switch');
    const group = document.createElement('div');
    group.id = 'i18n-switch';
    group.className = 'i18n-switch';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Language / 语言');

    for (const [language, label] of [['en', 'EN'], ['zh', '中文']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.lang = language;
      button.textContent = label;
      button.setAttribute('aria-pressed', String(language === currentLang));
      button.setAttribute('aria-label', language === 'en' ? 'English' : '中文');
      button.addEventListener('click', () => switchLanguage(language));
      group.appendChild(button);
    }

    document.body.appendChild(group);
    return group;
  }

  async function checkChineseAvailability(group) {
    if (currentLang !== 'en') return;
    const chineseButton = group.querySelector('[data-lang="zh"]');
    const destination = await findDestination('zh');
    if (destination) {
      chineseButton.title = '切换到中文';
    } else {
      chineseButton.disabled = true;
      chineseButton.title = '该页面暂无中文版本';
    }
  }

  function init() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    addStyles();
    const group = addSwitch();
    rewriteRootMirrorLinks();
    checkChineseAvailability(group);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
