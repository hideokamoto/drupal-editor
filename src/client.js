import 'whatwg-fetch'
class DrupalClient {
  /**
   *
   * @param {string} endpoint API endpoint
   * @param {string} [type='hal_json'] Request type
   */
  constructor (endpoint, type = 'hal_json') {
    this.endpoint = endpoint
    this.authorization = ''
    this.contentType = type
  }
  /**
   * get content type string
   * @param {string} place called place
   * @return {string}
   */
  getContentType (place) {
    if (!place) return this.contentType
    if (place === 'header') {
      if (this.contentType === 'hal_json') return 'application/hal+json'
      if (this.contentType === 'json') return 'application/json'
    } else if (place === 'path') {
      if (this.contentType === 'hal_json') return '?_format=hal_json'
      if (this.contentType === 'json') return '?_format=json'
    }
    return this.contentType
  }
  /**
   * create authorization by basic auth
   * @param {string} username Drupal admin username
   * @param {string} password Drupal admin password
   */
  configureBasicAuth(username, password) {
    const basicAuthCredential = username + ":" + password;
    const bace64 =  btoa(basicAuthCredential);
    this.authorization = `Basic ${bace64}`;
  }
  /**
   * get authorization
   * @return {string} authorization header string
   */
  getAuthorization () {
    return this.authorization
  }

  // ASYNC
  /**
   * get request header
   * @return {Promise<Object>} header object
   */
  async getHeader() {
    if (!this.authorization) throw new Error('authorization is required')
    const csrfToken = await this.getCsrfToken()
    if (!csrfToken) throw new Error('X-CSRF-Token is required')
    return {
      'Content-Type': this.getContentType('header'),
      'Authorization': this.getAuthorization(),
      'X-CSRF-Token': csrfToken
    }
  }
  /**
   * Get request object
   * @param {object} [body={}] request body
   * @return {Promise<{}>}
   */
  async getRequestParam (method, body = {}) {
    if (method === 'GET') return Promise.resolve({})
    return {
      method,
      body,
      headers: await this.getHeader(),
      mode:'no-cors',
    }
  }

  /**
   * get CSRF token
   * @return {Promise<string>}
   */
  async getCsrfToken () {
    const url = `${this.endpoint}/rest/session/token`
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
  /**
   * call request lib to call the api
   * @param {object} requestParam request param
   */
  sendRequest(method, url, params = {}) {
    if (method === 'GET') return fetch(url)
    return fetch(url, params)
  }

  /**
   * Call api to send a request
   * @param {string} method HTTP method
   * @param {string} path request path
   * @param {object} [node={}] Added Drupal content
   * @return {Promise<{}>}
   */
  async request(method, path, node = {}) {
    const url = `${this.endpoint}/${path}${this.getContentType('path')}`
    const requestParam = await this.getRequestParam(method, path, node)
    try {
      const response = await this.sendRequest(method, url, requestParam)
      if (response.status >= 400) {
        console.log('Error: %j', response)
        if (response.status >= 500) throw new Error('Internal Server Error')
        throw new Error('Bad Request')
      }
      const data = response.json()
      return data
    } catch (e) {
      console.log(e)
      return e
    }
  }
}

export default DrupalClient;
