import React, { useState, useMemo, useRef } from 'react';
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
import './ContractSearchList.scss';
import ContractChangeSidebar from './ContractChangeSidebar';
import ConfirmDialog from '../form/ConfirmDialog';
import ContractInfoSidebar from './ContractInfoSidebar';
import { getContractQuery, deleteContract } from '../../services/Contract';

function getElement(
  isError, isLoading, data,
  setModalVisible, setEditingContract,
  setConfirmVisible, setDeletingContract,
  setInfoModalVisible, setInfoContract,
) {
  const editCompany = (contract) => {
    setEditingContract(contract);
    setModalVisible(true);
  };
  const delCompany = (contract) => {
    setDeletingContract(contract);
    setConfirmVisible(true);
  };
  const infoCompany = (contract) => {
    setInfoContract(contract);
    setInfoModalVisible(true);
  };
  if (isError) {
    return (
      <ErrorState />
    );
  } if (isLoading) {
    return (
      <LoadingState />
    );
  } if (!data || data.length === 0) {
    return (
      <EmptyState description="Não há nenhum contrato cadastrado" />
    );
  }
  const actionBodyTemplate = (contract) => (
    <>
      <Button icon="pi pi-info" className="p-button-rounded p-button-text p-button-info p-mr-2" onClick={() => infoCompany(contract)} />
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-primary p-mr-2" onClick={() => editCompany(contract)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => delCompany(contract)} />
    </>
  );
  return (
    <DataTable value={data}>
      <Column field="number" header="Número de contrato" />
      <Column field="company.name" header="Empresa" className="p-d-none p-d-sm-table-cell" />
      <Column field="email" header="Email responsável" className="p-d-none p-d-md-table-cell" />
      <Column field="user" header="Usuário plataforma" className="p-d-none p-d-xl-table-cell" />
      <Column body={actionBodyTemplate} headerStyle={{ width: '11rem' }} bodyStyle={{ textAlign: 'center' }} />
    </DataTable>
  );
}

function ContractSearchList() {
  const [query, setQuery] = useState({});
  const [editingContract, setEditingContract] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingContract, setDeletingContract] = useState({});
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoContract, setInfoContract] = useState({});
  const [{ data, isLoading, isError },
    setDataApi, dataApi] = useDataApi({}, null, getContractQuery);

  const toast = useRef();

  const onChangeContract = () => {
    setDataApi({ ...dataApi, reloads: dataApi.reloads + 1 });
  };

  const onCreateContract = () => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Contrato criada' });
    setModalVisible(false);
    onChangeContract();
  };

  const onEditContract = () => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Contrato editada' });
    setModalVisible(false);
    onChangeContract();
    setEditingContract({});
  };

  const onCancelModal = () => {
    setModalVisible(false);
  };

  const onCancelConfirm = () => {
    setConfirmVisible(false);
  };

  const onDeleteContract = () => {
    setConfirmVisible(false);
    onChangeContract();
    setDeletingContract({});
  };

  const onHideInfoContract = () => {
    setInfoContract({});
    setInfoModalVisible(false);
  };

  const createContract = () => {
    setEditingContract({});
    setModalVisible(true);
  };

  const elementMemo = useMemo(
    () => getElement(isError, isLoading, data,
      setModalVisible, setEditingContract,
      setConfirmVisible, setDeletingContract,
      setInfoModalVisible, setInfoContract),
    [isError, isLoading, data,
      setModalVisible, setEditingContract,
      setConfirmVisible, setDeletingContract,
      setInfoModalVisible, setInfoContract],
  );

  return (
    <Panel header="Contratos">
      <div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-mr-1">
            <Button onClick={createContract} className="p-button-success p-button-text p-button-rounded" icon="pi pi-plus" />
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
                  value={query.number}
                  onChange={(event) => setQuery({ ...query, number: event.target.value })}
                  placeholder="Procurar pelo número de contrato..."
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
      <ContractChangeSidebar
        visible={modalVisible}
        onCreate={() => onCreateContract()}
        onEdit={() => onEditContract()}
        onCancel={() => onCancelModal()}
        contract={editingContract}
      />
      <ConfirmDialog
        visible={confirmVisible}
        onConfirm={() => onDeleteContract()}
        onCancel={() => onCancelConfirm()}
        renderMessage={() => `Você tem certeza que deseja deletar o contrato de número '${deletingContract.number}'`}
        header="Confirmação de delete do contrato"
        input={deletingContract.id}
        service={deleteContract}
      />
      <ContractInfoSidebar
        visible={infoModalVisible}
        contract={infoContract}
        onHide={onHideInfoContract}
      />
      <Toast ref={toast} />
    </Panel>
  );
}

export default ContractSearchList;
