import React from 'react';
import PropTypes from 'prop-types';
import './ErrorState.scss';

function ErrorState({ description, title }) {
  return (
    <div className="container-error-state">
      <div className="container-icon p-mt-6">
        <i className="icon pi pi-exclamation-triangle" />
      </div>
      <div className="container-title">
        {title}
      </div>
      <div className="container-description">
        {description}
      </div>

    </div>
  );
}

ErrorState.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string,
};

ErrorState.defaultProps = {
  description: 'Ocorreu algum erro na página',
  title: 'Erro na página',
};

export default ErrorState;
