## Table of contents
- [GitHub Webhook Deployer](#github-webhook-deployer)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Starting](#starting)
  - [Usage](#usage)
  - [Requirements](#requirements)
  - [Resources used.](#resources-used)

# GitHub Webhook Deployer

GitHub Webhook Deployer is a simple application to automate your deployments on your single cloud server using the Github Webhook Triggers. It simply listens for `push` event and based on your configuration to deploys or executes commands to deploy the application.

## Installation
1. Clone the repository
2. Run `npm i`
3. Create `.env` file in folder root and based on the values provided in `.env.sample`.
4. Run `npm bin/console app install` which creates a new user for the app.

## Configuration
```
DATABASE="mongodb://localhost:27017/your-db-name"
REDIS_URL="redis://127.0.0.1:6379"
SECRET="some-secret"
```
## Starting 
1. Run `node ./bin/www` or `pm2 start ecosystem.config.js` if you are using pm2.
2. Visit `http://localhost:3000` base on the port specified.

## Usage
1. Login with credentials
2. Got to apps pages and create a new app, enter the application directory and the command to be executed on the `push` event also specifying the target branch on which the same will be executed for eg. `refs/heads/master`. Copy the automatically generated secret.
3. You will bre redirected to the deployments page of the app and copy the webhook url.
4. With all the details collected, visit Github repository and create a webhook using the details.
5. Push a commit to the configured branch and the app will be deployed, you can view the deployment to know the details regarding webhook or executed script response or error.

## Requirements
1. Node.js
2. MongoDB
3. Redis Server

## Resources used.
1. CSS Framework [Tailwind](https://tailwindcss.com/)
2. Node Web Framework [Express](https://expressjs.com/)
3. Dashboard theme : [Admin Template Day](https://www.tailwindtoolbox.com/templates/admin-template-day).