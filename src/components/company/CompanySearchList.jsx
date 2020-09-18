import React, { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { useDataApi } from '../../hooks';
import { getCompanyQuery, deleteCompany } from '../../services/Company';
import ErrorState from '../ErrorState';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import './CompanySearchList.scss';
import CompanyChangeModal from './CompanyChangeModal';
import ConfirmDialog from '../form/ConfirmDialog';
import { removeAllNonDigit, parseCNPJFromDto } from '../../helpers';
import CompanyInfoModal from './CompanyInfoModal';

function getElement(
  isError, isLoading, data,
  setModalVisible, setEditingCompany,
  setConfirmVisible, setDeletingCompany,
  setInfoModalVisible, setInfoCompany,
) {
  const editCompany = (comp) => {
    setEditingCompany(comp);
    setModalVisible(true);
  };
  const delCompany = (company) => {
    setDeletingCompany(company);
    setConfirmVisible(true);
  };
  const infoCompany = (company) => {
    setInfoCompany(company);
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
      <EmptyState />
    );
  }
  const actionBodyTemplate = (company) => (
    <>
      <Button icon="pi pi-info" className="p-button-rounded p-button-text p-button-info p-mr-2" onClick={() => infoCompany(company)} />
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-primary p-mr-2" onClick={() => editCompany(company)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => delCompany(company)} />
    </>
  );
  return (
    <DataTable value={data}>
      <Column field="cnpj" header="CNPJ" />
      <Column field="name" header="Razão social" className="p-d-none p-d-sm-table-cell" />
      <Column field="cep" header="CEP" className="p-d-none p-d-sm-table-cell" />
      <Column field="uf" header="UF" className="p-d-none p-d-md-table-cell" />
      <Column field="city" header="Cidade" className="p-d-none p-d-xl-table-cell" />
      <Column field="phone" header="Telefone" className="p-d-none p-d-lg-table-cell" />
      <Column body={actionBodyTemplate} />
    </DataTable>
  );
}

function CompanySearchList({ cnpj }) {
  const [query, setQuery] = useState({ cnpj });
  const [editingCompany, setEditingCompany] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState({});
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoCompany, setInfoCompany] = useState({});
  const [{ data, isLoading, isError },
    setDataApi, dataApi] = useDataApi({ cnpj }, null, getCompanyQuery);

  const toast = useRef();

  const onChangeCompany = () => {
    setDataApi({ ...dataApi, reloads: dataApi.reloads + 1 });
  };

  const onCreateCompany = () => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Empresa criada' });
    setModalVisible(false);
    onChangeCompany();
  };

  const onEditCompany = () => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Empresa editada' });
    setModalVisible(false);
    onChangeCompany();
    setEditingCompany({});
  };

  const onCancelModal = () => {
    setModalVisible(false);
  };

  const onCancelConfirm = () => {
    setConfirmVisible(false);
  };

  const onDeleteCompany = () => {
    setConfirmVisible(false);
    onChangeCompany();
    setDeletingCompany({});
  };

  const onHideInfoCompany = () => {
    setInfoCompany({});
    setInfoModalVisible(false);
  };

  const createCompany = () => {
    const preDefinedCnpj = {};
    if (query.cnpj) {
      try {
        preDefinedCnpj.cnpj = parseCNPJFromDto(removeAllNonDigit(query.cnpj));
      } catch (error) {
        preDefinedCnpj.cnpj = '';
      }
    }
    setEditingCompany(preDefinedCnpj);
    setModalVisible(true);
  };

  const elementMemo = useMemo(
    () => getElement(isError, isLoading, data,
      setModalVisible, setEditingCompany,
      setConfirmVisible, setDeletingCompany,
      setInfoModalVisible, setInfoCompany),
    [isError, isLoading, data,
      setModalVisible, setEditingCompany,
      setConfirmVisible, setDeletingCompany,
      setInfoModalVisible, setInfoCompany],
  );

  return (
    <Panel header="Consulta de empresas">
      <div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-mr-1">
            <Button onClick={createCompany} className="p-button-success p-button-text p-button-rounded" icon="pi pi-plus" />
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
                  value={query.cnpj}
                  onChange={(event) => setQuery({ ...query, cnpj: event.target.value })}
                  placeholder="Procurar por cnpj..."
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
      <CompanyChangeModal
        visible={modalVisible}
        onCreate={() => onCreateCompany()}
        onEdit={() => onEditCompany()}
        onCancel={() => onCancelModal()}
        company={editingCompany}
      />
      <ConfirmDialog
        visible={confirmVisible}
        onConfirm={() => onDeleteCompany()}
        onCancel={() => onCancelConfirm()}
        renderMessage={() => `Você tem certeza que deseja deletar a empresa com o CNPJ '${deletingCompany.cnpj}'`}
        header="Confirmação de delete da empresa"
        input={deletingCompany.id}
        service={deleteCompany}
      />
      <CompanyInfoModal
        visible={infoModalVisible}
        company={infoCompany}
        onHide={onHideInfoCompany}
      />
      <Toast ref={toast} />
    </Panel>
  );
}

CompanySearchList.propTypes = {
  cnpj: PropTypes.string,
};

CompanySearchList.defaultProps = {
  cnpj: '',
};

export default CompanySearchList;
