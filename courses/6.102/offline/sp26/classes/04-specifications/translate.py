import re

with open('/Users/dax/code/github/Pointbreaker.github.io/courses/6.102/offline/sp26/classes/04-specifications/zh/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

translations = {
    # Behavioral equivalence section
    'Suppose you are working on a program containing this function, which finds the index of an integer in an array:': '假设你正在处理一个包含以下函数的程序，该函数用于查找整数在数组中的索引：',
    'This': '这个',
    'function has many': '函数有许多',
    'in the program (places where the function is called).': '在程序中（调用该函数的地方）。',
    'You\'ve just realized that frequently in this program, when': '你刚刚意识到在这个程序中，当',
    'is called with a large array, the value it finds is likely to be either close to the start of the array (which is very fast to find), or close to the end (which is very slow, because it requires checking almost the entire array).': '被传入一个大数组时，找到的值很可能要么靠近数组开头（查找速度很快），要么靠近数组末尾（查找速度非常慢，因为需要检查几乎整个数组）。',
    'So you have the clever idea to speed things up by searching from both ends of the array at the same time:': '所以你有一个聪明的想法，通过从数组两端同时搜索来加快速度：',
    'Is it safe to replace': '用新实现替换',
    'with this new implementation?': '是否安全？',
    'Can we make this change without introducing bugs?': '我们能在不引入 bug 的情况下进行这个更改吗？',
    'we ask whether we could substitute one implementation for the other without affecting correctness.': '我们要问：是否可以替换实现而不影响正确性。',
    'Not only do these implementations have different performance characteristics, they actually have different output behavior for certain inputs.': '这些实现不仅具有不同的性能特征，对于某些输入，它们实际上具有不同的输出行为。',
    'happens to appear': '碰巧出现',
    'more than once': '多次',
    'in the array, the original': '在数组中，原始',
    'always returns the lowest index at which it occurs.': '总是返回它出现的最低索引。',
    'might return the lowest index or the highest index, whichever it finds first.': '可能返回最低索引或最高索引，取决于哪个先被找到。',
    'occurs at exactly one index of the array, however, the two implementations behave the same: they both return that index.': '恰好出现在数组的一个索引处时，两个实现的行为是相同的：它们都返回该索引。',
    'It may be that the clients never rely on the behavior outside of that case.': '客户端可能从未依赖过该情况之外的行为。',
    'Whenever they call the function, they will be passing in an array with exactly one element matching': '每当他们调用该函数时，他们传入的数组中恰好有一个元素匹配',
    'are the same, and we could switch from one implementation to the other without issue.': '是相同的，我们可以从一个实现切换到另一个实现而不会出现问题。',
    'The notion of behavioral equivalence is in the eye of the beholder — that is, the client.': '行为等价性的概念取决于观察者——也就是说，取决于客户端。',
    'In order to make it possible to substitute one implementation for another, and to know when this is acceptable, we need a specification that states exactly what the client depends on.': '为了使替换实现成为可能，并知道何时这是可接受的，我们需要一个规格说明来准确说明客户端所依赖的内容。',
    'In this case, a specification that would allow these two implementations to be behaviorally equivalent might be:': '在这种情况下，允许这两个实现行为等价的规格说明可能是：',
    '中恰好出现一次': '中恰好出现一次',
    'As we will see in more detail later, the': '正如我们稍后将更详细地看到的，',
    'clause specifies conditions that must be true for a legal call to': '子句指定了对',
    '的合法调用必须为真的条件，': '的合法调用必须为真的条件，',
    'clause specifies how the implementation will behave when the client has made a legal call.': '子句指定了当客户端进行合法调用时实现的行为方式。',
    'reading exercises': '阅读练习',
    'Something\'s missing': '缺少了什么',
    'implementations and specification of': '的实现和规格说明之间存在一个奇怪的差异。',
    'at all!': '！',
    'the spec is still incomplete, and we will need to finish it': '规格说明仍然不完整，我们需要完成它',
    'statements are never reached when': '语句永远不会被执行到',
    'is called legally': '被合法调用时',
    'in the spec covers this case: just make': '这一表述涵盖了这种情况：只需让',
    'the spec only needs to describe its behavior when it is called legally': '规格说明只需要描述其被合法调用时的行为',
    '(missing answer)': '（缺少答案）',
    '(missing explanation)': '（缺少解释）',
    'Order matters': '顺序很重要',
    'spec we just showed will let you make this implementation change safely – but only if that spec existed at the right time!': '规格说明将让你安全地进行这个实现更改——但前提是该规格说明在正确的时间已经存在！',
    'Which ordering of the steps below is safest from bugs?': '以下步骤的哪种排序最能避免 bug？',
    'C: other people write clients using': 'C：其他人使用',
    'I1: you write the original forward-search': 'I1：你编写原始的前向搜索',
    'I2: you write the new forward-and-back': 'I2：你编写新的前后搜索',
    'implementation': '实现',
    'S: you write the spec for': 'S：你编写',
    'shown above': '的规格说明',
    'T: you write a test suite for': 'T：你为',
    'test suite': '测试套件',
    'Behave nicely': '表现良好',
    'which differ not only in the direction they search through the array, but also in what they return if the search fails:': '实现，它们不仅在搜索数组的方面不同，而且在搜索失败时返回的内容也不同：',
    'As we said above, suppose clients only care about calling the': '正如我们上面所说的，假设客户端只关心在知道',
    'function when they know': '函数时调用',
    'In this case, are these two': '在这种情况下，这两个',
    'implementations behaviorally equivalent?': '实现是行为等价的吗？',
    'Best behavior': '最佳行为',
    'Now let\'s change the spec.': '现在让我们更改规格说明。',
    'Suppose clients now care that the': '假设客户端现在关心',
    'function should:': '函数应该：',
    ') return some index': ') 返回某个满足',
    'is not a valid array index.': '。',
    'In this case, are the two': '在这种情况下，',
    'implementations from the previous exercise behaviorally equivalent?': '上一个练习中的两个实现是行为等价的吗？',
}

for eng, chn in translations.items():
    text = text.replace(eng, chn)

with open('/Users/dax/code/github/Pointbreaker.github.io/courses/6.102/offline/sp26/classes/04-specifications/zh/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
