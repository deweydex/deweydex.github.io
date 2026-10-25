---
id: projects
title: What I am working on
---
Each project began with a problem in a class, or with a tool I wanted and could not find. Everything runs in a web browser, and the code is public, so you may read it, copy it and change it. Some entries are attempts that I keep revising.

**Computer science:** [dewlab](#dewlab), [dewsharp](#dewsharp), [HTML, CSS and SQL lessons](#html-css-sql-lessons), [a one-page introduction](#one-page-intro), [starter websites](#starter-sites), [from a click to a database](#click-to-database)  
**Mathematics:** [dewmath](#dewmath), [worksheets](#worksheets), [retirement planner](#retirement-planner)  
**Literacy:** [AI literacy workshops](#ai-literacy), [coding with AI](#coding-with-ai), [media and critical literacy](#media-literacy), [project guides and reflections](#guides)

### Computer science

#### dewlab { #dewlab }

*Learn programming, mathematics, databases and web development by running code in the browser.*

**The problem.** A beginner often meets code in a tutorial that they cannot run, or has to install software before they can write a line. By the time the setup works, the curiosity has faded.

**The idea.** Each lesson puts a short explanation and editable code side by side on one page, and the code runs in the browser. The code is mostly Python, a programming language that is often used to teach beginners. A learner can search for a topic, and the search also finds a lesson that teaches the idea under another name, so "loop" finds "iteration".

**What I hope learners do.** Try something, see the result at once and change one thing. I want learners to learn by experimenting rather than by copying a finished answer.

[Open dewlab](https://deweydex.github.io/dewlab) · [Code on GitHub](https://github.com/deweydex/dewlab)

#### dewsharp { #dewsharp }

*C# lessons that run in a web browser.*

**The problem.** C# (pronounced "C sharp") is a programming language that some of my courses use, and a student normally has to install a large program before they can write any. The first week then goes on installation rather than on ideas.

**The idea.** A lesson explains an idea, and the learner edits the C# beside it and runs it on the page. The code runs on the learner's own computer, and nothing they type is sent anywhere. Any program can be downloaded as a Visual Studio project, which is the program many people use to write C# on their own computer.

**What I hope learners do.** Spend the first lessons on variables, loops and decisions. The move to the real tool comes later, when the ideas are already familiar.

[Open dewsharp](https://deweydex.github.io/dewsharp) · [Code on GitHub](https://github.com/deweydex/dewsharp)

#### HTML, CSS and SQL lessons { #html-css-sql-lessons }

*Thirteen lessons on building a website, and two SQL quizzes.*

**The problem.** Building a website means learning several languages at once: HTML, which gives a page its structure, and CSS, which styles it. Beginners can feel overwhelmed. A database adds a third language, SQL, which asks the database questions.

**The idea.** Each lesson teaches one idea, from HTML basics through layout and pages that work on a phone to publishing a site with GitHub Pages, a free way to put a website online. The two SQL quizzes wrap the questions in a story. In the plushies quiz the learner looks after a shop full of toys, and the timetable quiz uses a school week to practise joins, which combine information from two tables.

**What I hope learners do.** Finish with a real website that is online and belongs to the learner. In the quizzes, answer SQL questions that matter inside a story instead of in the abstract.

[Open the lessons](https://deweydex.github.io/WADB_Tutorials) · [Code on GitHub](https://github.com/deweydex/WADB_Tutorials)

#### HTML, CSS and SQL on one page { #one-page-intro }

*A short interactive page that gives a first taste.*

**The problem.** A person who is deciding whether to learn web development may not want to commit to thirteen lessons first.

**The idea.** One page teaches a little HTML, CSS and SQL, with examples that the reader edits and runs.

**What I hope learners do.** Learn that these languages are approachable, and that nothing they try can break anything.

[Open the page](https://deweydex.github.io/HTML-CSS-SQL-JS) · [Code on GitHub](https://github.com/deweydex/HTML-CSS-SQL-JS)

#### Starter websites { #starter-sites }

*Two websites for students to copy and make their own.*

**The problem.** A blank folder is a hard place to begin a website, and many students stall before they write anything.

**The idea.** The **project template** has five pages: Home, About, Gallery, Contact and Resources. The links appear in the same order on every page, which is what makes a site feel consistent. Placeholder text says what belongs in each part, and comments in the code explain why the structure works. The **portfolio template** is a smaller personal site. A student copies a template into their own GitHub account, a free online home for code.

**What I hope learners do.** Study how a good site is built, and then replace the text, restyle the pages and publish the result.

[Open the project template](https://deweydex.github.io/project_wad) · [Open the portfolio template](https://deweydex.github.io/portfolio_wad) · [Code for the project template](https://github.com/deweydex/project_wad) · [Code for the portfolio template](https://github.com/deweydex/portfolio_wad)

#### From a click to a database { #click-to-database }

*A walk through everything that happens when you press a button on a web page.*

**The problem.** Pressing a button changes the screen, and the steps in between are invisible. Each step is usually taught on its own, so students rarely see how the pieces connect.

**The idea.** The tutorial follows one small project, a vending machine page, from the click to the database and back. Every line of code is explained beside it. The steps are the browser, the network, a server, an API (the agreed way that a page asks a server for something), SQL, a database, JSON (a plain text format for passing data around) and the DOM (the browser's live model of the page). There are two editions that build the same page, one with the server in Python and one with it in TypeScript.

**What I hope learners do.** Name each step, say what it hands to the next, and notice that the design stays the same when the language changes.

[Open the tutorial](https://deweydex.github.io/E2E) · [Code on GitHub](https://github.com/deweydex/E2E)

### Mathematics

#### dewmath { #dewmath }

*A maths test that shows why a student answered wrongly, and not only whether they did.*

**The problem.** On the first day of a maths class I do not know what each student already understands. A mark does not say why an answer was wrong.

**The idea.** A teacher chooses the skills to ask about at three levels, foundation, core and advanced, and sets the wording, the order and a time limit. Everything is packed into one link that students open. A student can answer "I don't know" or "I don't understand" and can say how confident they are. Each wrong answer is matched to the misunderstanding that most likely caused it, and the class report shows which misunderstandings are common.

**What I hope learners do.** Answer honestly without guessing, and learn to judge how sure they are. The teacher then starts from the common misunderstandings.

[Open dewmath](https://deweydex.github.io/dewmath) · [Code on GitHub](https://github.com/deweydex/dewmath)

#### Mathematics worksheets { #worksheets }

*Worksheets on fractions, algebra, graphs, calculus and statistics.*

**The problem.** Many worksheets state a rule and then ask for practice, so a learner follows the rule without seeing why it works.

**The idea.** Each worksheet begins with something to try and notice. The words and rules come after that. The set of eighteen runs from fractions through lines and vectors, quadratics and graphing, calculus and trigonometry to statistics and probability. Each comes as a PDF to print and as a TeX file to change, and one also comes as a notebook, which is a document that mixes writing with code that runs.

**What I hope learners do.** Notice a pattern first and name it afterwards, so that the rule feels like something they found. Teachers are welcome to print and adapt the worksheets.

[Open the worksheets](maths-worksheets/) · [Code on GitHub](https://github.com/deweydex/Mathematics)

#### Retirement planner { #retirement-planner }

*A model that follows a family's savings, income and spending through retirement, year by year.*

**The problem.** Retirement planning rests on guesses about markets and about how long people will live. A spreadsheet can hold the guesses, but it is awkward to change one and watch what happens.

**The idea.** A user enters each person's age, income, accounts and spending, and the planner shows year by year whether the money lasts. It uses United States account types, such as IRAs and 401(k) plans, which are accounts for retirement savings, and it taxes each one by its own rules. A user can compare scenarios, and a stress test replaces the usual investment return with a lower one.

**What I hope learners do.** See how an assumption changes an outcome, and ask whether a plan survives a poor year instead of whether it predicts the future. It is a tool for thinking and it is not financial advice.

[Open the planner](https://deweydex.github.io/planningtools) · [Code on GitHub](https://github.com/deweydex/planningtools)

### Literacy

#### AI literacy workshops { #ai-literacy }

*Workshops and handouts about what large language models are and how people use them.*

**The problem.** People use chatbots such as ChatGPT and Claude every day, and most have never been shown how they work or where they fail. Some fear them, and others trust them without checking.

**The idea.** A large language model is a program trained on a great deal of text so that it can write and answer questions in ordinary language. I run workshops for teachers, some with no code and some in which we build a small neural network ourselves, and I give talks for parents. The materials are drafts that I change after each session.

**What I hope learners do.** Examine these tools carefully, so that they can say what a tool is good for and what it gets wrong.

[Open the AI literacy page](ai-literacy/)

#### Coding with AI { #coding-with-ai }

*A single session in which a learner builds a small program together with an AI assistant.*

**The problem.** An AI assistant can write a program for a learner, which makes it easy to produce code without understanding it.

**The idea.** In 80 to 90 minutes a learner picks one of five small projects and works through it with an AI assistant. A prompt is the instruction a person gives an AI tool, and the site includes a guide to writing good ones. It also has a page for teachers.

**What I hope learners do.** Break a problem into small pieces, describe each piece clearly, and check what the assistant produces. The learner stays the one who decides what to build.

[Open the activity](https://deweydex.github.io/2plus1Coding) · [Code on GitHub](https://github.com/deweydex/2plus1Coding)

#### Media and critical literacy { #media-literacy }

*How to read a source, a news story or an argument with care.*

**The problem.** A fact can be true and still mislead, because of what the story around it leaves out. Students often meet sources before they have words for asking who made them and why.

**The idea.** In my courses on research and study skills and on communication, students take one ordinary subject, such as the banana, and look at it through different frames. Each frame brings forward different true facts.

**What I hope learners do.** Choose a frame on purpose, say why they chose it, and notice what the frame leaves out.

[Open the page](media-and-critical-literacy/)

#### Project guides and reflections { #guides }

*Plain accounts of how I think about learning and teaching.*

**The problem.** I kept explaining the same things to students: how to get unstuck, how to approach mathematics after a bad school experience, and why I teach mathematics through programming.

**The idea.** I wrote the explanations down as guides for learners and as reflections for other teachers. They are attempts, and I revise them.

**What I hope learners do.** Find a way into a subject that suits them, and feel less alone with the difficulty of learning it.

[Open the guides](project-guides-and-reflections/)
