# Is the First Amendment Really Coming First? 

This is the final project submission for Emily Shoemaker and Olivia Bryant for Harvard's CS171: Data Visualization. Our project explores attitudes towards free speech in the United States over time, especially on college campuses. 

### The Data
In our data folder, you can see a few data sets. One is called gssSpeech, and it's a selection of variables from the general social survey database. It was downloaded directly from their website, found here: http://gss.norc.org/About-The-GSS.
There are also 2 datasets from the Foundation for Individual Rights in Education, or FIRE. We created one dataset about their rankings for different colleges, found here: https://www.thefire.org/spotlight/, and downloaded a database of disinvitations, or occurrences of a speaker getting asked not to speak at a certain college by a group of students. 

### The Code
You can check out the code used to generate the website in the js and css folders, as well as index.html. We used d3 to visualize the data. Our original code can be found in the js folder in the files called "main.js", "collegesMap.js", "disinvitationAttempts.js", "lineGraph.js", "quiz.js", and all the timeline files. The rest of the javascript are files from libraries like leaflet or d3-tip.

### The Website
You can access the live version of our website here: https://emilyshoe.github.io/firstamendment/

### The Screencast
You can see a 2 minute demo of the site here: https://www.youtube.com/watch?v=vNvRCPCGx2A&t=4s

### The Visualizations
#### Timeline
To view different elements on the timeline, hover over the red dots positioned at different years along the line.
#### Line Graphs
To view the timeline for different speakers, pick a speaker by the dropdown bar in the graph title. To filter the graph by different demographics, hover over the boxed text in the graph description. It can be filtered by overall, age, degree, political affiliation, and gender. 
#### Map of Colleges
Click on any marker to see which college it is pointing too. Additionally, hover over any of the boxed text in the map description to filter the markers by types of colleges including private, public, or ivy league. 
#### Disinvited Speakers
Click on the group by options to group the speakers by the option named, or click on a color by option to view the speakers sorted by those options. Also, you can hover over any speaker to see information about them, including their name, school they were invited to speak at, year of the disinvitation, and reasons why the speaker is controversial. 
