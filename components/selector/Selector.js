import React, {Component} from 'react';
import styles from './styles.scss';

class Selector extends Component {
	constructor(props) {
    super(props);
  }

	render() {
    const {data, action, activeValue} = this.props;
    return (
      <div className={styles.selector}>
        {
          data.map((item, index) => {
            return(
              <div key={index} onClick={() => action(item)} className={[styles[`col-${data.length}`], styles.selectorItem, activeValue == item ? styles.selectorItemActive : ''].join(' ')}>
                {item}
              </div>
            )
          })
        }
      </div>
		)
	}
}

export default Selector;