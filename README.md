MindMap
=======

My Final Project for the Front-End Half of Nashville Software School. 

I've found mind-mapping (http://en.wikipedia.org/wiki/Mind_map) to be a superior way to take hand-written notes or organize my thoughts on a subject. Mind-maps seem (to me) to facilitate memorization and understanding more readily than notes written in conventional paragraph style; they also allow you to easily see how a general topic is broken down into sub-topics. I chose mind-mapping as a project based on my personal interest in mind-mapping and my thought that I should gain some familiarity with the HTML5 canvas element and a visual library (in this case, InfoVis Javascript Toolkit.)

This project demonstrates my ability to implement a basic CRUD app in Node.js. The project allows users to log into the website and create MindMaps within a canvas element containing force-directed graphs using the InfoVis Javascript Toolkit. Users can add/delete/rename nodes, and can reposition nodes within their mind maps.

Known Bugs
==========
1. An error sometimes occurs after the user opens a mind map (that has been previously saved) and edits the mindmap. This causes the node points to grow in size and the graph to become distorted. I hypothesize that their is some error in editing and saving the JSON representing the graph or in my implementatino of InfoVis Javascript Toolkit. This is an error I'll seek to resolve. Please contact me at averygoodplanet@gmail.com if you have any suggestions or comments.

Steps to Run this Project
=========================
1. Clone the repo.
2. In the working directory do npm install.
3. Open a tab in terminal and type redis-server to start redis volatile database (for session info, user login/logout).
4. Open a tab in terminal and type startmongo and then mongo which should give a prompt for the mongo database (database that will store saved user and mindmap info.)
5. Then open a terminal tab and do supervisor app.js to start up the server.
6. Start at localhost:3000, register a user, login as that user, then create new map.

Notes About this Project
========================
1.  This project uses the InfoVis Javascript Toolkit (see http://philogb.github.io/jit/index.html) to draw force-directed graphs.
2.  This project also attempts to demonstrates my ability to use Node.js, Express, AJAX, jQuery, Javascript, Mongodb, and Redis to create a non-trivial example of a CRUD app.


