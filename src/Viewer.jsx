import React from 'react';
import axios from 'axios';
import config from './config'
import ReactHTML from './HTML';

const ViewContent = ({fetching, error, item}) => {
  if (fetching) return <p>Loading...</p>
  if (Object.keys(item).length < 1) return <p>No content</p>
  return (
    <article>
      <h1>{error ? 'Error' : item.title[0].value}</h1>
      {error ? error : <ReactHTML html={item.body[0].value} />}
    </article>
  )
}

class ReactViewer extends React.Component {
  state = {
    fetching: false,
    error: '',
    postId: 1,
    endpoint: config.endpoint,
    item: {}
  }
  handleChange = ({target}) => {
    this.setState({
      [target.name]: target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.fetchThePost()
  }
  componentDidMount() {
    this.fetchThePost()
  }
  async fetchThePost() {
    this.setState({
      fetching: true,
      item: {}
    })
    const { postId , endpoint} = this.state
    try {
      const response = await axios.get(`${endpoint}/node/${postId}?_format=hal_json`)
      if (response.status > 400) throw new Error(response)
      this.setState({
        fetching: false,
        item: response.data
      })
    } catch (e) {
      const { response } = e
      const message = response && Object.keys(response).length > 0 ? `[${response.status}] ${response.data.message}` : 'Internal Server Error'
      this.setState({
        error: message,
        fetching: false
      })
    }
  }
  render () {
    const { postId, endpoint } = this.state
    return (
      <div>
        <h1>Drupal Content Viewer</h1>
        <form onSubmit={this.handleSubmit} className="form">
          <p>
            <label>
              Drupal URL
              <input name="endpoint" value={endpoint} onChange={this.handleChange} />
            </label>
          </p>
          <p>
            <label>
              Post ID
              <input name="postId" value={postId} onChange={this.handleChange} />
            </label>
          </p>
          <button type="submit">Fetch</button>
        </form>
        <hr />
        <ViewContent {...this.state} />
      </div>
    )
  }
}

export default ReactViewer
