import React, {Component} from 'react';
import Loading from '../loading/Loading';
import {getYear} from '../../utils/utils';
import {posterUrl185} from '../../common/urls';
import styles from './styles.scss';
import icons from '../../assets/styles/icons.scss';

class SearchForm extends Component {
	constructor(props) {
		super(props);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleItemClick = this.handleItemClick.bind(this);
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.state = {searchValue: ''};
	}

	handleDocumentClick(e) {
		const {closeSearchList} = this.props;
    if (!this.elementRoot.contains(e.target) && document.contains(e.target)) {
      closeSearchList();
    }
  }

	handleSearch(e) {
		const {action, closeSearchList} = this.props;
		this.setState({...this.state, searchValue: e.target.value});
		action(e.target.value || '');
		document.addEventListener('click', this.handleDocumentClick, false);
	}

	handleItemClick(data) {
		const {closeSearchList, handleModalOpen} = this.props;
		this.setState({...this.state, searchValue: ''}, () => {
			closeSearchList(true);
		});
		handleModalOpen(data);
	}

	render() {
		const {data, loading, notFound, searchListIsVisible, openSearchList} = this.props;
		return (
			<div className={styles.wrapper} ref={node => {
				this.elementRoot = node;
			}}>
				<div className={styles.search}>
					<span className={[styles.searchArrow, icons.iconArrow].join(' ')}></span>
					<Loading
						type="content"
						color="regular"
						size="small"
						hide={!loading || notFound}
						className={styles.loading}
					/>
					{
						notFound && <span className={[styles.notFound, icons.iconClose].join(' ')}></span>
					}
					<input value={this.state.searchValue} placeholder="Movie or Show Name" className={styles.input} onChange={this.handleSearch} onClick={openSearchList} spellcheck="false" />
				</div>
				<div className={[styles.list, data && data.length > 0 && searchListIsVisible ? styles.listVisible : ''].join(' ')}>
					{
						data && data.length > 0 && data.map((item, index) => {
							return (
								<div key={index} className={styles.listItem} onClick={item.media_type != 'person' ? () => this.handleItemClick(item) : () => {}}>
									<div className={styles.poster}>
										<img src={item.poster_path ? posterUrl185 + item.poster_path : item.profile_path ? posterUrl185 + item.profile_path : require('../../assets/images/defaultPoster.jpg')} />
									</div>
									<div className={styles.info}>
										<div className={styles.infoTop}>
											<span className={styles.type}>{item.media_type}</span>
											<span className={styles.year}>{getYear(item.first_air_date || item.release_date)}</span>
										</div>
										<h3>{item.original_name || item.title || item.name}</h3>
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}
}

export default SearchForm;