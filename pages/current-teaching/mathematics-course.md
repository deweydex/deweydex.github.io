Mathematics

November 4

Summary of what we have covered so far:

* Matrices as “Box-o-numbers”
* Vectors as “List-o-numbers”
* dot product
* matrix multiplication
* exponents and matrix exponentiation (and some patterns that might arise)
* solving linear equations with matrices (three operations:
  * Swap Rows
  * Add one row to another row (leaving the first row alone)
  * multiply a row by a scalar (this gives us subtraction of one row from another (because of multiplication by a negative number), and division by a scalar (because of multiplication by a fraction))
  * Any combination of the three until we get to the identity matrix on the left and a series of constants on the right.

Practice Problem for Today:

Can you find a 2x2 matrix that multiplies with itself to get -I (the Identity matrix (2x2) times negative 1)? What does that matrix look like? (We will come back to this later). Let's call this the square root of -I or $\sqrt(-I)$ = J. If you finish that can you find something that squares to make J? Did you have to use a different method?

After Midterm Break

After the midterm break we will transition from discussing matrices to discussing probability and functions. Just as a reminder from what we discussed in class, here is our approximate plan for the rest of the college year:

* November-December: Probability, Statistics, and Functions
* January: Functions, Calculus (Basic Derivatives and Integrals), and plotting
* February: Odds and Ends (Trigonometry and Tying things together)
* March: Neural Networks Project with Digit and Letter Recognition, and Exam Review
* April: Exam Review and Exam
* May: Exam Results

October 24:

Today we worked on the first 3 sections of the Lists and Matrices Notebook which you can work on on Colab (just make sure you save a copy in your own drive, or your inputs will not be saved) or download and work on locally. We then discussed how to think about list comprehensions as for loops and how those relate to our matrix operations. Finally we went through the plan for Maths and assignments (in class skills demos) when you return.

October 22:

Today we will got through some of the code for matrix multiplication as well as how things look visually (using the code in the linear algebra notebook that we have been using). We will also discuss a couple examples of “interesting” 2x2 and 3x3 matrices like rotation matrices and scaling matrices to build up our “programming language of matrices” that we discussed last week.

October 21:

Today we explored a couple more examples of 2x2 matrix multiplication as well as taking a matrix to a given power (using exponents). We discussed the pattern that happens when we have the matrix [[1,1],[0,1]] and take it to the nth power.

In addition we went through the indexing that we use with matrices, how this “box of numbers” forces us to have a really clear idea of two indices combined (so we had  data:image/svg+xml;supportsDarkMode=1;base64,PHN2ZyBzdHlsZT0idmVydGljYWwtYWxpZ246IC0wLjMzOWV4OyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMy45ODJleCIgaGVpZ2h0PSIxLjg4NWV4IiByb2xlPSJpbWciIGZvY3VzYWJsZT0iZmFsc2UiIHZpZXdCb3g9IjAgLTY4MyAxNzYwLjEgODMzIj48c3R5bGU+I0RhcmtNb2RlOnRhcmdldCB7IGNvbG9yOiB3aGl0ZTsgfTwvc3R5bGU+PGcgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIGZpbGw9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwIiB0cmFuc2Zvcm09InNjYWxlKDEsLTEpIiBpZD0iRGFya01vZGUiPjxnIGRhdGEtbW1sLW5vZGU9Im1hdGgiPjxnIGRhdGEtbW1sLW5vZGU9Im1zdWIiPjxnIGRhdGEtbW1sLW5vZGU9Im1pIj48cGF0aCBkYXRhLWM9IjFENDQwIiBkPSJNMjg5IDYyOVEyODkgNjM1IDIzMiA2MzdRMjA4IDYzNyAyMDEgNjM4VDE5NCA2NDhRMTk0IDY0OSAxOTYgNjU5UTE5NyA2NjIgMTk4IDY2NlQxOTkgNjcxVDIwMSA2NzZUMjAzIDY3OVQyMDcgNjgxVDIxMiA2ODNUMjIwIDY4M1QyMzIgNjg0UTIzOCA2ODQgMjYyIDY4NFQzMDcgNjgzUTM4NiA2ODMgMzk4IDY4M1Q0MTQgNjc4UTQxNSA2NzQgNDUxIDM5Nkw0ODcgMTE3TDUxMCAxNTRRNTM0IDE5MCA1NzQgMjU0VDY2MiAzOTRRODM3IDY3MyA4MzkgNjc1UTg0MCA2NzYgODQyIDY3OFQ4NDYgNjgxTDg1MiA2ODNIOTQ4UTk2NSA2ODMgOTg4IDY4M1QxMDE3IDY4NFExMDUxIDY4NCAxMDUxIDY3M1ExMDUxIDY2OCAxMDQ4IDY1NlQxMDQ1IDY0M1ExMDQxIDYzNyAxMDA4IDYzN1E5NjggNjM2IDk1NyA2MzRUOTM5IDYyM1E5MzYgNjE4IDg2NyAzNDBUNzk3IDU5UTc5NyA1NSA3OTggNTRUODA1IDUwVDgyMiA0OFQ4NTUgNDZIODg2UTg5MiAzNyA4OTIgMzVRODkyIDE5IDg4NSA1UTg4MCAwIDg2OSAwUTg2NCAwIDgyOCAxVDczNiAyUTY3NSAyIDY0NCAyVDYwOSAxUTU5MiAxIDU5MiAxMVE1OTIgMTMgNTk0IDI1UTU5OCA0MSA2MDIgNDNUNjI1IDQ2UTY1MiA0NiA2ODUgNDlRNjk5IDUyIDcwNCA2MVE3MDYgNjUgNzQyIDIwN1Q4MTMgNDkwVDg0OCA2MzFMNjU0IDMyMlE0NTggMTAgNDUzIDVRNDUxIDQgNDQ5IDNRNDQ0IDAgNDMzIDBRNDE4IDAgNDE1IDdRNDEzIDExIDM3NCAzMTdMMzM1IDYyNEwyNjcgMzU0UTIwMCA4OCAyMDAgNzlRMjA2IDQ2IDI3MiA0NkgyODJRMjg4IDQxIDI4OSAzN1QyODYgMTlRMjgyIDMgMjc4IDFRMjc0IDAgMjY3IDBRMjY1IDAgMjU1IDBUMjIxIDFUMTU3IDJRMTI3IDIgOTUgMVQ1OCAwUTQzIDAgMzkgMlQzNSAxMVEzNSAxMyAzOCAyNVQ0MyA0MFE0NSA0NiA2NSA0NlExMzUgNDYgMTU0IDg2UTE1OCA5MiAyMjMgMzU0VDI4OSA2MjlaIj48L3BhdGg+PC9nPjxnIGRhdGEtbW1sLW5vZGU9IlRlWEF0b20iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwMDMsLTE1MCkgc2NhbGUoMC43MDcpIiBkYXRhLW1qeC10ZXhjbGFzcz0iT1JEIj48ZyBkYXRhLW1tbC1ub2RlPSJtbiI+PHBhdGggZGF0YS1jPSIzMSIgZD0iTTIxMyA1NzhMMjAwIDU3M1ExODYgNTY4IDE2MCA1NjNUMTAyIDU1Nkg4M1Y2MDJIMTAyUTE0OSA2MDQgMTg5IDYxN1QyNDUgNjQxVDI3MyA2NjNRMjc1IDY2NiAyODUgNjY2UTI5NCA2NjYgMzAyIDY2MFYzNjFMMzAzIDYxUTMxMCA1NCAzMTUgNTJUMzM5IDQ4VDQwMSA0Nkg0MjdWMEg0MTZRMzk1IDMgMjU3IDNRMTIxIDMgMTAwIDBIODhWNDZIMTE0UTEzNiA0NiAxNTIgNDZUMTc3IDQ3VDE5MyA1MFQyMDEgNTJUMjA3IDU3VDIxMyA2MVY1NzhaIj48L3BhdGg+PHBhdGggZGF0YS1jPSIzMSIgZD0iTTIxMyA1NzhMMjAwIDU3M1ExODYgNTY4IDE2MCA1NjNUMTAyIDU1Nkg4M1Y2MDJIMTAyUTE0OSA2MDQgMTg5IDYxN1QyNDUgNjQxVDI3MyA2NjNRMjc1IDY2NiAyODUgNjY2UTI5NCA2NjYgMzAyIDY2MFYzNjFMMzAzIDYxUTMxMCA1NCAzMTUgNTJUMzM5IDQ4VDQwMSA0Nkg0MjdWMEg0MTZRMzk1IDMgMjU3IDNRMTIxIDMgMTAwIDBIODhWNDZIMTE0UTEzNiA0NiAxNTIgNDZUMTc3IDQ3VDE5MyA1MFQyMDEgNTJUMjA3IDU3VDIxMyA2MVY1NzhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MDAsMCkiPjwvcGF0aD48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==for the upper left of a matrix, and data:image/svg+xml;supportsDarkMode=1;base64,PHN2ZyBzdHlsZT0idmVydGljYWwtYWxpZ246IC0wLjM1N2V4OyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNC4zMDJleCIgaGVpZ2h0PSIxLjkwMmV4IiByb2xlPSJpbWciIGZvY3VzYWJsZT0iZmFsc2UiIHZpZXdCb3g9IjAgLTY4MyAxOTAxLjUgODQwLjgiPjxzdHlsZT4jRGFya01vZGU6dGFyZ2V0IHsgY29sb3I6IHdoaXRlOyB9PC9zdHlsZT48ZyBzdHJva2U9ImN1cnJlbnRDb2xvciIgZmlsbD0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAiIHRyYW5zZm9ybT0ic2NhbGUoMSwtMSkiIGlkPSJEYXJrTW9kZSI+PGcgZGF0YS1tbWwtbm9kZT0ibWF0aCI+PGcgZGF0YS1tbWwtbm9kZT0ibXN1YiI+PGcgZGF0YS1tbWwtbm9kZT0ibWkiPjxwYXRoIGRhdGEtYz0iMUQ0NDAiIGQ9Ik0yODkgNjI5UTI4OSA2MzUgMjMyIDYzN1EyMDggNjM3IDIwMSA2MzhUMTk0IDY0OFExOTQgNjQ5IDE5NiA2NTlRMTk3IDY2MiAxOTggNjY2VDE5OSA2NzFUMjAxIDY3NlQyMDMgNjc5VDIwNyA2ODFUMjEyIDY4M1QyMjAgNjgzVDIzMiA2ODRRMjM4IDY4NCAyNjIgNjg0VDMwNyA2ODNRMzg2IDY4MyAzOTggNjgzVDQxNCA2NzhRNDE1IDY3NCA0NTEgMzk2TDQ4NyAxMTdMNTEwIDE1NFE1MzQgMTkwIDU3NCAyNTRUNjYyIDM5NFE4MzcgNjczIDgzOSA2NzVRODQwIDY3NiA4NDIgNjc4VDg0NiA2ODFMODUyIDY4M0g5NDhROTY1IDY4MyA5ODggNjgzVDEwMTcgNjg0UTEwNTEgNjg0IDEwNTEgNjczUTEwNTEgNjY4IDEwNDggNjU2VDEwNDUgNjQzUTEwNDEgNjM3IDEwMDggNjM3UTk2OCA2MzYgOTU3IDYzNFQ5MzkgNjIzUTkzNiA2MTggODY3IDM0MFQ3OTcgNTlRNzk3IDU1IDc5OCA1NFQ4MDUgNTBUODIyIDQ4VDg1NSA0Nkg4ODZRODkyIDM3IDg5MiAzNVE4OTIgMTkgODg1IDVRODgwIDAgODY5IDBRODY0IDAgODI4IDFUNzM2IDJRNjc1IDIgNjQ0IDJUNjA5IDFRNTkyIDEgNTkyIDExUTU5MiAxMyA1OTQgMjVRNTk4IDQxIDYwMiA0M1Q2MjUgNDZRNjUyIDQ2IDY4NSA0OVE2OTkgNTIgNzA0IDYxUTcwNiA2NSA3NDIgMjA3VDgxMyA0OTBUODQ4IDYzMUw2NTQgMzIyUTQ1OCAxMCA0NTMgNVE0NTEgNCA0NDkgM1E0NDQgMCA0MzMgMFE0MTggMCA0MTUgN1E0MTMgMTEgMzc0IDMxN0wzMzUgNjI0TDI2NyAzNTRRMjAwIDg4IDIwMCA3OVEyMDYgNDYgMjcyIDQ2SDI4MlEyODggNDEgMjg5IDM3VDI4NiAxOVEyODIgMyAyNzggMVEyNzQgMCAyNjcgMFEyNjUgMCAyNTUgMFQyMjEgMVQxNTcgMlExMjcgMiA5NSAxVDU4IDBRNDMgMCAzOSAyVDM1IDExUTM1IDEzIDM4IDI1VDQzIDQwUTQ1IDQ2IDY1IDQ2UTEzNSA0NiAxNTQgODZRMTU4IDkyIDIyMyAzNTRUMjg5IDYyOVoiPjwvcGF0aD48L2c+PGcgZGF0YS1tbWwtbm9kZT0iVGVYQXRvbSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwMywtMTUwKSBzY2FsZSgwLjcwNykiIGRhdGEtbWp4LXRleGNsYXNzPSJPUkQiPjxnIGRhdGEtbW1sLW5vZGU9Im1pIj48cGF0aCBkYXRhLWM9IjFENDVCIiBkPSJNMjEgMjg3UTIyIDI5MyAyNCAzMDNUMzYgMzQxVDU2IDM4OFQ4OSA0MjVUMTM1IDQ0MlExNzEgNDQyIDE5NSA0MjRUMjI1IDM5MFQyMzEgMzY5UTIzMSAzNjcgMjMyIDM2N0wyNDMgMzc4UTMwNCA0NDIgMzgyIDQ0MlE0MzYgNDQyIDQ2OSA0MTVUNTAzIDMzNlQ0NjUgMTc5VDQyNyA1MlE0MjcgMjYgNDQ0IDI2UTQ1MCAyNiA0NTMgMjdRNDgyIDMyIDUwNSA2NVQ1NDAgMTQ1UTU0MiAxNTMgNTYwIDE1M1E1ODAgMTUzIDU4MCAxNDVRNTgwIDE0NCA1NzYgMTMwUTU2OCAxMDEgNTU0IDczVDUwOCAxN1Q0MzkgLTEwUTM5MiAtMTAgMzcxIDE3VDM1MCA3M1EzNTAgOTIgMzg2IDE5M1Q0MjMgMzQ1UTQyMyA0MDQgMzc5IDQwNEgzNzRRMjg4IDQwNCAyMjkgMzAzTDIyMiAyOTFMMTg5IDE1N1ExNTYgMjYgMTUxIDE2UTEzOCAtMTEgMTA4IC0xMVE5NSAtMTEgODcgLTVUNzYgN1Q3NCAxN1E3NCAzMCAxMTIgMTgwVDE1MiAzNDNRMTUzIDM0OCAxNTMgMzY2UTE1MyA0MDUgMTI5IDQwNVE5MSA0MDUgNjYgMzA1UTYwIDI4NSA2MCAyODRRNTggMjc4IDQxIDI3OEgyN1EyMSAyODQgMjEgMjg3WiI+PC9wYXRoPjwvZz48ZyBkYXRhLW1tbC1ub2RlPSJtaSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLDApIj48cGF0aCBkYXRhLWM9IjFENDVCIiBkPSJNMjEgMjg3UTIyIDI5MyAyNCAzMDNUMzYgMzQxVDU2IDM4OFQ4OSA0MjVUMTM1IDQ0MlExNzEgNDQyIDE5NSA0MjRUMjI1IDM5MFQyMzEgMzY5UTIzMSAzNjcgMjMyIDM2N0wyNDMgMzc4UTMwNCA0NDIgMzgyIDQ0MlE0MzYgNDQyIDQ2OSA0MTVUNTAzIDMzNlQ0NjUgMTc5VDQyNyA1MlE0MjcgMjYgNDQ0IDI2UTQ1MCAyNiA0NTMgMjdRNDgyIDMyIDUwNSA2NVQ1NDAgMTQ1UTU0MiAxNTMgNTYwIDE1M1E1ODAgMTUzIDU4MCAxNDVRNTgwIDE0NCA1NzYgMTMwUTU2OCAxMDEgNTU0IDczVDUwOCAxN1Q0MzkgLTEwUTM5MiAtMTAgMzcxIDE3VDM1MCA3M1EzNTAgOTIgMzg2IDE5M1Q0MjMgMzQ1UTQyMyA0MDQgMzc5IDQwNEgzNzRRMjg4IDQwNCAyMjkgMzAzTDIyMiAyOTFMMTg5IDE1N1ExNTYgMjYgMTUxIDE2UTEzOCAtMTEgMTA4IC0xMVE5NSAtMTEgODcgLTVUNzYgN1Q3NCAxN1E3NCAzMCAxMTIgMTgwVDE1MiAzNDNRMTUzIDM0OCAxNTMgMzY2UTE1MyA0MDUgMTI5IDQwNVE5MSA0MDUgNjYgMzA1UTYwIDI4NSA2MCAyODRRNTggMjc4IDQxIDI3OEgyN1EyMSAyODQgMjEgMjg3WiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvZz48L2c+PC9zdmc+for the bottom right of a matrix). We also went through the “cross” of indices above, below, left and right, as well as how these relate to dimension.  

October 17:

Today we continue on with Matrix Multiplication, thinking through a few key examples and shapes of matrices (diagonal, identity, zero, row multiplier, row adder) to see how they work in the 2x2 and 3x3 case (and begin to introduce how that looks visually. For fancier graphics than I can do by hand, check out  3Blue1Brown's Series on Linear Algebra (both written and video)—we will be stopping at Cramers Rule.

October 14-15:

Today we are going to make the transition from the dot product to matrix multiplication (both on the board and in code). To do that we will have a look at the following resources:

Start with Linear Algebra Fundamentals

If you are looking for python and jupyter tutorials, have a look at these notebooks (they are drafts, so please let me know if you find any errors).

Go to Google Drive

October 8 and 10:

Here is what we discussed today! Have fun creating the functions for both dot product and scalar multiplication! We will go through these on Friday and Tuesday. Note: sometimes the simplest thing you can do is the right thing! No need to over-complicate :) 

Open hyperlink

Tuesday October 7th:

Plan for today

Today we will be continuing to look at vectors and matrices, in particular we will start by going through what we touched on last week (vector/matrix addition, subtraction, our “weird multiplication” of vectors).

We will in🦺i🏰 (bonus points if you can figure out that word) what happens when we look at vectors and their operations graphically (using the ill-named cartesian plane, which we will just call the coordinate plane). But also, we will start of on our adventure of coding up these vectors as lists and create a few basic functions in python together. If we are lucky, we will get to matrix multiplication at the end, but that will likely come tomorrow—remember, all this stuff can be found online so there is no need to fret about taking notes or memorizing anything. 



October 1st-3rd

Today we will be looking over the basics of lists, vectors, and matrices, for that we will use some experimental notebooks that I have been working on that might change over the coming weeks as we better figure out what kind of support might be needed. In general, these are modified from prior sheets I have made that were adapted to “you in 2 months”... so lets see how we do with them now!  

Tuesday September 30

Some stuff we went through on tuesday



Wednesday and Friday September 23 and 26

Hour 1:

* Khan Academy: Individual Plan and Practice
  * Using Khan Academy, see if you can ascertain what level is right for you to start practicing. Some key chapters to consider:
    * Fractions (addition and subtraction, multiplication, division)
    * Logarithms
    * Negative Exponents
    * Cartesian Coordinates (Graphing)
    * Trigonometric Functions (especially sketching them)
    * Solving Systems of Equations
  * I will come around and ask you a few questions:
    * 1. what units would you like time to work on in class for the next couple sessions with help from me? 
    * 2. What units do you think you can best tackle at home (without assistance)
    * 3. What other types of resources might prove helpful? (Videos, other math resources—I have loads, but it depends on what kind of practice you would like to do!)
    * 4. Are you comfortable creating your own practice problems? Instead of just using ones given to you (see your exploration sheet for exponents for what I mean).
    * As always: If several people would like practice on the same thing, I will gladly carve out time and make some material covering it in a way that more relates to where we are going! :)

