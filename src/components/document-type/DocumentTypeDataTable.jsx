import React, {
  useState, useMemo, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { useDataApi } from '../../hooks';
import ErrorState from '../ErrorState';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import './DocumentTypeDataTable.scss';
import ConfirmDialog from '../form/ConfirmDialog';
import { getDocumentTypeQuery, deleteDocumentType, putDocumentType } from '../../services/DocumentType';
import DocumentTypeCreateModal from './DocumentTypeCreateModal';

function getElement(
  isError, isLoading, dataTable, dataApi, toast, isSuccessEdit, isLoadingEdit,
  setConfirmVisible, setDeletingDocumentType, setDataApi, setDataApiEdit, setDataTable,
) {
  const delDocumentType = (documentType) => {
    setDeletingDocumentType(documentType);
    setConfirmVisible(true);
  };
  if (isSuccessEdit && !isLoadingEdit) {
    setDataApiEdit({});
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de documento editado' });
    setDataApi({ ...dataApi, reloads: dataApi.reloads + 1 });
  }
  if (isError) {
    return (
      <ErrorState />
    );
  } if (isLoading) {
    return (
      <LoadingState />
    );
  } if (!dataTable || dataTable.length === 0) {
    return (
      <EmptyState />
    );
  }
  const actionBodyTemplate = (documentType) => (
    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => delDocumentType(documentType)} />
  );
  const editorTemplate = (props) => (
    <form
      name={`editDocumentType${props.rowIndex}`}
      onSubmit={() => {
        setDataApiEdit({
          service: putDocumentType,
          input: [
            props.rowData.id,
            dataTable[props.rowIndex],
          ],
        });
      }}
    >
      <div className="p-fluid">
        <InputText
          type="text"
          className="p-inputtext-sm p-d-block p-mb-2"
          value={props.rowData[props.field]}
          onChange={(e) => {
            const updated = [...dataTable];
            updated[props.rowIndex][props.field] = e.target.value;
            setDataTable(updated);
          }}
        />
      </div>
    </form>
  );
  return (
    <DataTable value={dataTable}>
      <Column field="description" header="Descrição do tipo de documento" editor={(props) => editorTemplate(props)} />
      <Column body={actionBodyTemplate} headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
    </DataTable>
  );
}

function DocumentTypeDataTable({ description }) {
  const [query, setQuery] = useState({ description });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingDocumentType, setDeletingDocumentType] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [{ data, isLoading, isError },
    setDataApi, dataApi] = useDataApi({ description }, null, getDocumentTypeQuery);
  const [dataTable, setDataTable] = useState([]);
  const [{ isSuccessEdit, isLoadingEdit }, setDataApiEdit] = useDataApi();

  useEffect(() => {
    setDataTable(data);
  }, [setDataTable, data]);

  const toast = useRef();

  const onChangeDocumentType = () => {
    setDataApi({ ...dataApi, reloads: dataApi.reloads + 1 });
  };

  const onCreateDocumentType = () => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de documento criado' });
    onChangeDocumentType();
    setModalVisible(false);
  };

  const onCancelConfirm = () => {
    setConfirmVisible(false);
  };

  const onCancelModal = () => {
    setModalVisible(false);
  };

  const onDeleteDocumentType = () => {
    setConfirmVisible(false);
    onChangeDocumentType();
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de documento deletado' });
  };

  const createDocumentType = () => {
    setModalVisible(true);
  };

  const elementMemo = useMemo(
    () => getElement(isError, isLoading, dataTable, dataApi, toast, isSuccessEdit, isLoadingEdit,
      setConfirmVisible, setDeletingDocumentType, setDataApi, setDataApiEdit, setDataTable),
    [isError, isLoading, dataTable, dataApi, toast, isSuccessEdit, isLoadingEdit,
      setConfirmVisible, setDeletingDocumentType, setDataApi, setDataApiEdit, setDataTable],
  );

  return (
    <Panel header="Consulta de empresas">
      <div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-mr-1">
            <Button onClick={createDocumentType} className="p-button-success p-button-text p-button-rounded" icon="pi pi-plus" />
          </div>
          <div className="p-field p-col">
            <form onSubmit={(event) => {
              setDataApi({ ...dataApi, input: query });
              event.preventDefault();
            }}
            >
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  type="search"
                  value={query.description}
                  onChange={(event) => setQuery({ ...query, description: event.target.value })}
                  placeholder="Procurar por descrição..."
                />
              </span>
            </form>
          </div>
        </div>
      </div>
      <div className="card">
        {elementMemo}
      </div>

      {/* Dialogs and toasts */}
      <DocumentTypeCreateModal
        visible={modalVisible}
        onCreate={() => onCreateDocumentType()}
        onCancel={() => onCancelModal()}
      />
      <ConfirmDialog
        visible={confirmVisible}
        onConfirm={() => onDeleteDocumentType()}
        onCancel={() => onCancelConfirm()}
        renderMessage={() => 'Você tem certeza que deseja deletar o tipo de documento'}
        header="Confirmação de delete do tipo de documento"
        input={deletingDocumentType.id}
        service={deleteDocumentType}
      />
      <Toast ref={toast} />
    </Panel>
  );
}

DocumentTypeDataTable.propTypes = {
  description: PropTypes.string,
};

DocumentTypeDataTable.defaultProps = {
  description: '',
};

export default DocumentTypeDataTable;
