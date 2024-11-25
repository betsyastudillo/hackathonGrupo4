import { createSlice } from '@reduxjs/toolkit';

// 1. Función para obtener los datos desde Local Storage
const loadFromLocalStorage = () => {
  try {
    const storedProfiles = localStorage.getItem('profiles');
    return storedProfiles ? JSON.parse(storedProfiles) : [];
  } catch (error) {
    console.error('Error loading profiles from localStorage', error);
    return [];
  }
};


// 2. Estado inicial cargado desde Local Storage si existe
const initialState = {
  profiles: loadFromLocalStorage(),
  activeProfile: {},
}

// 3. Crear el slice con la lógica para persistir en Local Storage
export const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: { 
    // acciones que me modifican el objeto
    setProfiles: (state, actions) => {
      state.profiles = actions.payload;
      try {
        localStorage.setItem('profiles', JSON.stringify(state.profiles));
      } catch (error) {
        console.error('Error saving profiles to localStorage', error);
      }
    },
    // Otras acciones que modifiquen el estado del slice pueden seguir el mismo patrón
    clearProfiles: (state) => {
      state.profiles = [];
      localStorage.removeItem('profiles');
    },
    setActiveProfile:  (state, actions) => {
      state.activeProfile = actions.payload;
      try {
        localStorage.setItem('activeProfile', JSON.stringify(state.activeProfile));
      } catch (error) {
        console.error('Error saving activeProfile to localStorage', error);
      }
    },
  },
});

// Setters
export const { setProfiles, clearProfiles, setActiveProfile  } = profilesSlice.actions;

// Getter
export const selectProfiles      = (state ) => state.profiles;
export const selectActiveProfile = (state ) => state.activeProfile;


// Exportar el reducer para integrarlo en el store
export default profilesSlice.reducer;