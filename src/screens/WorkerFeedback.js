import React, { Component } from 'react'
import Feedback from '../components/Feedback'

export default class WorkerFeedback extends Component {
    render() {
        return (
            <Feedback mode="worker" {...this.props} />
        )
    }
}
