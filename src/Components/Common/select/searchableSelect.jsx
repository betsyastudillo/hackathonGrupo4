import Select from 'react-select';

const SearchableSelect = ({ title, options, placeholder, onChange, selectedValue, marginTop, readOnly = false }) => {
  const mtClass = (typeof marginTop === 'number') ? `mt-${marginTop}` : 'mt-4';

  // Manejador de cambio
  const handleSelectChange = (selectedOption) => {
    onChange(selectedOption ? selectedOption.value : 0); // Extraer valor o devolver 0
  };
  
  return (
    <div className='px-3'>
      <h6 className={`${mtClass} px-lg-1`}>{title}</h6>
      
      <Select
        value={selectedValue !== -1 ? options.find(option => option.value === selectedValue) : null} // Mostrar placeholder si value es 0
        onChange={handleSelectChange}
        options={options}
        placeholder={placeholder || 'Seleccione un valor...'}
        isSearchable={!readOnly}
        isDisabled={readOnly}
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default SearchableSelect;

