import { createSlice } from '@reduxjs/toolkit';

// 1. Función para obtener los datos desde Local Storage
const loadFromLocalStorage = () => {
  try {
    const storedParameterizations = localStorage.getItem('parameterizations');
    return storedParameterizations ? JSON.parse(storedParameterizations) : [];
  } catch (error) {
    console.error('Error loading parameterizations from localStorage', error);
    return [];
  }
};


// 2. Estado inicial cargado desde Local Storage si existe
const initialState = {
  parameterizations: loadFromLocalStorage(),
  activeParameterizations: {},
}

// 3. Crear el slice con la lógica para persistir en Local Storage
export const parameterizationsSlice = createSlice({
  name: 'parameterizations',
  initialState,
  reducers: { 
    // acciones que me modifican el objeto
    setParameterizations: (state, actions) => {
      state.parameterizations = actions.payload;
      try {
        localStorage.setItem('parameterizations', JSON.stringify(state.parameterizations));
      } catch (error) {
        console.error('Error saving parameterizations to localStorage', error);
      }
    },
    // Otras acciones que modifiquen el estado del slice pueden seguir el mismo patrón
    clearParameterizations: (state) => {
      state.parameterizations = [];
      localStorage.removeItem('parameterizations');
    },
    setActiveParameterizations:  (state, actions) => {
      state.activeParameterizations = actions.payload;
      try {
        localStorage.setItem('activeParameterizations', JSON.stringify(state.activeParameterizations));
      } catch (error) {
        console.error('Error saving activeParameterizations to localStorage', error);
      }
    },
  },
});

// Setters
export const { setParameterizations, clearParameterizations, setActiveParameterizations  } = parameterizationsSlice.actions;

// Getter
export const selectParameterizations      = (state ) => state.parameterizations;
export const selectActiveParameterizations = (state ) => state.activeParameterizations;


// Exportar el reducer para integrarlo en el store
export default parameterizationsSlice.reducer;