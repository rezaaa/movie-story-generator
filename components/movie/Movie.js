import React, {Component} from 'react';
import styles from './styles.scss';
import {trimYear} from '../../utils/utils';

class Movie extends Component {
	constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
  }
  
  handleModal() {
    const {handleChange, handleModalOpen} = this.props;
    handleModalOpen();
  }

	render() {
    const {data} = this.props;
		return (
			<div className={styles.movie}>
        <div className={styles.imageWrapper}>
          <img src={data.Poster != 'N/A' ? data.Poster : require('../../assets/images/defaultPoster.jpg')} alt={data.Title} />
        </div>
        <div className={styles.info}>
          <div className={styles.ranking}>{data.imdbRating == 'N/A' ? '-' : data.imdbRating}</div>
          <div className={styles.topRow}>
            <div className={[styles.extraInfo, styles.year].join(' ')}><em>Year: </em>{data.Year == 'N/A' ? '-' : trimYear(data.Year)}</div>
            <div className={[styles.extraInfo, styles.genre].join(' ')}><em>Genre: </em>{data.Genre == 'N/A' ? '-' : data.Genre}</div>
          </div>
          <h2>{data.Title}</h2>
          <span className={styles.mainBtn} onClick={this.handleModal}>Generate Story Image</span>
        </div>
			</div>
		)
	}
}

export default Movie;