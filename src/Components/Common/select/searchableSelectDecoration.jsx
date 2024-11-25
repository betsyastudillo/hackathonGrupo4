import PropTypes from 'prop-types';
import Select from 'react-select';

const SearchableSelectDecoration = ({ title, options, placeholder, onChange, selectedValue, marginTop }) => {
  const mtClass = typeof marginTop === 'number' ? `mt-${marginTop}` : 'mt-4';

  // Custom styles for react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: 0,
      border: 'none',
      borderBottom: '1px solid #690BC8',  // Custom bottom border
      boxShadow: 'none',  // Removes the focus outline box-shadow
    }),
    placeholder: (base) => ({
      ...base,
      color: '#aaa',  // Placeholder text color
    }),
    singleValue: (base) => ({
      ...base,
      color: '#000',  // Selected option text color
    }),
    indicatorSeparator: () => ({
      display: 'none',  // Remove the indicator separator
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#690BC8',  // Dropdown arrow color
      '&:hover': {
        color: '#690BC8',  // Hover color for the dropdown arrow
      },
    }),
  };

  // Manejador de cambio
  const handleSelectChange = (selectedOption) => {
    onChange(selectedOption ? selectedOption.value : 0); // Extraer valor o devolver 0
  };

  return (
    <div>
      <h6 className={`${mtClass} px-lg-1 fw-bold`}>{title}</h6>

      <Select
        styles={customStyles}  // Apply the custom styles here
        value={selectedValue !== 0 ? options.find(option => option.value === selectedValue) : null} // Mostrar placeholder si value es 0
        onChange={handleSelectChange}
        options={options}
        placeholder={placeholder || 'Seleccione uno...'}
        isSearchable={true}
        classNamePrefix="react-select"
      />
    </div>
  );
};

// Definir los tipos de los props
SearchableSelectDecoration.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginTop: PropTypes.number,
};

// Valores por defecto de los props
SearchableSelectDecoration.defaultProps = {
  placeholder: 'Seleccione uno...',
  selectedValue: 0,
  marginTop: 4,
};

export default SearchableSelectDecoration;


