import React, { Component } from 'react'
import exponentialBackOff from 'exponential-backoff'

export default class App extends Component {
  state = {
    text: '',
    error: false
  }

  input = null
  handleChange = () => {
    this.setState({ text: this.input.value })
  }

  componentDidMount () {
    exponentialBackOff(this.fetchText, {
      timeout: 20 * 1000  
    })
  }

  fetchText () {
    fetch('/text')
      .then(response => {
        const { text } = response.json()
        this.setState({ text })
      })
  }

  syncWithServer () {
    fetch('/text', {
      method: 'POST',
      payload: { text: this.state.text }
    })
    .catch(e => {
      this.setState({ error: true })
    })
  }

  render () {
    return <div className={this.state.error ? 'error' : ''}>
      <h1>{this.state.text}</h1>
      <input type='text' ref={ref => this.input = ref} onChange={this.handleChange} />
      <button onClick={this.syncWithServer}>Sync</button>
    </div>
  }
}
