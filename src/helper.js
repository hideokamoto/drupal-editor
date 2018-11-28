require('es6-promise').polyfill();
require('isomorphic-fetch');

export const getToken = (endpoint) => {
  const url = `${endpoint}/rest/session/token`
  return fetch(url)
    .then(response => {
      if (response.status >= 400) {
        console.log('Error: %j', response)
        if (response.status >= 500) throw new Error('Internal Server Error')
        throw new Error('Bad Request')
      }
      return response.text()
    }).catch(err => {
      console.log(err)
      throw err
    })
}


export const request = (url, params = {
  mode:'cors',
  headers: {
    'Access-Control-Allow-Origin':'*'
  }
}) => {
  return fetch(url, params)
    .then(response => {
      if (response.status >= 400) {
        console.log('Error: %j', response)
        if (response.status >= 500) throw new Error('Internal Server Error')
        throw new Error('Bad Request')
      }
      return response.json()
    }).catch(err => {
      console.log(err)
      throw err
    })
}
