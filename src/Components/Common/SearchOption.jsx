import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from 'reactstrap';

//SimpleBar
import SimpleBar from "simplebar-react";
import KUPIICONS from '../../common/icons/icons';

//import images

const SearchOption = () => {

  // Navigation
  const navigate  = useNavigate();
  const [value, setValue] = useState("");
  
  const onChangeData = (value) => {
    setValue(value);
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // console.log("Entro aqui--->", value);
      navigate('/search-users/'+value);
      // onEnterPress();     // Ejecutar la función de búsqueda u otra acción
    }
  };

  const handleClickIcon = (e) => {
    e.preventDefault();
    // console.log("Entro aqui--->", value);
    navigate('/search-users/'+value);
  };

  return (
    <React.Fragment>
      <form className="app-search d-none d-md-block">
        <div className="position-relative">
          <Input 
            type="text" 
            className="form-control" 
            placeholder="Buscar..."
            id="search-options"
            value={value}
            onChange={e => onChangeData(e.target.value)}
            onKeyDown={handleKeyDown} // Captura la tecla Enter
          />
          
          <span className="mdi mdi-magnify search-widget-icon" onClick={handleClickIcon}>
            <KUPIICONS.Search height='20' width='20'/>
          </span>
            
          <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close" id="search-close-options">
          </span>
        </div>

      </form>
    </React.Fragment>
  );
};

export default SearchOption;