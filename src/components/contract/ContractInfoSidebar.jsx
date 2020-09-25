import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from 'primereact/sidebar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TitledValue from '../TitledValue';
import EmptyState from '../EmptyState';
import './ContractInfoSidebar.scss';

function ContractInfoSidebar({ visible, onHide, contract }) {
  const content = () => {
    if (contract && Object.keys(contract).length > 0) {
      return (
        <>
          <h2>Informações de contrato</h2>
          <div className="p-grid">
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Número de contrato" value={contract.number} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Nome da empresa" value={contract.company && contract.company.name} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Email do responsavel" value={contract.email} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Usuário da plataforma" value={contract.user} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Data inicio" value={contract.start && contract.start.toLocaleDateString('pt-BR')} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Data fim" value={contract.end && contract.end.toLocaleDateString('pt-BR')} />
            </div>
            <div className="p-col-12">
              <TitledValue
                title="Documentos"
                value={
                (
                  <DataTable value={contract.documentTypes} className="p-datatable-sm">
                    <Column field="description" header="Descrição" />
                    <Column
                      field="requiredAttachment"
                      header="Anexo obrigatório"
                      body={(rowData) => {
                        if (rowData.requiredAttachment) {
                          return (<div>Sim</div>);
                        }
                        return (<div>Não</div>);
                      }}
                    />
                  </DataTable>
                )
              }
              />
            </div>
          </div>
        </>
      );
    }
    return (<EmptyState description="Não há valores a serem mostrados" />);
  };
  return (
    <Sidebar position="right" visible={visible} onHide={onHide}>
      {content()}
    </Sidebar>
  );
}

ContractInfoSidebar.propTypes = {
  onHide: PropTypes.func.isRequired,
  contract: PropTypes.shape().isRequired,
  visible: PropTypes.bool.isRequired,
};

export default ContractInfoSidebar;
