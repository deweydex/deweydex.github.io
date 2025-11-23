Guides


FAQs: Frequently Asked Questions

This page is under construction! :) 

Am I allowed to use Chat GPT and other LLM/AI tools?



How will I be graded?



How can I improve my grade?





Do I have to do reflections?



Why are there no due dates on assignments? 



What does a Check-In entail?



How much do I have to write for a project update?



How do I know when a project is done?



Will there be any quizzes or tests?



What are assessments?



Do I have to use the online resources you recommend?




Prior Teaching

DCFE: Dundrum College of Further Education
How to Learn Programming

Introduction

This guide will hopefully be a little bit different from most guides out there on how to learn programming in the mid 2020s. I will indeed give some concrete advice about what one can use and steps to get started, but the Resources and Recommendations Page contains more context specific suggestions for specific subjects and use cases.

What Do You Mean By Programming?

In my experience there are at least five types of programming: they are certainly all related, but the task of “learning programming” usually involves starting to learn one of these broader types:

1. Programming Contests or Puzzles
2. Scientific or Financial Programming
3. Programming Applications (Back-end, mid-layer, native)
4. Graphics, Front-End and Web Programming
5. Low-Level Programming

Note that some areas require practices and ideas and languages from more than one of these broad types. In particular, learning how to create computer games likely involves learning several ways of thinking about programming, especially graphics heavy games or games involving complex mechanics. 

There are many philosophies and opinions around what one ought to learn first, I don’t really ascribe to a prescriptive sense of “should” here: learn whatever gets you excited and interested so that you can continue! But if you are learning with me in a class or just on your own, here are a few steps that you might want to think about while tackling a specific project, especially in the beginning when your goals might outstrip your (initial) capabilities.

Aside: if you are learning how to program in order to accomplish something specific, like create a game or an app, diving into one of the other areas of programming might be a nice smooth introduction. In my courses we focus on learning how to learn programming and the connected subjects like math and computer science and how that might reflect 

A Coding Process for Bigger Challenges

When confronted with a programming challenge, especially one which appears to be pretty big and where you aren't sure where to begin, there are a few basic rules of thumb which can do wonders for your confidence and get you on a path toward both understanding the scope of the problems you need to solve and what order you might best approach those problems.

