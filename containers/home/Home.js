import React, {Component} from 'react';
import { connect } from 'react-redux';
import SearchForm from '../../components/searchForm/SearchForm';
import Modal from '../../components/modal/Modal';
import styles from './styles.scss';
import {fetchMoviesRequest, clearResults} from '../../actions/movies';
import {fetchMovieGenresRequest, fetchTvGenresRequest} from '../../actions/genres';
import {fetchTrendingRequest} from '../../actions/trending';
import {posterUrl300} from '../../common/urls';


class Home extends Component {
	constructor(props) {
		super(props);
		this.generateStory = this.generateStory.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.closeSearchList = this.closeSearchList.bind(this);
		this.openSearchList = this.openSearchList.bind(this);
		this.state = {showStory: false, modalIsOpen: false, searchListIsVisible: false};
	}

	componentDidMount() {
		const {fetchMovieGenres, fetchTvGenres, fetchTrends} = this.props;
		fetchMovieGenres();
		fetchTvGenres();
		fetchTrends();
	}

	generateStory() {
		this.setState({...this.state, showStory: !this.state.showStory});
	}

	handleModalOpen(data) {
		this.setState({...this.state, modalIsOpen: true, selectedItem: data});
	}
	
	handleModalClose() {
		this.setState({...this.state, modalIsOpen: false, selectedItem: null});
	}

	handleSearch(title) {
		const {fetchMovies} = this.props;
		this.setState({...this.state, searchListIsVisible: true});
		fetchMovies(title);
	}

	closeSearchList(forceClear) {
		const {resetResults, movies} = this.props;
		this.setState({...this.state, searchListIsVisible: false});
		if (movies.movieTitle.length == 0 || forceClear) {
			resetResults();		
		}
	}

	openSearchList() {
		this.setState({...this.state, searchListIsVisible: true});
	}

	render() {
		const {movies, notFound, movieGenres, tvGenres, trends} = this.props;
		return (
			<div className={styles.main}>
				<div className={styles.bgWrapper}>
					<span className={styles.bgCircle}></span>
				</div>
				<div className={styles.header}>
					<a href="/">
						<img className={styles.logo} src={require('../../assets/images/logo.png')} />	
					</a>
				</div>
				<div className={styles.content}>
					<div className={styles.contentLeftSide}>
						<h1>Share your thoughts about<br />movies as <em>Story.</em></h1>
						<SearchForm
							data={movies.results && movies.results.results}
							action={this.handleSearch}
							openSearchList={this.openSearchList}
							closeSearchList={this.closeSearchList}
							searchListIsVisible={this.state.searchListIsVisible}
							loading={movies.fetching}
							notFound={notFound}
							handleModalOpen={this.handleModalOpen}
						/>
					</div>
					<div className={styles.contentRightSide}>
						<div className={styles.defaultContent}>
							{
								trends && trends.length > 0 && trends.map((item, index) => {
									return (
										<div className={styles.moviePoster} onClick={() => this.handleModalOpen(item)}>
											<img src={item.poster_path ? posterUrl300 + item.poster_path : require('../../assets/images/defaultPoster.jpg')} />
											<span className={styles.rank}>{index + 1}</span>
										</div>
									)
								})
							}
						</div>
					</div>
				</div>
				<Modal data={this.state.selectedItem} genres={{movie: movieGenres, tv: tvGenres}} open={this.state.modalIsOpen} handleClose={this.handleModalClose} />
				<div className={styles.footer}>
					Created by <a href="https://www.instagram.com/rezaaa/" target="_blank">Mohammad Reza Mahmoudi</a>				
					<div className={styles.github}>
						<a class="github-button" href="https://github.com/rezaaa/movie-story-generator" data-icon="octicon-star" data-show-count="true" aria-label="Star rezaaaa/story-generator on GitHub">Star</a>
						<a class="github-button" href="https://github.com/rezaaa/movie-story-generator/fork" data-icon="octicon-repo-forked" data-show-count="true" aria-label="Fork rezaaa/story-generator on GitHub">Fork</a>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
  const {
		movies,
		movieGenres,
		tvGenres,
		trending,
  } = state;
  return {
		movies,
		notFound: movies.movieTitle && movies.movieTitle.length > 0 && !movies.fetching && movies.results && movies.results.total_results == 0,
		movieGenres: movieGenres && movieGenres.results && movieGenres.results.genres || null,
		tvGenres: tvGenres && tvGenres.results && tvGenres.results.genres || null,
		trends: trending && trending.results && trending.results.trends.slice(0, 4) || null
	};
}

const mapDispatchToProps = dispatch => {
  return {
		fetchMovieGenres: () => {
      dispatch(fetchMovieGenresRequest());
		},
		fetchTvGenres: () => {
      dispatch(fetchTvGenresRequest());
		},
    fetchMovies: title => {
      dispatch(fetchMoviesRequest(title));
		},
		resetResults: () => {
			dispatch(clearResults());
		},
		fetchTrends: () => {
			dispatch(fetchTrendingRequest());
		}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
