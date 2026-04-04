
CSE 340 Web Backend Development Project
Used Car Dealership App

-------- Project Description --------
This application simulates a real used‑car dealership platform with three types of users: customers, employees, and the dealership owner.
It is designed to demonstrate backend development mastery, including authentication, authorization, database relationships, MVC architecture, and multi‑stage workflows.

The site includes:

Public vehicle browsing with categories and detailed pages

User accounts with reviews and service request history

Employee dashboard for managing service requests, reviews, and vehicle details

Owner dashboard for full inventory and category management

Contact form system with stored messages

Fully server‑side rendered pages using EJS

PostgreSQL database with multiple related tables

-- Tech Stack --
Node.js

Express.js

EJS (server‑side rendering)

PostgreSQL

express-session for authentication

bcrypt for password hashing

Deployed on Render

-------Database Schema--------

![alt text](<Screenshot 2026-04-03 210859.png>)

--------User Roles--------

I created credentials for 3 roles, but I suppose there are 4.

1. Not logged in user: someone who just came to the site to browse 
- They can view inventory
- They can view the about page

2. Customer: Someone planning to make a purchase
- Make a service request
- Leave a review
- Update profile
- Send a message to contact us
- And everything a non logged in user can do

3. Employee: Works for the company
- They can access a list of all vehicles
- Access a list of all users
- Access a list of all service requests and update the status of the requests
- Access a list of all reviews
- Access a list of all contact messages
- And everything the customers can do

4. Admin: Owner or high level employee
- They can update and delete users (if needed)
- Update, delete, and create new vehicles
- Reply to customer messages
- Delete Reviews (if needed)
- And everything that an employee can do 

--------Test Account Credentials--------

Admin - admin@example.com

Employee - employee@example.com

Customer - customer@example.com

--------Known Limitations--------

1. I did not complete a search bar and filters. I really wanted to get to those, but I did see that the filtering was optional at the very least so I focused on other things.

2. I decided that I wanted to go back an make it so that not logged in users could send a contact message, but I didn't have time, so that doesn't do What I would like it to.

3. Some of the styling isn't to my liking and isn't very responsive.

4. Something a little weird happens everytime I click the save notes buttonin the service requests admin page. The messages move around. The information seems to stay the same, just the position of the request on the page changes.

5. Unfortunately, the contact messages are able to get filled out, but the submit button does not send it to the database. I have to work out that bug.

6. Flash messages only seem to pop up on the home page, not on every page, but they do work.

--------Links--------

Render link: https://used-car-dealership.onrender.com