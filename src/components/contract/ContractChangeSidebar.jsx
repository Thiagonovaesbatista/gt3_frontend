import React, {
  useState, useEffect, useRef,
} from 'react';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useDataApi, useDropdownData } from '../../hooks';
import { putContract, postContract } from '../../services/Contract';
import { getCompanyQuery } from '../../services/Company';
import DropdownAdapter from '../form/DropdownAdapter';
import CalendarAdapter from '../form/CalendarAdapter';
import SidebarAdapter from '../form/SidebarAdapter';
import { getDocumentTypeQuery } from '../../services/DocumentType';
import { nextId } from '../../helpers';

function ContractChangeSidebar({
  visible, onCreate, onCancel, contract: initialContract, onEdit,
}) {
  const [contract, setContract] = useState({});
  const [companiesData, setCompanyDataApi] = useDropdownData();
  const [documentTypesData, setDocumentTypeDataApi] = useDropdownData();
  const [documentTypesRelation, setDocumentTypesRelation] = useState([]);
  const [selectedDocumentTypesRelation, setSelectedDocumentTypesRelation] = useState([]);
  const [{
    isSuccess, isLoading, isError, error,
  }, setDataApi, dataApi] = useDataApi();

  const messagesRef = useRef({});
  const editing = Object.keys(initialContract).length > 0;
  useEffect(() => {
    if (isLoading) {
      messagesRef.current.clear();
    }
  }, [messagesRef, isLoading]);

  // Is visible and is Success and dataApi.service (just to avoid some issues):
  // invoke callback functions
  useEffect(() => {
    if (visible && isSuccess && dataApi.service) {
      contract.companyId = contract.company.id;
      if (editing) {
        onEdit(contract);
      } else {
        onCreate(contract);
      }
      setContract({});
      setDataApi({});
    }
  }, [visible, isSuccess, onCreate, onEdit, contract, editing, dataApi, setDataApi]);

  useEffect(() => {
    if (editing) {
      setDocumentTypesRelation(initialContract.documentTypes.map((dt) => ({ ...dt, key: nextId('documentType') })));
    }
    return () => {
      setDocumentTypesRelation([]);
    };
  }, [editing, setDocumentTypesRelation, initialContract]);

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
          closable: false, sticky: true, severity: 'error', summary: 'Ocorreu algum erro ao criar/alterar',
        });
      }
    }
  }, [messagesRef, isError, error]);
  const {
    control,
    handleSubmit,
    formState,
    setValue,
    trigger,
  } = useForm({ mode: 'all' });

  // Is Visible and is in editing Mode: Trigger validations
  useEffect(() => {
    if (visible && editing) {
      trigger();
    }
  }, [trigger, editing, visible]);
  const onSubmit = (data) => {
    const c = { ...data, documentTypes: documentTypesRelation, companyId: data.company.id };
    setContract(c);
    let service;
    let input;
    if (editing) {
      service = putContract;
      input = [initialContract.id, c];
    } else {
      service = postContract;
      input = c;
    }
    setDataApi({
      service,
      input,
    });
  };

  useEffect(() => {
    if (companiesData.error) {
      messagesRef.current.replace({
        closable: false, sticky: true, severity: 'error', summary: companiesData.error,
      });
    }
  }, [companiesData.error, messagesRef]);

  useEffect(() => {
    if (documentTypesData.error) {
      messagesRef.current.replace({
        closable: false, sticky: true, severity: 'error', summary: documentTypesData.error,
      });
    }
  }, [documentTypesData.error, messagesRef]);

  useEffect(() => {
    if (companiesData.data.length === 0 && visible) {
      setCompanyDataApi(
        { service: getCompanyQuery, input: {} },
      );
    }
  }, [companiesData.data.length, setCompanyDataApi, visible]);

  useEffect(() => {
    if (documentTypesData.data.length === 0 && visible) {
      setDocumentTypeDataApi(
        { service: getDocumentTypeQuery, input: {} },
      );
    }
  }, [documentTypesData.data.length, setDocumentTypeDataApi, visible]);

  const originalRows = {};

  const onRowEditCancel = (event) => {
    const dts = [...documentTypesRelation];
    dts[event.index] = originalRows[event.index];
    delete originalRows[event.index];
    setDocumentTypesRelation([...dts]);
  };

  const onRowEditInit = (event) => {
    originalRows[event.index] = { ...documentTypesRelation[event.index] };
  };

  const onRowEditSave = (event) => {
    const newValues = [...documentTypesRelation];
    const dt = newValues[event.index];
    dt.documentTypeId = event.data.id;
    dt.requiredAttachment = event.data.requiredAttachment;
    setDocumentTypesRelation([...newValues]);
  };

  const documentTypeEditor = ({ rowData, rowIndex }) => (
    <Dropdown
      optionLabel="description"
      value={rowData.documentType}
      options={documentTypesData.data}
      dataKey="id"
      onChange={(e) => {
        const values = [...documentTypesRelation];
        const dtr = { ...values[rowIndex], documentType: e.value, ...e.value };
        values[rowIndex] = dtr;
        setDocumentTypesRelation([...values]);
      }}
    />
  );

  const requiredAttachmentEditor = ({ rowData, rowIndex }) => (
    <div className="p-field-checkbox">
      <Checkbox
        inputId={`binary-${rowIndex}`}
        checked={rowData.requiredAttachment}
        onChange={(e) => {
          const values = [...documentTypesRelation];
          const dtr = values[rowIndex];
          dtr.requiredAttachment = e.checked;
          setDocumentTypesRelation([...values]);
        }}
      />
      <label htmlFor="binary">{rowData.requiredAttachment ? 'Sim' : 'Não'}</label>
    </div>

  );
  const requiredAttachmentBody = ({ requiredAttachment }) => (requiredAttachment ? 'Sim' : 'Não');

  return (
    <SidebarAdapter
      visible={visible}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      isValid={formState.isValid}
      isLoading={isLoading}
      messagesRef={messagesRef}
      title={`${editing ? 'Alterar' : 'Cadastrar'} contrato`}
    >
      <>
        <div className="p-field p-col-12 p-pb-5">
          <span className="p-float-label">
            <Controller
              as={InputText}
              id="number"
              type="text"
              defaultValue={initialContract.number || ''}
              control={control}
              rules={{ required: 'Numero de contrato é obrigatório', maxLength: { message: 'Máximo de 15 caracteres', value: 15 } }}
              name="number"
              className={`${formState.errors.number && 'p-invalid'} ${initialContract.number && 'p-filled'}`}
            />
            <label htmlFor="number">Numero de contrato</label>
          </span>
          <small id="number-message" className="p-invalid">{formState.errors.number && formState.errors.number.message}</small>
        </div>
        <div className="p-field p-col-12 p-pb-5">
          <span className="p-float-label">
            <DropdownAdapter
              control={control}
              defaultValue={initialContract.company || ''}
              name="company"
              optionLabel="name"
              setValue={setValue}
              options={companiesData.data}
              rules={{ required: 'Empresa é obrigatório' }}
              className={`${formState.errors.company && 'p-invalid'} ${initialContract.company && 'p-filled'}`}
            />
            <label htmlFor="company">Empresa</label>
          </span>
          <small id="company-message" className="p-invalid">{formState.errors.company && formState.errors.company.message}</small>
        </div>
        <div className="p-field p-col-12 p-pb-5">
          <span className="p-float-label">
            <Controller
              as={InputText}
              id="email"
              type="email"
              defaultValue={initialContract.email || ''}
              control={control}
              rules={{ required: 'Email do responsavel é obrigatório' }}
              name="email"
              className={`${formState.errors.email && 'p-invalid'} ${initialContract.email && 'p-filled'}`}
            />
            <label htmlFor="email">Email responsavel</label>
          </span>
          <small id="email-message" className="p-invalid">{formState.errors.email && formState.errors.email.message}</small>
        </div>
        <div className="p-field p-col-12 p-pb-5">
          <span className="p-float-label">
            <Controller
              as={InputText}
              id="user"
              type="text"
              defaultValue={initialContract.user || ''}
              control={control}
              rules={{ required: 'Usuário da plataforma é obrigatório' }}
              name="user"
              className={`${formState.errors.user && 'p-invalid'} ${initialContract.user && 'p-filled'}`}
            />
            <label htmlFor="user">Usuário da plataforma</label>
          </span>
          <small id="user-message" className="p-invalid">{formState.errors.user && formState.errors.user.message}</small>
        </div>
        <div className="p-field p-col-12 p-pb-5">
          <span className="p-float-label">
            <CalendarAdapter
              control={control}
              defaultValue={initialContract.start || ''}
              name="start"
              setValue={setValue}
              rules={{ required: 'Data inicio é obrigatório' }}
              className={`${formState.errors.start && 'p-invalid'} ${initialContract.start && 'p-filled'}`}
            />
            <label htmlFor="start">Data inicio</label>
          </span>
          <small id="start-message" className="p-invalid">{formState.errors.start && formState.errors.start.message}</small>
        </div>
        <div className="p-field p-col-12">
          <span className="p-float-label">
            <CalendarAdapter
              control={control}
              defaultValue={initialContract.end || ''}
              name="end"
              setValue={setValue}
              rules={{ required: 'Data inicio é obrigatório' }}
              className={`${formState.errors.end && 'p-invalid'} ${initialContract.end && 'p-filled'}`}
            />
            <label htmlFor="end">Data fim</label>
          </span>
          <small id="end-message" className="p-invalid">{formState.errors.end && formState.errors.end.message}</small>
        </div>
        <div className="p-field p-col-12">
          <h3>Documentos</h3>
          <div className="p-grid">
            <div
              className="p-col-12 p-md-6 p-p-1"
            >
              <Button
                type="button"
                className="p-button p-button-outlined p-button-primary"
                onClick={(e) => {
                  setDocumentTypesRelation([...documentTypesRelation, {
                    description: '',
                    requiredAttachment: false,
                    documentType: null,
                    key: nextId('documentTypes'),
                  }]);
                  e.preventDefault();
                  e.stopPropagation();
                }}
                label="Adicionar"
              />
            </div>
            <div
              className="p-col-12 p-md-6 p-p-1"
            >
              <Button
                type="button"
                className="p-button p-button-outlined p-button-danger"
                disabled={selectedDocumentTypesRelation.length === 0}
                onClick={(e) => {
                  const newValues = [...documentTypesRelation];
                  selectedDocumentTypesRelation.forEach((selected) => {
                    const i = newValues.findIndex((nv) => selected === nv);
                    if (i >= 0) {
                      newValues.splice(i, 1);
                    }
                  });
                  setDocumentTypesRelation([...newValues]);
                  setSelectedDocumentTypesRelation([]);
                  e.preventDefault();
                  e.stopPropagation();
                }}
                label="Deletar selecionados"
              />
            </div>
          </div>
          <DataTable selection={selectedDocumentTypesRelation} onSelectionChange={(e) => setSelectedDocumentTypesRelation(e.value)} editMode="row" value={documentTypesRelation} dataKey="key" onRowEditInit={onRowEditInit} onRowEditCancel={onRowEditCancel} onRowEditSave={onRowEditSave}>
            <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
            <Column
              field="description"
              header="Descrição do documento"
              editor={documentTypeEditor}
            />
            <Column
              header="Anexo obrigatório"
              editor={requiredAttachmentEditor}
              body={requiredAttachmentBody}
            />
            <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'right' }} />
          </DataTable>
        </div>
      </>
    </SidebarAdapter>
  );
}

ContractChangeSidebar.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  contract: PropTypes.shape(),
  visible: PropTypes.bool.isRequired,
};

ContractChangeSidebar.defaultProps = {
  contract: null,
};

export default ContractChangeSidebar;
