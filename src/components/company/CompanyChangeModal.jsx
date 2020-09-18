import React, {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import { InputTextarea } from 'primereact/inputtextarea';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { useDataApi, useCEPApi } from '../../hooks';
import { postCompany, putCompany } from '../../services/Company';
import InputMaskAdapter from '../form/InputMaskAdapter';

function setAddressValue(value, setValue, key) {
  if (value && value !== '') {
    setValue(key, value);
  } else {
    setValue(key, '');
  }
}

function setAddressValues(cepData, setValue) {
  setAddressValue(cepData.uf, setValue, 'uf');
  setAddressValue(cepData.localidade, setValue, 'city');
  setAddressValue(cepData.bairro, setValue, 'district');
  setAddressValue(cepData.logradouro, setValue, 'address');
  setAddressValue(cepData.complemento, setValue, 'addressComplement');
}

function CompanyChangeModal({
  visible, onCreate, onCancel, company: initialCompany, onEdit,
}) {
  const [company, setCompany] = useState({});
  const [{
    isSuccess, isLoading, isError, error,
  }, setDataApi, dataApi] = useDataApi();
  const [{ data: cepData, isLoading: isCepLoading, isError: isCepError }, searchCEP] = useCEPApi();
  const messagesRef = useRef({});
  const editing = Object.keys(initialCompany).length > 0;
  useEffect(() => {
    if (isLoading) {
      messagesRef.current.clear();
    }
  }, [messagesRef, isLoading]);

  // Is visible and is Success and dataApi.service (just to avoid some issues):
  // invoke callback functions
  useEffect(() => {
    if (visible && isSuccess && dataApi.service) {
      if (editing) {
        onEdit(company);
      } else {
        onCreate(company);
      }
      setCompany({});
      setDataApi({});
    }
  }, [visible, isSuccess, onCreate, onEdit, company, editing, dataApi, setDataApi]);

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
    setValue,
    formState,
    trigger,
  } = useForm({ mode: 'all' });
  useEffect(() => {
    if (!isCepLoading && !isCepError) {
      setAddressValues(cepData, setValue);
    }
  }, [cepData, isCepError, isCepLoading, setValue]);

  // Is Visible and is in editing Mode: Trigger validations
  useEffect(() => {
    if (visible && editing) {
      trigger();
    }
  }, [trigger, editing, visible]);
  const onSubmit = (data) => {
    setCompany(data);
    let service;
    let input;
    if (editing) {
      service = putCompany;
      input = [initialCompany.id, { ...data }];
    } else {
      service = postCompany;
      input = { ...data };
    }
    setDataApi({
      service,
      input,
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
        form="changeCompanyForm"
      />
    </>
  );

  return (
    <Dialog header={`${editing ? 'Alterar' : 'Cadastrar'} empresa`} visible={visible} onHide={onCancel} footer={footer}>
      <form onSubmit={handleSubmit(onSubmit)} id="changeCompanyForm">
        <div className="p-fluid p-formgrid p-grid p-p-3">
          <div className="p-field p-col-12 p-md-6 p-pb-5">
            <span className="p-float-label">
              <InputMaskAdapter
                control={control}
                defaultValue={initialCompany.cnpj || ''}
                mask="99.999.999/9999-99"
                name="cnpj"
                setValue={setValue}
                rules={{ required: 'CNPJ é obrigatório', minLength: { value: 18, message: 'CNPJ inválido' } }}
                className={`${formState.errors.cnpj && 'p-invalid'} ${initialCompany.cnpj && 'p-filled'}`}
              />
              <label htmlFor="cnpj">CNPJ</label>
            </span>
            <small id="cnpj-message" className="p-invalid">{formState.errors.cnpj && formState.errors.cnpj.message}</small>
          </div>
          <div className="p-field p-col-12 p-md-6 p-pb-5">
            <span className="p-float-label">
              <Controller
                as={InputText}
                id="name"
                type="text"
                defaultValue={initialCompany.name || ''}
                control={control}
                rules={{ required: 'Razão social é obrigatório' }}
                name="name"
                className={`${formState.errors.name && 'p-invalid'} ${initialCompany.name && 'p-filled'}`}
              />
              <label htmlFor="name">Razão social</label>
            </span>
            <small id="name-message" className="p-invalid">{formState.errors.name && formState.errors.name.message}</small>
          </div>
          <div className="p-field p-col-12 p-md-6 p-pb-5">
            <span className="p-float-label">
              <InputMaskAdapter
                control={control}
                defaultValue={initialCompany.cep || ''}
                mask="99999-999"
                name="cep"
                setValue={setValue}
                rules={{ required: 'CEP é obrigatório', minLength: { value: 9, message: 'CEP inválido' } }}
                onComplete={(e) => searchCEP(e.value)}
                className={`${formState.errors.cep && 'p-invalid'} ${initialCompany.cep && 'p-filled'}`}
              />
              <label htmlFor="cep">CEP</label>
            </span>
            <small id="cep-message" className="p-invalid">{formState.errors.cep && formState.errors.cep.message}</small>
          </div>
          <div className="p-field p-col-12 p-md-6 p-pb-5">
            <div className="p-inputgroup">
              <span className="p-float-label">
                <Controller
                  as={InputText}
                  id="uf"
                  type="text"
                  defaultValue={initialCompany.uf || ''}
                  keyfilter={/\D/g}
                  control={control}
                  maxLength="2"
                  rules={{ required: 'UF é obrigatório', minLength: { value: 2, message: 'UF inválido' }, maxLength: { value: 2, message: 'UF inválido' } }}
                  name="uf"
                  className={`${formState.errors.uf && 'p-invalid'} ${initialCompany.uf && 'p-filled'}`}
                />
                <label htmlFor="uf">UF</label>
              </span>
              <span className="p-float-label">
                <Controller
                  as={InputText}
                  id="city"
                  type="text"
                  defaultValue={initialCompany.city || ''}
                  control={control}
                  rules={{ required: 'Cidade é obrigatório' }}
                  name="city"
                  className={`${formState.errors.city && 'p-invalid'} ${initialCompany.city && 'p-filled'}`}
                />
                <label htmlFor="city">Cidade</label>
              </span>
            </div>
            <small id="city-uf-message" className="p-invalid">{(formState.errors.city || formState.errors.uf) && 'UF e Cidade são obrigatórios'}</small>
          </div>
          <div className="p-field p-col-12 p-md-6 p-pb-5">
            <span className="p-float-label">
              <Controller
                as={InputText}
                id="district"
                type="text"
                defaultValue={initialCompany.district || ''}
                control={control}
                rules={{ required: 'Bairro é obrigatório' }}
                name="district"
                className={`${formState.errors.district && 'p-invalid'} ${initialCompany.district && 'p-filled'}`}
              />
              <label htmlFor="district">Bairro</label>
            </span>
            <small id="district-message" className="p-invalid">{formState.errors.district && formState.errors.district.message}</small>
          </div>
          <div className="p-field p-col-12 p-md-6 p-pb-5">
            <span className="p-float-label">
              <Controller
                as={InputText}
                id="address"
                type="text"
                defaultValue={initialCompany.address || ''}
                control={control}
                rules={{ required: 'Endereço é obrigatório' }}
                name="address"
                className={`${formState.errors.address && 'p-invalid'} ${initialCompany.address && 'p-filled'}`}
              />
              <label htmlFor="address">Endereço</label>
            </span>
            <small id="address-message" className="p-invalid">{formState.errors.address && formState.errors.address.message}</small>
          </div>
          <div className="p-field p-col-12 p-md-6 p-pb-5">
            <span className="p-float-label">
              <Controller
                as={InputText}
                id="addressComplement"
                type="text"
                defaultValue={initialCompany.addressComplement || ''}
                control={control}
                name="addressComplement"
                className={`${formState.errors.addressComplement && 'p-invalid'} ${initialCompany.addressComplement && 'p-filled'}`}
              />
              <label htmlFor="addressComplement">Complemento</label>
            </span>
            <small id="addressComplement-message" className="p-invalid">{formState.errors.addressComplement && formState.errors.addressComplement.message}</small>
          </div>
          <div className="p-field p-col-12 p-md-6 p-pb-5">
            <span className="p-float-label">
              <InputMaskAdapter
                control={control}
                defaultValue={initialCompany.phone || ''}
                mask="+99 (99) 99999999?9"
                name="phone"
                setValue={setValue}
                rules={{ required: 'Telefone é obrigatório', minLength: { value: 17, message: 'Telefone inválido' } }}
                className={`${formState.errors.phone && 'p-invalid'} ${initialCompany.phone && 'p-filled'}`}
              />
              <label htmlFor="phone">Telefone</label>
            </span>
            <small id="phone-message" className="p-invalid">{formState.errors.phone && formState.errors.phone.message}</small>
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="notes">Observações</label>
            <Controller
              as={InputTextarea}
              id="notes"
              type="text"
              defaultValue={initialCompany.notes || ''}
              control={control}
              name="notes"
              rows={2}
              autoResize
              className={`${formState.errors.notes && 'p-invalid'} ${initialCompany.notes && 'p-filled'}`}
            />
            <small id="notes-message" className="p-invalid">{formState.errors.notes && formState.errors.notes.message}</small>
          </div>
        </div>
        <Messages ref={messagesRef} />
      </form>
    </Dialog>
  );
}

CompanyChangeModal.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  company: PropTypes.shape(),
  visible: PropTypes.bool.isRequired,
};

CompanyChangeModal.defaultProps = {
  company: null,
};

export default CompanyChangeModal;
