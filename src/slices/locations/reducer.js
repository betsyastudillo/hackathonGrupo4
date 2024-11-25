import { createSlice } from '@reduxjs/toolkit';

// 1. Función para obtener los datos desde Local Storage
const loadFromLocalStorage = () => {
  try {
    const storedLocations = localStorage.getItem('locations');
    return storedLocations ? JSON.parse(storedLocations) : [];
  } catch (error) {
    console.error('Error loading locations from localStorage', error);
    return [];
  }
};

// 2. Estado inicial cargado desde Local Storage si existe
const initialState = {
  locations: loadFromLocalStorage(),
  activeLocations: {},
};

// 3. Crear el slice con la lógica para persistir en Local Storage
export const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    // acciones que me modifican el objeto
    setLocations: (state, actions) => {
      state.locations = actions.payload;
      try {
        localStorage.setItem('locations', JSON.stringify(state.locations));
      } catch (error) {
        console.error('Error saving locations to localStorage', error);
      }
    },
    // Otras acciones que modifiquen el estado del slice pueden seguir el mismo patrón
    clearLocations: state => {
      state.locations = [];
      localStorage.removeItem('locations');
    },
    setActiveLocations: (state, actions) => {
      state.activeLocations = actions.payload;
      try {
        localStorage.setItem(
          'activeLocations',
          JSON.stringify(state.activeLocations)
        );
      } catch (error) {
        console.error('Error saving activeLocations to localStorage', error);
      }
    },
  },
});

// Setters
export const { setLocations, clearLocations, setActiveLocations } =
  locationsSlice.actions;

// Getter
export const selectLocations = state => state.locations;
export const selectActiveLocations = state => state.activeLocations;

// Exportar el reducer para integrarlo en el store
export default locationsSlice.reducer;
