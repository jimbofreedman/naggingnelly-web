// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import TogglClient from 'toggl-api';
import moment from 'moment';
import { inject, observer } from 'mobx-react';

import config from './config';

class PomodoroTimer extends Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState((prevState) => ({
      seconds: prevState.seconds + 1,
    }));
  }

  render() {
    const { end } = this.props;

    if (!end) {
      return (<Button>--:--</Button>);
    }

    const remaining = moment.duration(end.diff(moment()));
    return (<Button>{`${remaining.get('m')}:${remaining.get('s')}`}</Button>);
  }
};


@inject('user')
@observer
class TimeTracker extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    // eslint-disable-next-line no-undef
    this.audio = new Audio('http://soundbible.com/grab.php?id=701&type=mp3');
    this.toggl = new TogglClient({ apiToken: props.user.user.attributes.togglApiToken });

    this.duration = config.pomodoroDuration;
    this.startPomodoro = this.startPomodoro.bind(this);

    this.toggl.getCurrentTimeEntry((err, entry) => {
      if (entry) {
        const end = moment(entry.start).add(this.duration, 'ms');
        this.setState({
          id: entry.id,
          currentDescription: entry.description,
          end,
        });
        setTimeout(() => {
          this.endPomodoro();
        }, end - moment());
      }
    });
  }

  startPomodoro(description) {
    this.toggl.startTimeEntry({
      description,
      billable: false,
    }, (err, entry) => {
      if (!err) {
        this.setState({
          id: entry.id,
          currentDescription: description,
          end: moment().add(this.duration, 'ms'),
        });

        setTimeout(() => {
          this.endPomodoro();
        }, this.duration);
      }
    });
  }

  endPomodoro() {
    const { id } = this.state;

    this.toggl.stopTimeEntry(id, () => {
      this.audio.play();
      this.setState({
        id: null,
        currentDescription: null,
        end: null,
      });
    });
  }

  render() {
    const { currentDescription, end } = this.state;

    const PomodoroButton = ({ description }) => (
      <Button
        color={description === currentDescription ? 'primary' : null}
        onClick={() => this.startPomodoro(description)}
      >
        {description}
      </Button>
    );

    return (
      <div>
        <PomodoroTimer end={end} />
        <PomodoroButton description="NaggingNelly" />
        <PomodoroButton description="Admin" />
        <PomodoroButton description="Reading" />
        <PomodoroButton description="Memrise" />
      </div>
    );
  }
}

export default TimeTracker;
