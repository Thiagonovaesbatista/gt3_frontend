import React from 'react';
import PropTypes from 'prop-types';

function EmptyState({ buttons }) {
  return (
    <div>
      <p>EMPTY_STATE</p>
      <div className="es-buttons">
        {buttons}
      </div>
    </div>
  );
}

EmptyState.propTypes = {
  buttons: PropTypes.element,
};

EmptyState.defaultProps = {
  buttons: <></>,
};

export default EmptyState;
