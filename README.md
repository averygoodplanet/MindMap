MindMap
=======

My Final Project for the Front-End Half of Nashville Software School


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


