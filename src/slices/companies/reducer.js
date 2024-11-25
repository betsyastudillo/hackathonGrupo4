import { createSlice } from '@reduxjs/toolkit';

// 1. Función para obtener los datos desde Local Storage
const loadFromLocalStorage = () => {
  try {
    const storedCompanies = localStorage.getItem('companies');
    return storedCompanies ? JSON.parse(storedCompanies) : [];
  } catch (error) {
    console.error('Error loading companies from localStorage', error);
    return [];
  }
};

// 2. Estado inicial cargado desde Local Storage si existe
const initialState = {
  companies: loadFromLocalStorage(),
  detailsCompany: {},
};

// 3. Crear el slice con la lógica para persistir en Local Storage
export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    // acciones que me modifican el objeto
    setCompanies: (state, actions) => {
      // console.log("El actions es:--->", actions.payload);
      state.companies = actions.payload;
      try {
        localStorage.setItem('companies', JSON.stringify(state.companies));
      } catch (error) {
        console.error('Error saving companies to localStorage', error);
      }
    },
    // Otras acciones que modifiquen el estado del slice pueden seguir el mismo patrón
    clearCompanies: state => {
      state.companies = [];
      localStorage.removeItem('companies');
    },
    detailsCompanySuccess: (state, actions) => {
      state.detailsCompany = actions.payload;
    },
  },
});

// Setters
export const { setCompanies, clearCompanies, detailsCompanySuccess } =
  companiesSlice.actions;

// Getter
export const selectCompanies = state => state.companies;

// Exportar el reducer para integrarlo en el store
export default companiesSlice.reducer;
