import React from 'react';
import PropTypes from 'prop-types';
import './ProductHeader.scss';
import { Accumulator } from '../../../helpers';

const accumulator = Accumulator();

function ProductHeader({
  id, header, baseZIndex, children,
}) {
  return (
    <div id={id} className="box" style={{ index: baseZIndex }}>
      <div className="sds-container header">
        <h1 className="title">{header}</h1>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

ProductHeader.propTypes = {
  id: PropTypes.string,
  header: PropTypes.string.isRequired,
  baseZIndex: PropTypes.number,
  children: PropTypes.element,
};

ProductHeader.defaultProps = {
  id: accumulator.next().toString(),
  baseZIndex: 0,
  children: (<></>),
};

export default ProductHeader;
