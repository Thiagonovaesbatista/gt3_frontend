import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { useDataApi } from '../../hooks';

function ConfirmDialog({
  visible, header, message, renderMessage, onConfirm, onCancel, confirmClassName, service, input,
}) {
  const [{
    isLoading, isError, isSuccess, error,
  }, setDataApi] = useDataApi(null, null, null);
  const messagesRef = useRef({});
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (visible && !(isError || isSuccess || isLoading)) {
      setSent(false);
    }
  }, [visible, isError, isSuccess, isLoading]);
  useEffect(() => {
    if (!sent) {
      if (isLoading) {
        messagesRef.current.clear();
      } else if (isSuccess) {
        onConfirm();
        setSent(true);
      } else if (isError) {
        if (error && error.response && error.response.data && error.response.data.message) {
          messagesRef.current.replace({
            closable: false, sticky: true, severity: 'error', summary: error.response.data.message,
          });
        } else if (error && error.message) {
          messagesRef.current.replace({
            closable: false, sticky: true, severity: 'error', summary: error.message,
          });
        } else {
          messagesRef.current.replace({
            closable: false, sticky: true, severity: 'error', summary: 'Ocorreu algum erro ao confirmar',
          });
        }
      }
    }
  }, [isSuccess, isLoading, isError, error, onConfirm, sent]);
  const callService = () => {
    if (service && input) {
      setSent(false);
      setDataApi({ service, input });
    } else {
      onConfirm();
      setSent(true);
    }
  };
  const footer = (
    <div>
      <Button label="Cancelar" onClick={onCancel} className="p-button-text p-button-plain" />
      <Button label="Confirmar" onClick={callService} className={confirmClassName} autoFocus disabled={isLoading} />
    </div>
  );
  return (
    <Dialog header={header} visible={visible} style={{ width: '50vw' }} footer={footer} onHide={onCancel}>
      <p className="p-m-0">
        {message || renderMessage()}
      </p>
      <Messages ref={messagesRef} />
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  header: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  renderMessage: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  confirmClassName: PropTypes.string,
  service: PropTypes.func,
  input: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
    PropTypes.number,
  ]),
};

ConfirmDialog.defaultProps = {
  confirmClassName: 'p-button-danger',
  message: undefined,
  renderMessage: () => '',
  service: undefined,
  input: undefined,
};

export default ConfirmDialog;
