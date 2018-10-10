import React, {Component} from 'react';
import StoryImage from '../storyImage/StoryImage';
import styles from './styles.scss';
import icons from '../../assets/styles/icons.scss';

class Modal extends Component {
	constructor(props) {
		super(props);
		this.findGenres = this.findGenres.bind(this);
	}

	findGenres() {
		const {data, genres} = this.props;
		if(data) {
			const itemGenres = genres[data.media_type || 'movie'].filter(item => {
				for (let i = 0, length = 2; i < length; i++) {
					if (data.genre_ids[i] === item.id) {
						return true;
					}
				}
				return false;
			});
			return itemGenres;
		}
	}

	render() {
		const {data, open, handleClose} = this.props;
		return (
			<div className={[styles.overlay, open ? styles.visible : ''].join(' ')}>
        <span className={[styles.close, icons.iconClose].join(' ')} onClick={handleClose}></span>
        <div className={styles.modal}>
          {
            data && open &&
            <StoryImage data={data} genres={this.findGenres()} />          
          }
        </div>
			</div>
		)
	}
}

export default Modal;