1. Write the introduction or even the entire assignment brief in your own words: This will help you to highlight the parts you find important and also give you a chance to figure out what you don't understand. If the brief is very vague or big like "build a website for yourself" or "create a map for a game and the functions behind it," start by writing out (in words) the smallest simplest thing you can think of that might get the job done. 
2. As you think through a problem (or are having a look through an assignment brief or question), think through and note down what variables you might need and what type of variables they might be. If you are not sure of what datatype to use, think through what you need the variables to do, what they need to store, how they will be manipulated, and then have a look at some documentation about various data structures that might solve that problem. To start, pick the simplest, even if it doesn't meet all of your needs or seems not to be perfect, better to start with something than nothing!
3. Write out a list of the behaviours you would like your program to accomplish: see if you can break down each bigger behaviour like "tell the user where they are located" into as many substeps as you can, for example: provide a prompt to the user and a chance for them to somehow ask where they are, receive user input, process that input amongst a few options (including "where am I?") and the provide an answer to the user based on a variable that we have stored earlier (if you haven't stored a variable, might want to put that at the top of your list of steps).
4. Think through the conditions (if/else statements) you need to check, what variables do you need to check and for what property or amount? If you are able to see how those behaviours might map to functions, think through what you need each function to take as input (what types are those variables, if any?) and what type you need them to output. Feel free to have these if then statements and function definitions kind of hanging loose in your editor with "TODO" comments showing what needs to happen before and after.


NOTE: all of the above can be done in any text document, or on paper, if you would like to try just jumping into code that's fine, some folks are planners, and others write lots of comments in their code that go over these things. 

When you get to the actual coding, don’t be afraid to use the simplest text editor you can! Especially in the beginning, a fully fledged IDE can seem a bit overwhelming, and with so many options and tools available, it can get easy to spend an hour or more configuring and never actually get to solving the problem you intended to. For my courses I recommend using online “lite” IDEs first, whether Jupyter Notebooks, online C# interpeters, Replit, and more. With that in mind, lets dive into what one might do when one starts with a blank screen!

1. Start defining variables and functions with names that make sense to you. A good variable name is one that is descriptive and often might be longer than we would like, the worst thing is an abbreviated name that you can't recognize later! 
2. Comments, even multi-line comments are your friends! Describe your thoughts and intentions as you code, this will help you solve problems before they happen and figure out changes you might need to make later on.
3. Print statements are also your friends! If you need to check the state of a variable before an if statement or during a loop, go ahead and print it out with a little string that says where that print-out happened! Digital ink is free-don't be afraid to have lots of little statements saying what is happening throughout your code, later we will discuss how to turn this kind of thing on and off, but you can always comment out your helper-print statements if you want things to run with less verbiage.
4. Not knowing what is next is normal, not knowing where to begin is normal: starting is more important than being correct. Writing a plan (see 1-3), whether on paper or in an IDE/text editor will help you find your footing but also allow you to ask for help more effectively, "I dont' get it" is not a valid sentence if you are asking for help in life, but "I am stuck on this part of the plan because I don't understand how to do X" shows the person you are asking that you are trying to point them in the right direction. This applies as much to teachers as colleagues, friends, etc. The more you show that you have tried breaking down the problem, the more someone trying to help will be able to zero in on where the gap is. 
5. Everyone uses documentation, learning how documentation works is part of learning how to code and how to solve coding challenges: not remembering something is to be expected, not knowing how to find something just isn't necessary anymore. If you need any other resources or just find the ones you were using to be unsatisfactory in some way, ask around (but maybe don't just blindly search on the web, as you are likely not going to get stuff tailored to your situation). Using documentation to figure out what methods and functions exist and how to use them is what the beginning middle and end of learning to code looks like, just the documentation and the challenges you try to solve get more involved and complex.
6. If there is a brief, complete the minimum required for the brief first, then start expanding and creating more elaborate stuff: it can be too easy to get lost in the part of the project you enjoy and want to dive deep into that one forgets the rest of an assignment. In other contexts, doing the minimum can feel like one is doing enough: in the case of coding, the minimum requirements are usually enough, all that is above that is to be encouraged, but is then about your learning, not fulfilling an assignment.

I am sure there will be more of these as the semester goes on, thanks for helping me learn to be better able to help you all learn! :) JSA


Learning Python

The following are a list of tutorials (contained in Jupyter Notebooks) that I created for learning python that have a focus on Machine Learning, an area that often has a lot of built in “mysticism” these days. On the one hand, these are just a way of learning the basics of python, on the other hand, they are a bit different from other tutorials you might see online. For example, you will notice that there is an invitation to complete these tutorials in any order: while it is true that some of the content is cumulative (builds upon previous lessons) in my experience, a good problem is a better motivator than “the next thing”... so my first recommendation is to spend a few minutes scanning all of the tutorials, if you find an example interesting in a latter tutorial, start with that one and see if you can fill in the necessary material on the fly—you would be surprised how much faster you learn when you go from interesting problem to interesting problem!

Programming Tutorials

Link to Programming tutorials:

Python From Scratch

All Tutorials All Levels


How to Learn Mathematics

What We Learn in School:

In high school, an insitution I dropped out of with the help of supportive parents and a 
How I Recommend Learning to Learn

Note to the reader: For this guide we are going to focus on subject that do not require significant physical space or tools: if you want to learn woodworking or gymnastics or underwater basket weaving, this is not the guide for you.




How I Think About Teaching


How to Learn Computer Science


Learning Math through Programming


Short-form Guides


