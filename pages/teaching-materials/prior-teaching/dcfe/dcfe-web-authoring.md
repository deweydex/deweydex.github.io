https://coda.io/d/_dXwmZI3vjrc/_sunh2VWC
Web Authoring

Winter Term Topics

Databases as Requested: https://colab.research.google.com/drive/1RILVUXDDHPpJyRONq_2vbqq4Z7owRpqI?usp=sharing

Sqlite practice

https://colab.research.google.com/drive/1Fb1G5Y0B3YLrhNsSh6srIq7VjPzv3hyE?usp=sharing

Sample Database Project (V1)

Sample Database Project (V2)

ipywidgets(how to make code connect to forms with python)



Tools We Will Explore:

* Figma
* Github Pages/Glitch
* Jupyter Notebooks
* Website Builders: Jekkyl, Wordpress, Hugo

Planning for Project



Independent Learning Plan

Please look at Moodle for up to date information!

Assignment Brief: 

WAAssignment1 2024.pdf

Online Resources

* Codecademy (HTML and CSS courses, as well as Advanced CSS)
  * https://www.codecademy.com/catalog/language/html-css
* https://www.freecodecamp.org/
  * See also: https://www.freecodecamp.org/learn/the-odin-project/ or https://www.theodinproject.com/paths/foundations/courses/foundations
* https://cssgridgarden.com/
* https://flexboxfroggy.com/
* https://developer.mozilla.org/en-US/docs/Learn/HTML
* https://developer.mozilla.org/en-US/docs/Web/HTML
  * HTML Basics
  * CSS Basics
* January: for our website project adventures I recommend that you either look at glitch or github pages
  * https://glitch.com/
  * https://pages.github.com
  * https://nolanlawson.com/2023/12/02/lets-learn-how-modern-javascript-frameworks-work-by-building-one/

Extra Adventures

TypeScript

* https://v2.scrimba.com/learn-typescript-c03c
* https://www.codecademy.com/learn/learn-typescript

Our Class Goals for November and December:

1. Finish whatever HTML/CSS tutorial you are working through! If you can do fancy flexbox stuff, you are ahead of the game! :) 
2. Draft Project and Assignment Brief in November, with submission of assignment before new-years and submission of Project in the New Year.
3. Inspiration: we will look at a few channels and resources for how to get inspired to build cool stuff! (Mostly December)

GitHub Pages:  https://pages.github.com/ 

Fun Resources:https://www.youtube.com/watch?v=SO83KQuuZvg&t=1003s




Planning for Assignment

First Big Choice:

* Personal Website that can be part of your portfolio
* Website About something you are interested in that you can be proud of

Planning:

In a separate document please outline the following: once you have completed your outline of each of these you can start gathering or creating your content.

* Overarching Goal and Topic of Webpage
* Sketch or wireframe of layout
* What do you actually want to say? How is it structured and broken down into pages
* Page Connection Graph: How are pages connected?
* Think through potential tools or issues...
Programming Design Principles

Group work questions:

What did I struggle with and ask for help about? Where did I give help?

What did I learn from my colleague? What changes did I make?

What was easy/difficult/unexpected about our communication? (Eg. found we had to use variable names a lot, indices, function names, etc.)

Any other reflections, areas you would like to improve or areas that you think went well.

Skills Demo 1 (Jan 17 - Feb 28)

Programming Design Principles Skills Demo.ipynb

Skills Demo 2 (Feb 28 -March 28)

On Moodle or Link to Colab

Practice Problems for Python:

Some practice problems for your python adventures—solutions will be provided as I make them, if there are any errors or issues please let me know! :) 

practice-problems-1.pypractice-problems-1-solutions.pypractice-problems-2.pypractice-problems-3.pypractice-problems-4.pypractice-problems-other.pypractice-problems-5.pypractice-problems-6.pypractice-problems-7.py

Khan Academy Class (Optional but Recommended): https://www.khanacademy.org/join/MAR9BPAP

Our Group Code Experiments:https://www.khanacademy.org/python-program/map-making-group-coding/4910017609646080

https://www.khanacademy.org/python-program/slicing/4824728708497408

https://www.khanacademy.org/python-program/reverse/6465531776253952

Temporary Project Page for PDP

Game Map Experiment

Soft Due Date (Practice): Friday, October 18th (Class-time)

Assignment Directions

Hey there, future game developers! 😄 In this informal assignment, you'll be creating the magic behind a text-based game map. Imagine a world where you define the coordinates, measure distances, set dimensions, and add exciting points of interest. Plus, you'll sprinkle in some flavour text and make the map interactive for users! If you'd like to create a visual map using an image, ASCII art, or some other visual representation, that's great! Let me know, and I'll help figure out a way that works given your level! 😊 Note, this assignment will not be graded, it is designed to give you a chance to break down a big problem into smaller chunks and try out some of what you have learned so far. Next week we will go through some of the ideas that various folks have come up with, give some informal feedback, and celebrate your progress. Ready to dive in? Let's go!

Steps to Consider:

1. Define the Coordinate System: You will likely need to create a function to establish a coordinate system for your map. This could be a grid or any other system that fits your awesome design. Think about what kind of data structure (e.g., lists, tuples) would best represent your coordinates.

2. Measure Distances: See if you can write a function to calculate the distance between two points on your map. You might want to use Euclidean distance or another method that works for you like Manhattan distance if you are using a city-grid. Consider whether you need floats or integers for your calculations.

3. Set Dimensions and Scale: Try to develop functions to set the dimensions and scale of your map. Decide how large your map will be and how distances will be represented. Perhaps write a function that checks whether a given point of interest (or the player) is on the map. Think about what data structure might best store map dimensions and scale. Note that this could literally just be variables that declare the size of the map, or a function that allows you to change the map size (might be a 3 liner!). For units and scale (like meters or km)  that might only really come up if you are printing things for the user, or are somehow scaling in and out (we can talk about scaling as that's a fun one!)

4. Add Points of Interest: Perhaps you would find it interesting to create a function to add points of interest to your map. These could be locations, landmarks, or other cool spots that make your map unique. How will you represent their position? How will you represent their names? Are there other features or categories you would like to use? What kind of data structure might be helpful here? Lists or dictionaries could be very useful.

Comments are Help for Present and Future You: Make sure to comment on nearly every line of code. Comments serve as a way to remind yourself of your intentions for each line and to explain your code to others who may read it. This practice is essential for clear and maintainable code.

Some things that might be fun to add: 

* Incorporate Flavor Text: If your map is set in a specific place, whether fictional or real, see if you can find opportunities to include descriptive text for different areas of your map. This will enhance the narrative and make the user experience more immersive. Strings will be essential here.
* Provide Directions: While certainly not required, it might be fun to implement a function to give directions from one point to another on the map. This could involve simple cardinal directions (north, south, east, west) or more detailed instructions. How might you implement or depict roads? Can you do so with just text or do you prefer a visual approach? Think about how you might represent these directions: how might they be calculated or shown to the user?
* Enable User Interaction: You are welcome to just have the user interact with the functions that allow users to interact with the map. This could include moving to different points, examining locations, or other interactive elements. Consider what data structures will make user interactions efficient and intuitive.

Remember, if you need help with loops, classes, or Python function definitions, I'm here to assist you. Let's create something amazing together! 🚀
