# Lab 6 Choosing Technical Stacks

## Scenario 1: Logging
### Prompt:
In this scenario, you are tasked with creating a logging server for any number of other arbitrary pieces of technologies.

Your logs should have some common fields, but support any number of customizeable fields for an individual log entry. You should be able to effectively query them based on any of these fields.

How would you store your log entries? How would you allow users to submit log entries? How would you allow them to query log entries? How would you allow them to see their log entries? What would be your web server?
### Strategy:
The webserver would have a frontend of reactjs(server side rendering) and a backend of Apollo/GraphQL. The webserver will be dockerized apache or nginx for scalability. The database will be mongodb or any database that support dynamic fields

I would store log entries as a Document or a JSON Blob. Users would be able to submit log entires with a REST API which would send and receive json blobs. I would also use Apache Hadoop as it can perform analytics on the logs and provide reports to users.

## Scenario 2: Expense Reports
### Prompt:
In this scenario, you are tasked with making an expense reporting web application.

Users should be able to submit expenses, which are always of the same data structure: ```id, user, isReimbursed, reimbursedBy, submittedOn, paidOn, and amount```.

When an expense is reimbursed you will generate a PDF and email it to the user who submitted the expense.

How would you store your expenses? What web server would you choose, and why? How would you handle the emails? How would you handle the PDF generation? How are you going to handle all the templating for the web application?
### Strategy:
My frontend for this would use React and the backend would be in Apollo or Express. The webserver would be dockerized apache or nginx. The database I would use in this scenario is SQL as we have static fields. 
The record would be stored in the sql database with a "isReimbursed" field set to false.

I would use Mailchimp  to automate email sending and would link to a pdf in a storage such as a S3 bucket. The PDFs would be generated with 'node-html-pdf' library to convert html to a pdf which would be stored in cloud storage.

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
The frontend would be with a react or similar framework that allows server side rendering. The webserver would be dockerized nginx or apache. I could use either a SQL or NOSQL database for this scenario. I would use Twitter's streaming api because I can add location bounds to specify tweets in a specific town. To scale this across multiple locations, I would store the sets of coordinates in a structure, whose contents would be sent to Twitter's API.

To make the system stable I would have a watchdog service in a separate cluster that monitors server and component health. For triggers, I would use NOSQL for long time querying, Kafka queues to create events when a trigger word is found. Services would subscribe to trigger events. When those events occur, they can query NoSQL databases to know who to notify.

I would handle the real time reports by connecting webservers to websockets for long polling. The media would be stored in an S3 bucket, and very old media can be sent to cold storage. The webserver technology I would use is Apache/Nginx and socket.io for websockets.

## Scenario 4: A Mildy Interesting Mobile Application
### Prompt:
In this scenario, you are tasked with creating the web server side for a mobile application where people take pictures of mildly interesting things and upload them. The mobile application allows users to see mildly interesting pictures in their geographical location.

Users must have an account to use this service. Your backend will effectively amount to an API and a storage solution for CRUD users, CRUD 'interesting events', as well as an administrative dashboard for managing content.

How would you handle the geospatial nature of your data? How would you store images, both for long term, cheap storage and for short term, fast retrieval? What would you write your API in? What would be your database?
### Strategy:
The frontend will be in React-native, the backend will be an API written in Express. The web server would be dockerized nginx or apache. I would also create a separate server for viewing the backend of the application so admins can manage content. The database used would be an SQL database for short term storage and shipped to cold storage for long term. A separate database wiill be used for hashed/encrypted login credentials which will be use to authenticate or add users.  

The user will post the image, and the backend route will use the database to store the image. The image's exif data can be used to find the geospatial location. The database would contain fields regarding longitude latitude and other relevant fields. The backend would then query the database using the location fields.