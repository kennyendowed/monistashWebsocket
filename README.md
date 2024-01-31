# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Prerequisites
Before running this application, make sure you have the following installed:

Node.js (version X.X.X)
npm (version X.X.X)
(Optional) PM2 (version X.X.X) - for process management

 Clone the repository:git clone  https://...........

Navigate to the project directory:


Install the dependencies:

npm install

Create a .env file in the project root directory based on the provided .env.example file. Update the necessary environment variables such as database connection details, API keys, etc.

### Configuration

Configure the application by modifying the .env file in the project root directory. Update the necessary environment variables to match your specific setup.

### Usage
To start the application in development mode, run the following command:


npm run dev or npm run start

The application will start on http://localhost:${process.env.port}.

### To start the application in production mode, run the following command:

npm run start or dev

### Using PM2

If you have PM2 installed, you can run the application using PM2 for process management.

###  Start the application with PM2
    pm2 start pm2systemconfig.js

### View the application logs: 

pm2 logs



