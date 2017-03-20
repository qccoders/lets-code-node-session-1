//packages downloaded from NPM
const express = require('express') //web framework
const axios = require('axios') //http request library
const morgan = require('morgan') //logger

//Node's built-in packages
const stringify = require('querystring').stringify //convert {foo:bar} to foo=bar
const fs = require('fs') //access the filesystem

//custom files, using es6 object destructuring
const {CLIENT_ID,REDIRECT_URI,CLIENT_SECRET} = require('./credentials')

//creates an instance of express to serve our app
const app = express()

//middleware used on every route
app.use(morgan('tiny'))

//when a user visits our home route
app.get('/',(req,res) => {
  //create an authorization link (per Instagram) and send back an anchor tag w/ url
  let url = `https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`

  res.send(`<a href= ${url}>Click to authorize</a>`)
})

//The above link will take you to /callback with an added code parameter
app.get('/callback', (req,res) => {
  //grab the code parameter off of the url ie) google.com/?code=123
  const code = req.query.code

  /*
  make an ajax call to Instagram's access token endpoint with
  app specific parameters added (defined in credentials.js).
  Axios returns a promise. Note we are posting data:
  axios.post(url,{dataToPost})
  */
  axios.post('https://api.instagram.com/oauth/access_token',stringify({
    client_id:CLIENT_ID,
    client_secret:CLIENT_SECRET,
    grant_type:'authorization_code',
    redirect_uri:REDIRECT_URI,
    code:code
  }))
  //resolved promises have a "then" method.
  //Axios puts "data we care about" in "response.data" ie response.data.access_token
  .then(response => {
    const ACCESS_TOKEN = response.data.access_token
    //Access the Instagram endpoint to grab most-recent images from own account
    axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${ACCESS_TOKEN}`)
    .then(response => {
      //map over the array returned to only grab the url
      response.data.data.map((imageData, index) => {
        const url = imageData.images.standard_resolution.url
        //Make a final ajax request to grab the photo from the url and pipe to filesystem
        axios({
          method:'get',
          url:url,
          responseType:'stream'
        })
        .then(response => {
          response.data.pipe(fs.createWriteStream(`img${index}.jpg`))

        })
        .catch(error => {
          console.error(error);
        })
      })
    })
  })
})

app.listen(3000, () => {
  console.log('express app listening')
})
