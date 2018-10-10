import React from 'react';
import PropTypes from 'prop-types';
import styles from './loading.scss';

const Loading = ({ type, color, size, hide, className }) => {
  const loadingWrapperClassName =
    styles[`loading-wrapper-${type || 'content'}`];
  const spinnerClasses =
    styles[`spinner-${size || 'normal'}-${color || 'regular'}`];
  const isHidden = hide;
  let visibility = isHidden ? styles.hidden : '';
  return (
    <div className={[loadingWrapperClassName, visibility, className].join(' ')}>
      <span className={spinnerClasses} />
    </div>
  );
};

Loading.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  hide: PropTypes.bool,
};

export default Loading;