Shifting how we think about Maths:

Josh waxes rhapsodic (says pretty words) about:

* Objects
* Functions and operations
* Tuples, Lists, Matrices (Numbers in Lines and Boxes)
* Composition and Types of Functions and Representations (Recursion, Probability, Distributions)

Where we are headed:

* A toy neural network to play around with: https://playground.tensorflow.org/
* A full implementation of a neural net in python https://machinelearningmastery.com/implement-backpropagation-algorithm-scratch-python/#
* https://www.kaggle.com/learn/intro-to-machine-learning

Practice (at home or if you feel you are comfortable with the material):

Using Pseudocode in a Jupyter Notebook let’s aim toward describing a method for computing addition (or, in order of difficulty, subtraction, multiplication, division) as you learned in grade school. We assume that each number is broken into a number of digits. 

Warm Up: Equality

Given two strings of the same unknown length, with some number of symbols, how would you determine if the two strings are equal?

Challenge 0: Same Length

Given two strings, how would you determine if the strings are the same length. As a bonus, see if you can use a method that you create that find the length of a string... (otherwise you can just assume we have a way of knowing a strings length.)

Challenge 1: Digit Sum

Given two lists of the same length where each entry in the list is a number, how would you write down a process for getting a new list where each entry is the sum of the two lists at that same entry?

