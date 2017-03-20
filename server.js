const express = require('express') //web framework
const axios = require('axios') //http request library
const morgan = require('morgan') //logger
const stringify = require('querystring').stringify
const fs = require('fs')

//custom files
const {CLIENT_ID,REDIRECT_URI,CLIENT_SECRET} = require('./credentials')

const app = express()

app.use(morgan('tiny'))

app.get('/',(req,res) => {
  let url = `https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`

  res.send(`<a href= ${url}>Click to authorize</a>`)
})

app.get('/callback', (req,res) => {
  const code = req.query.code
  axios.post('https://api.instagram.com/oauth/access_token',stringify({
    client_id:CLIENT_ID,
    client_secret:CLIENT_SECRET,
    grant_type:'authorization_code',
    redirect_uri:REDIRECT_URI,
    code:code
  }))
  .then(response => {
    const ACCESS_TOKEN = response.data.access_token
    axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${ACCESS_TOKEN}`)
    .then(response => {
      response.data.data.map((imageData, index) => {
        const url = imageData.images.standard_resolution.url
        axios({
          method:'get',
          url:url,
          responseType:'stream'
        })
        .then(response => {
          response.data.pipe(fs.createWriteStream(`img${index}.jpg`))

        })
        .catch(e => {
          console.log(e);
        })
      })
    })
  })
})

app.listen(3000, () => {
  console.log('express app listening')
})
