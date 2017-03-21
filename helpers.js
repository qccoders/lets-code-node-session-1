const axios = require('axios')
const stringify = require('querystring').stringify //convert {foo:bar} to foo=bar
const fs = require('fs')
const {CLIENT_ID,REDIRECT_URI,CLIENT_SECRET} = require('./credentials')

module.exports.fetchInstagramToken = (url, code) => {
  return axios.post(url,stringify({
    client_id:CLIENT_ID,
    client_secret:CLIENT_SECRET,
    grant_type:'authorization_code',
    redirect_uri:REDIRECT_URI,
    code:code
  }))
}

module.exports.fetchRecentSelfMedia = access_token => {
    //Access the Instagram endpoint to grab most-recent images from own account
  return axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${access_token}`)
}

module.exports.parseAndDownloadMedia = data => {
  //map over the array returned to only grab the url
   data.map((imageData, index) => {
    const url = imageData.images.standard_resolution.url
  //Make a final ajax request to grab the photo from the url and pipe to filesystem
     axios({method:'get', url:url, responseType:'stream'})
      .then(({data}) => {
       data.pipe(fs.createWriteStream(`img${index}.jpg`))
     })
  })
}