Challenge 2:

Optional Coding Challenge: If you would like to use a Jupyter Notebook (and write code) you are welcome to try this as a series of exercises (this may relate to a future assessment). Note: this uses aspects of python you haven’t learned yet, so the idea is first to describe these in English. (If you want to try code, go head of course, but only after writing in English.)



Friday September 19

Have a look at the following worksheet, I hope to have a printed version for you tomorrow but just in case here is the digital backup!

Exploratory_Worksheets.pdf

Today we will discuss Khan Academy, the plan for the year, as well as this worksheet.

Plan for this year

September: Review of foundations: Fractions, exponents, logarithms, graphing, algebra

October: Introduction to Functions and Matrices

November: Advanced Functions and Python Math Baby-Steps, Probability

December: First Assignments and Python Integration

January: Assignment Feedback

February: Statistics and Calculus

March: Trigonometry and Calculus+

April: Exam Review and Final Assignment submissions

Wednesday Sept 17

Your current level in Maths

Today we are going to go through the Maths Australia Placement Test:

The goal is to see where you fall, where your gaps are and where you struggle. If you dont know the answer to a question, feel free to put I don’t know, if you get through a test, go ahead and go to the next one. If you get through lots of them, great! If you are struggling with the first one, also great! We will get you where you need to be for this course and we will make sure that everyone goes at their own pace, while keeping the class together when discussing important ideas and connections between areas of math and computer science.

NOTE: You do not need a calculator for the first 3 tests (not sure about the 4th-6th)

Start with the Mathematics Australia Pre-Algebra Assessment

The source for that link was here (just in case it doesn’t work for you). Click on the left option if you feel like you really struggled with math, and the right if you think you have some maths knowledge under your belt and want to see how far you can go.

When you are done with the first test, go on to the next one! :) Keep going as long as you can! :) 

If you do not like how that test is structured and would like a more general test, check out this one from Monroe College

College Maths Self Assessment

After you complete your assessment:

When you are done, go ahead and sign up for Khan Academy using this link:

Please sign up with your college email.

Sign Up for Khan Academy with your College Email

When you have done this, please let me know and we can discuss your maths needs and goals as well as where we can go from here.



For Your Reference:

Some past TUD Entry Tests from this page:

* 2017
* 2018
* 2019

An assessment from Monroe University

An Oxford Assessment we will work toward

Mathematical Challenges:

* Project Euler
* Euclidea
* Socratic

Graphing and Solving Equations:

* Wolfram Alpha
* Desmos


