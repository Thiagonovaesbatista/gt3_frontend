import React from 'react';
import PropTypes from 'prop-types';
import './Layout.scss';
import ProductHeader from './sds/product-header/ProductHeader';

function Layout({ title, children }) {
  return (
    <>
      <ProductHeader header={title} />
      <div className="sds-container">
        {children}
      </div>
    </>
  );
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default Layout;
