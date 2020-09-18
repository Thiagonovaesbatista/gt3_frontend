import React, {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { useDataApi } from '../../hooks';
import { postDocumentType } from '../../services/DocumentType';

function DocumentTypeCreateModal({
  visible, onCreate, onCancel,
}) {
  const [documentType, setDocumentType] = useState({});
  const [{
    isSuccess, isLoading, isError, error,
  }, setDataApi, dataApi] = useDataApi();
  const messagesRef = useRef({});
  useEffect(() => {
    if (isLoading) {
      messagesRef.current.clear();
    }
  }, [messagesRef, isLoading]);

  // Is visible and is Success and dataApi.service (just to avoid some issues):
  // invoke callback functions
  useEffect(() => {
    if (visible && isSuccess && dataApi.service) {
      onCreate(documentType);
      setDocumentType({});
      setDataApi({});
    }
  }, [visible, isSuccess, onCreate, documentType, dataApi, setDataApi]);

  // Show request error messages
  useEffect(() => {
    if (isError) {
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
          closable: false, sticky: true, severity: 'error', summary: 'Ocorreu algum erro ao criar',
        });
      }
    }
  }, [messagesRef, isError, error]);
  const {
    control,
    handleSubmit,
    formState,
  } = useForm({ mode: 'all' });

  const onSubmit = (data) => {
    setDocumentType(data);
    setDataApi({
      service: postDocumentType,
      input: { ...data },
    });
  };

  const footer = (
    <>
      <Button label="Cancelar" onClick={onCancel} disabled={isLoading} className="p-button-text p-button-plain" />
      <Button
        label="Confirmar"
        type="submit"
        autoFocus
        disabled={isLoading || !formState.isValid}
        form="createDocumentTypeForm"
      />
    </>
  );

  return (
    <Dialog header="Cadastrar tipo de documento" visible={visible} onHide={onCancel} footer={footer}>
      <form onSubmit={handleSubmit(onSubmit)} id="createDocumentTypeForm">
        <div className="p-fluid p-formgrid p-grid p-p-3">
          <div className="p-field p-col-12">
            <span className="p-float-label">
              <Controller
                as={InputText}
                id="description"
                type="text"
                defaultValue=""
                control={control}
                rules={{ required: 'Descrição é obrigatório' }}
                name="description"
                className={formState.errors.description && 'p-invalid'}
              />
              <label htmlFor="description">Descrição</label>
            </span>
            <small id="description-message" className="p-invalid">{formState.errors.description && formState.errors.description.message}</small>
          </div>
        </div>
        <Messages ref={messagesRef} />
      </form>
    </Dialog>
  );
}

DocumentTypeCreateModal.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default DocumentTypeCreateModal;
