import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { InputMask } from 'primereact/inputmask';

function InputMaskAdapter({
  control, setValue, defaultValue, mask, name, rules, onComplete, className,
}) {
  const [state, setstate] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [setValue, defaultValue]);
  return (
    <Controller
      id={name}
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={({ onChange }) => (
        <InputMask
          value={state}
          name={name}
          onChange={(e) => {
            setstate(e.value);
            onChange(e.value.replace(/_/g, ''));
          }}
          onComplete={(e) => {
            setValue(name, e.value, {
              shouldDirty: true,
              shouldValidate: true,
            });
            onComplete(e);
          }}
          autoClear={false}
          type="text"
          mask={mask}
          className={className}

        />
      )}
    />
  );
}

InputMaskAdapter.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.any.isRequired,
  setValue: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
  mask: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.shape(),
  onComplete: PropTypes.func,
  className: PropTypes.string,
};

InputMaskAdapter.defaultProps = {
  rules: undefined,
  onComplete: () => {},
  className: '',
};

export default InputMaskAdapter;
