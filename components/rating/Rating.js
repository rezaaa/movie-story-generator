import React, { Component } from 'react';
import InputRange from 'react-input-range';
import styles from './styles.scss';

class Rating extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  render() {
    const{max, min, step, handleRating} = this.props;
    return (
      <InputRange
        maxValue={max}
        minValue={min}
        step={step}
        value={this.state.value}
        onChange={value => this.setState({ value })} 
        onChangeComplete={handleRating}
        formatLabel={value => value}
      />
    );
  }
}

export default Rating;
