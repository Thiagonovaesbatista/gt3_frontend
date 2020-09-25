import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { nextId } from '../../helpers';

function SidebarAdapter({
  visible, onCancel, children, title, messagesRef, onSubmit, isLoading, isValid,
}) {
  const [formId] = useState(nextId('sidebarForm'));
  return (
    <Sidebar visible={visible} onHide={onCancel} position="right">
      <div className="sidebar-box">
        <div className="sidebar-header">
          <h2>{title}</h2>
        </div>
        {}
        <div className="sidebar-content p-mb-4">
          <form onSubmit={onSubmit} id={formId}>
            <div className="p-fluid p-formgrid p-grid p-pt-4 p-pl-2 p-pr-2">
              {children}
            </div>
          </form>
        </div>
        <div className="sidebar-footer">
          <Messages ref={messagesRef} />
          <Button label="Cancelar" onClick={onCancel} disabled={isLoading} className="p-button-text p-button-plain" />
          <Button
            label="Confirmar"
            type="submit"
            autoFocus
            disabled={isLoading || !isValid}
            form={formId}
          />
        </div>
      </div>
    </Sidebar>
  );
}

SidebarAdapter.propTypes = {
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  messagesRef: PropTypes.shape().isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default SidebarAdapter;
