import React from 'react';
import axios from 'axios';
import config from './config';

const createPostQuery = (endpoint, post) => {
  const { title, content } = post
  if (!title || !content) return new Error('Error: title and content is required')
  const node = {
    _links: {
      type: {
        href: endpoint + '/rest/type/node/article'
      }
    },
    type: {
      target_id: 'article'
    },
    title: {
      value: title
    },
    body: {
      value: content
    }
  };
  return node
}

class Client {
  constructor (endpoint, username, password) {
    this.endpoint = endpoint
    this.username = username
    this.password = password
  }
  getAuth() {
    return {
      username: this.username,
      password: this.password
    }
  }
  async post (body) {
    const { data } = await axios.get(`${this.endpoint}/rest/session/token`)
    const param = {
      method: 'POST',
      url: `${this.endpoint}/node?_format=hal_json`,
      data: body,
      headers: {
         'Content-Type': 'application/hal+json',
         'X-CSRF-Token': data,
         'Access-Control-Allow-Origin':'*',
         'Access-Control-Allow-Credentials': 'true'
      },
      auth: this.getAuth()
    }
    try {
      const response = await axios(param)
      return {
        message: response.statusText,
        link: response.data['_links'].self.href
      }
    } catch (e) {
      const { response } = e
      const message = response && Object.keys(response).length > 0 ? `[${response.status}] ${response.data.message}` : 'Internal Server Error'
      return {
        message: message,
        link: ''
      }
    }
  }
}

const Result = ({result, createdLink}) => {
  if (!result) return null;
  return (
    <p>
      {result}
      {createdLink ? (<a href={createdLink} target="_blank" rel="noopener noreferrer">{createdLink}</a>): null}
    </p>
  )
}

class ReactEditor extends React.Component {
  state = {
    title: '',
    endpoint: config.endpoint,
    username: config.username,
    password: config.password,
    content: '',
    result: '',
    createdLink: ''
  }
  handleChange = ({target}) => {
    this.setState({
      [target.name]: target.value
    })
  }
  handleSubmit = async (e) => {
    e.preventDefault()
    const param = createPostQuery(this.state.endpoint, this.state)
    if (param instanceof Error) {
      this.setState({
        result: param.message
      })
      return
    }
    this.setState({
      result: ''
    })
    const { endpoint, username, password} = this.state
    const client = new Client(endpoint, username, password)
    const { message, link } = await client.post(param)
    this.setState({
      result: message,
      createdLink: link
    })
  }
  render () {
    const { title, content } = this.state
    return (
      <div>
        <h1>Editor</h1>
        <Result {...this.state} />
        <form onSubmit={this.handleSubmit} className="form">
          <table>
            <tbody>
              <tr>
                <th><label htmlFor='title'>Title</label></th>
                <td>
                  <input
                    onChange={this.handleChange} 
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                  />
                </td>
              </tr>
              <tr>
                <th><label htmlFor='content'>Content</label></th>
                <td>
                  <textarea
                    onChange={this.handleChange} 
                    id="content"
                    name="content"
                    value={content}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit">Post</button>
        </form>
      </div>
    )
  }
}

export default ReactEditor
