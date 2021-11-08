# Lab 6 Choosing Technical Stacks

## Scenario 1: Logging
### Prompt:
In this scenario, you are tasked with creating a logging server for any number of other arbitrary pieces of technologies.

Your logs should have some common fields, but support any number of customizeable fields for an individual log entry. You should be able to effectively query them based on any of these fields.

How would you store your log entries? How would you allow users to submit log entries? How would you allow them to query log entries? How would you allow them to see their log entries? What would be your web server?
### Strategy:
The webserver would have a frontend of reactjs and a backend of Apollo/GraphQL.The users would use the web application to make queries to the backend, which would then communicate with the database. GraphQL can set requirements that the user has to provide certain fields, and it also supports dynamic keys. The user can get or post logs as long as they contain the common fields. I would also use Apache Hadoop as it can perform analytics on the logs and provide reports to users.

## Scenario 2: Expense Reports
### Prompt:
In this scenario, you are tasked with making an expense reporting web application.

Users should be able to submit expenses, which are always of the same data structure: ```id, user, isReimbursed, reimbursedBy, submittedOn, paidOn, and amount```.

When an expense is reimbursed you will generate a PDF and email it to the user who submitted the expense.

How would you store your expenses? What web server would you choose, and why? How would you handle the emails? How would you handle the PDF generation? How are you going to handle all the templating for the web application?
### Strategy:
My frontend for this would use React and the backend would be in Apollo and Express. The database I would use in this scenario is Redis. Each expense report has a unique ```id```, so we can use an id->object mapping in our database. We can use a map for accepted, denied, or pending expense reports. The user would be able to submit an expense with those fields on the frontend, an hr employee can use another view to see those pending expenses. They will be able to approve it, and then the object would be switched to the accepted map and using Twilio's mailing API to send emails to the user. The backend data will be used to generate a PDF with Latex and use a generic template to handle the reports.

## Scenario 3: A Twitter Streaming Safety Service
### Prompt:
In this scenario, you are tasked with creating a service for your local Police Department that keeps track of Tweets within your area and scans for keywords to trigger an investigation.

This application comes with several parts:
* An online website to CRUD combinations of keywords to add to your trigger. For example, it would alert when a tweet contains the words (fight or drugs) AND (SmallTown USA HS or SMUHS).
* An email alerting system to alert different officers depending on the contents of the Tweet, who tweeted it, etc.
* A text alert system to inform officers for critical triggers (triggers that meet a combination that is marked as extremely important to note).
* A historical database to view possible incidents (tweets that triggered an alert) and to mark its investigation status.
* A historical log of all tweets to retroactively search through.
* A streaming, online incident report. This would allow you to see tweets as they are parsed and see their threat level. This updates in real time.
* A long term storage of all the media used by any tweets in your area (pictures, snapshots of the URL, etc).

Which Twitter API do you use? How would you build this so its expandable to beyond your local precinct? What would you do to make sure that this system is constantly stable? What would be your web server technology? What databases would you use for triggers? For the historical log of tweets? How would you handle the real time, streaming incident report? How would you handle storing all the media that you have to store as well? What web server technology would you use?

### Strategy:


## Scenario 4: A Mildy Interesting Mobile Application
### Prompt:
In this scenario, you are tasked with creating the web server side for a mobile application where people take pictures of mildly interesting things and upload them. The mobile application allows users to see mildly interesting pictures in their geographical location.

Users must have an account to use this service. Your backend will effectively amount to an API and a storage solution for CRUD users, CRUD 'interesting events', as well as an administrative dashboard for managing content.

How would you handle the geospatial nature of your data? How would you store images, both for long term, cheap storage and for short term, fast retrieval? What would you write your API in? What would be your database?
### Strategy:
The frontend will be in React-native, the backend will be an API written in Express. The backend databases will be Redis for caching short term storage and mongoDB for long term storage such as older posts and credentials. 

The user will post the image, and the backend route will use a database to store the image. The image's exif data can be used to find the geospatial location and a separate database can be used for location data. Newer images can be cached in Redis and can be removed if they are not accessed after some time. MongoDB allows for geospatial queries based on the users' locations.