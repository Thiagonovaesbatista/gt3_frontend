import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';

function DropdownAdapter({
  control, setValue, defaultValue, name, rules,
  options, className, optionLabel, onMouseDown, dataKey,
}) {
  const [state, setState] = useState(defaultValue);
  useEffect(() => {
    setValue(name, defaultValue);
  }, [setValue, defaultValue, name]);
  return (
    <Controller
      id={name}
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={({ onChange }) => (
        <Dropdown
          optionLabel={optionLabel}
          value={state}
          name={name}
          options={options}
          onMouseDown={onMouseDown}
          dataKey={dataKey}
          onChange={(e) => {
            setState(e.value);
            setValue(name, e.value, {
              shouldDirty: true,
              shouldValidate: true,
            });
            onChange(e.value);
          }}
          type="text"
          className={className}
        />
      )}
    />
  );
}

DropdownAdapter.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.any.isRequired,
  setValue: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  optionLabel: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.shape(),
  className: PropTypes.string,
  dataKey: PropTypes.string,
};

DropdownAdapter.defaultProps = {
  rules: undefined,
  className: '',
  onMouseDown: () => {},
  dataKey: 'id',
};

export default DropdownAdapter;
