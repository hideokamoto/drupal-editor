const request = require('request-promise')
const btoa = require('btoa')
const endpoint = 'https://d8-api-sandbox.annai.co.jp'
const username = 'admin'
const password = 'taeth4Xi'
const format = 'hal_json'

/**
 * DrupalにPOSTするObject
 */
const newNode = {
  _links: {
    type: {
      href: endpoint + '/rest/type/node/article'
    }
  },
  type: {
    target_id: 'article'
  },
  title: {
    value: 'Hello HTML tags3'
  },
  body: {
    value: `This is example post.<br /><h2>HTML content</h2><ul><li>test</li><li>aaa</li></ul>`
  },
  moderation_state: [ { value: 'published' } ]
};

/**
 * Client Object
 */
class RESTClient {
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
   * get CSRF token
   * @return {Promise<string>}
   */
  async getCsrfToken () {
    const requestParam = await this.getRequestParam('GET', 'rest/session/token')
    const { body } = await this.sendRequest(requestParam)
    return body
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
      'X-CSRF-Token': csrfToken,
      'Access-Control-Allow-Origin':'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true'
    }
  }
  /**
   * Get request object
   * @param {string} method HTTP method
   * @param {string} path request path
   * @param {object} [body={}] request body
   * @return {Promise<{}>}
   */
  async getRequestParam (method, path, body = {}) {
    const params = {
      method,
      uri: `${this.endpoint}/${path}${this.getContentType('path')}`,
      json: true,
      resolveWithFullResponse: true
    }
    if (method !== 'GET') {
      params.body = body
      params.headers = await this.getHeader()
    }
    console.log(params)
    return params
  }
  /**
   * call request lib to call the api
   * @param {object} requestParam request param
   */
  sendRequest(requestParam) {
    return request(requestParam)
  }
  /**
   * Call api to send a request
   * @param {string} method HTTP method
   * @param {string} path request path
   * @param {object} [node={}] Added Drupal content
   * @return {Promise<{}>}
   */
  async request(method, path, node = {}) {
    const requestParam = await this.getRequestParam(method, path, node)
    return this.sendRequest(requestParam)
  }
}

const client = new RESTClient(endpoint, format)
client.configureBasicAuth(username, password)

/**/
client.request('GET', 'node/1', newNode)
  .then(result => {
    console.log(result.statusCode)
    console.log(result.body)
    console.log(result.message)
  })
  .catch(result => {
    console.log(result.statusCode)
    console.log(result.body)
    console.log(result.message)
    console.log(result.error)
  })
/**/
client.request('POST', 'node', newNode)
  .then(result => {
    console.log(result.statusCode)
    console.log(result.body)
    console.log(result.message)
  })
  .catch(result => {
    console.log(result.statusCode)
    console.log(result.body)
    console.log(result.message)
    console.log(result.error)
  })
/**/
