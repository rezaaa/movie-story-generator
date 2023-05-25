import React, {Component} from 'react';
import styles from './styles.scss';
import Loading from '../loading/Loading';
import themes from './themes';
import {layouts, layoutsName} from './layouts';
import {posterUrl1280} from '../../common/urls';
import Rating from '../rating/Rating';
import icons from '../../assets/styles/icons.scss';
import Selector from '../selector/Selector';

class StoryImage extends Component {
	constructor(props) {
    super(props);
    this.setCanvasRef = this.setCanvasRef.bind(this);
    this.generateImage = this.generateImage.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.getBase64Image = this.getBase64Image.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.disableRate = this.disableRate.bind(this);
    this.link = document.createElement("a");    
    this.state = {moviePoster: '', canvasLoading: false, loading: false, hasRate: 'With Rating', theme: 'dark', layout: 'story'};
  }

  handleDownload() {
    const {data} = this.props;
    if (!this.state.canvasLoading) {
      const imageName = data.original_name || data.title || data.name;
      this.setState({...this.state, loading: true}, () => {
        let link = document.createElement('a');
        const blob = this.dataURLtoBlob(this.canvasRef.toDataURL('image/png'));
        link.href = URL.createObjectURL(blob);
        link.download = `${imageName.toLowerCase().replace(/[/\\?%*:|"<>]/g, '').replace(/\s/g, '-')}.png`;
        this.setState({...this.state, loading: false});
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          URL.revokeObjectURL(blob);
          document.body.removeChild(link);
        }, 100);
        ga('send', 'event', {
          eventCategory: 'export',
          eventAction: 'export',
          eventLabel: 'export'
        });
      });
    }
  }

  componentDidMount() {
    const {data} = this.props;
    this.setState({...this.state, canvasLoading: true});
    this.getBase64Image((data && data.poster_path ? posterUrl1280 + data.poster_path : require('../../assets/images/defaultPoster.jpg')), (base64Image) => {
      this.setState({...this.state, poster: base64Image, rate: data.vote_average});
      this.generateImage(base64Image);
    });
  }

  generateImage(base64Image) {
    const {data, genres} = this.props;
    let canvas = this.canvasRef;
    let ctx = canvas.getContext('2d');
    ctx.save();
    layouts(this.state.layout, canvas, ctx, base64Image, themes, this.state.theme, data, genres, this.state.rate, this.state.hasRate);
    ctx.restore();
    this.setState({...this.state, canvasLoading: false});
  }

  setCanvasRef(node) {
    this.canvasRef = node;
  }

  changeTheme(theme) {
    if(theme != this.state.theme) {
      this.setState({...this.state, theme: theme}, () => {
        this.generateImage(this.state.poster);
      });
    }
  }

  changeLayout(layout) {
    if(layout != this.state.layout) {
      this.setState({...this.state, layout: layout}, () => {
        this.generateImage(this.state.poster);
      });
    }
  }

  disableRate(value) {
      this.setState({...this.state, hasRate: value}, () => {
        this.generateImage(this.state.poster);
      });
  }

  getBase64Image(url, callback) {
    let image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = image.width || 677;
      canvas.height = image.height || 1036;
      canvas.getContext('2d').drawImage(image, 0, 0);
      callback(canvas.toDataURL('image/png'));
    };
    image.src = url;
  }

  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  handleRating(value) {
    if(value != this.state.rate) {
      this.setState({...this.state, rate: value}, () => {
        this.generateImage(this.state.poster);
      });
    }
  }

	render() {
    const {data} = this.props;
    return (
      <div className={styles.storyWrapper}>
        <div className={styles.share}>
          {
            this.state.canvasLoading &&
            <div className={styles.blockingOverlay}></div>
          }
          <h2>Download and Share Your Story</h2>
          <Selector data={['With Rating', 'Without Rating']} activeValue={this.state.hasRate} action={this.disableRate} />
          <div className={styles.rating}>
            <h4>My Rating</h4>
            <Rating max={10} min={0} step={0.5} value={Math.round(data.vote_average*2)/2} handleRating={this.handleRating} />
          </div>
          <Selector data={layoutsName} activeValue={this.state.layout} action={this.changeLayout} />
          <Selector data={Object.keys(themes)} activeValue={this.state.theme} action={this.changeTheme} />
          <div className={styles.export}>
            <span onClick={this.handleDownload} className={[styles.btn, this.state.canvasLoading ? styles.btnDisabled: ''].join(' ')}>
              {
                this.state.loading ?
                <Loading
                  type="absolute"
                  color="btnColor"
                  size="small"
                />
                :
                'Download'
              }
            </span>
            {/* <span className={[icons.iconTwitter, styles.social].join(' ')}></span>
            <span className={[icons.iconTelegram, styles.social].join(' ')}></span> */}
          </div>
        </div>
        <div className={styles.svgCell}>
          <Loading
            type="absolute"
            color="btnColor"
            size="small"
            hide={!this.state.canvasLoading}
          />
          <canvas className={styles.svg} ref={node => this.setCanvasRef(node)} crossOrigin="anonymous" />
        </div>
      </div>
		)
	}
}

export default StoryImage;