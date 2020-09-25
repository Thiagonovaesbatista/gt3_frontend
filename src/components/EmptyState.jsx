import React from 'react';
import PropTypes from 'prop-types';
import './EmptyState.scss';

function EmptyState({ buttons, description, title }) {
  return (
    <div className="container-empty-state">
      <div className="container-icon p-mt-6">
        <i className="icon pi pi-inbox" />
      </div>
      <div className="container-title">
        {title}
      </div>
      <div className="container-description">
        {description}
      </div>
      <div className="es-buttons">
        {buttons}
      </div>
    </div>
  );
}

EmptyState.propTypes = {
  buttons: PropTypes.element,
  description: PropTypes.string.isRequired,
  title: PropTypes.string,
};

EmptyState.defaultProps = {
  buttons: <></>,
  title: 'Vazio',
};

export default EmptyState;
