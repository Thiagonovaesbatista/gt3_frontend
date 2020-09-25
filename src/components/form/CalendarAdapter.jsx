import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';

function CalendarAdapter({
  control, setValue, defaultValue, name, rules, className,
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
        <Calendar
          value={state}
          name={name}
          onChange={(e) => {
            setState(e.value);
            setValue(name, e.value, {
              shouldDirty: true,
              shouldValidate: true,
            });
            onChange(e.value);
          }}
          className={className}
        />
      )}
    />
  );
}

CalendarAdapter.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.any.isRequired,
  setValue: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]).isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.shape(),
  className: PropTypes.string,
};

CalendarAdapter.defaultProps = {
  rules: undefined,
  className: '',
};

export default CalendarAdapter;
