import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from 'primereact/sidebar';
import TitledValue from '../TitledValue';
import EmptyState from '../EmptyState';

function CompanyInfoSidebar({ visible, onHide, company }) {
  const content = () => {
    if (company && Object.keys(company).length > 0) {
      return (
        <>
          <h2>Informações da empresa</h2>
          <div className="p-grid">
            <div className="p-col-12 p-lg-6">
              <TitledValue title="CNPJ" value={company.cnpj} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Razão Social" value={company.name} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="CEP" value={company.cep} />
            </div>
            <div className="p-col-4 p-lg-2">
              <TitledValue title="UF" value={company.uf} />
            </div>
            <div className="p-col-8 p-lg-4">
              <TitledValue title="Cidade" value={company.city} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Bairro" value={company.district} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Endereço" value={company.address} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Complemento do endereço" value={company.addressComplement} />
            </div>
            <div className="p-col-12 p-lg-6">
              <TitledValue title="Telefone" value={company.phone} />
            </div>
            <div className="p-col-12">
              <TitledValue title="Observações" value={company.notes} />
            </div>
          </div>
        </>
      );
    }
    return (<EmptyState />);
  };
  return (
    <Sidebar header="Informações da empresa" visible={visible} onHide={onHide} position="right">
      {content()}
    </Sidebar>
  );
}

CompanyInfoSidebar.propTypes = {
  onHide: PropTypes.func.isRequired,
  company: PropTypes.shape().isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CompanyInfoSidebar;
