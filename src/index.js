import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { request, getToken } from './helper';
import DrupalClient from './client';
// import './test.js';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
const test = () => {
  const username = 'admin'
  const password = 'taeth4Xi'
  const format = 'hal_json'
  const endpoint = 'https://d8-api-sandbox.annai.co.jp'

  const client = new DrupalClient(endpoint, format)
  client.configureBasicAuth(username, password)
  client.request('GET', 'node/1')
    .then(result => {
      console.log(result)
    })
    .catch(result => {
      console.log(result)
    })

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

  client.request('POST', 'node', newNode)
    .then(result => {
      console.log(result)
    })
    .catch(result => {
      console.log(result)
    })

}

test()
