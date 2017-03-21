//packages downloaded from NPM
const express = require('express') //web framework
const axios = require('axios') //http request library
const morgan = require('morgan') //logger
//Node's built-in packages
const fs = require('fs') //access the filesystem
//custom files, using es6 object destructuring
const {CLIENT_ID,REDIRECT_URI,CLIENT_SECRET} = require('./credentials')
const {fetchInstagramToken, fetchRecentSelfMedia, parseAndDownloadMedia} = require('./helpers')

const app = express()

app.use(morgan('tiny'))

app.get('/',(req,res) => {
  let url = `https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`

  res.send(`<a href= ${url}>Click to authorize</a>`)
})

//The '/' link will take you to /callback with an added code parameter
app.get('/callback', (req,res) => {
  //grab the code parameter off of the url ie) google.com/?code=123
  const code = req.query.code

  fetchInstagramToken('https://api.instagram.com/oauth/access_token',code)
  .then(response => fetchRecentSelfMedia(response.data.access_token))
  .then(response => parseAndDownloadMedia(response.data.data))
  .catch(e => console.error(e))
})

app.listen(3000, () => console.log('express app listening'))
