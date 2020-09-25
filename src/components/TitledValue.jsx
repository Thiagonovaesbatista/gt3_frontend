import React from 'react';
import PropTypes from 'prop-types';
import './TitledValue.scss';

function TitledValue({ title, value }) {
  return (
    <div className=" p-fluid p-grid p-dir-col p-text-left p-m-2">
      <div className="p-col title title-info p-p-0">
        {title}
      </div>
      <div className="p-col p-p-0 content-info">
        {value}
      </div>
    </div>
  );
}

TitledValue.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
};

export default TitledValue;
