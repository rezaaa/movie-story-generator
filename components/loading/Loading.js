import React from 'react';
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

export default Loading;
