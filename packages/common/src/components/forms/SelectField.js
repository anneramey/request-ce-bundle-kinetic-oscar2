import React from 'react';
import { StaticSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

const Input = props => <input {...props.inputProps} className="form-control" />;

const SelectionsContainer = ({ input }) => (
  <div className="kinetic-typeahead">{input}</div>
);

const Suggestion = ({ suggestion, active }) => (
  <div className={`suggestion ${active ? 'active' : ''}`}>
    <div className="large">{suggestion.get('label')}</div>
  </div>
);

const SuggestionsContainer = ({ open, children, containerProps }) => (
  <div {...containerProps} className={`suggestions ${open ? 'open' : ''}`}>
    {children}
  </div>
);

const components = {
  Input,
  SelectionsContainer,
  Status,
  SuggestionsContainer,
  Suggestion,
};

export const SelectField = props => {
  const {
    typeahead,
    allowNew,
    validateNew,
    alwaysRenderSuggestions,
    minSearchLength,
  } = props.renderAttributes.toJS();

  return (
    <FieldWrapper {...props}>
      {typeahead ? (
        <StaticSelect
          components={components}
          textMode
          id={props.id}
          value={props.value}
          options={props.options}
          search={props.search}
          allowNew={allowNew}
          validateNew={validateNew}
          alwaysRenderSuggestions={alwaysRenderSuggestions}
          minSearchLength={minSearchLength}
          onChange={props.onChange}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          placeholder={props.placeholder}
        />
      ) : (
        <select
          className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
          id={props.id}
          name={props.name}
          value={props.value}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
        >
          <option value="">{props.placeholder || ''}</option>
          {props.options.map((option, i) => (
            <option value={option.get('value')} key={i}>
              {option.get('label') ? option.get('label') : option.get('value')}
            </option>
          ))}
        </select>
      )}
    </FieldWrapper>
  );
};
