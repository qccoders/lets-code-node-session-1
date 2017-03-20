# lets-code-node-session-1
Project code from my Meetup talk on how to use Node to grab images from Instagram and save them to the filesystem
## Authenticating through Instagram to use their API
This project was showcased for a "Let's Code" series where members of the Meetup group **Q-C Coders** share their knowledge on project setup, creation, collaboration, or anything that interests them and their code. For more details on the project itself, you're encouraged to checkout the [Meetup link](https://www.meetup.com/QCCoders/events/236810441/)

### Running the app
This process is broken down into 3 easy steps once the app is cloned on to your machine
*This project assumes you have [node_v6 installed](https://nodejs.org/en/)*
1. From the command line, inside of the project directory, run the following command:
```javascript
$ npm install
```
This downloads the dependencies listed in package.json

2. Create a developer account on Instagram *(requires Instagram account)* 
    * For development purposes, set the website url to **http://localhost:3000/**
  and the redirect uri to **http://localhost:3000/callback**

3. Replace the values in *credentials.js* with your app-specific values.

That's it! 

Now that your all done, run
```javascript
$ npm start
```
and visit localhost:3000. Once you click on the link, you will be taken automatically through the authentication process and if successful, your latest Instagram photos will be populated in your project directory!
