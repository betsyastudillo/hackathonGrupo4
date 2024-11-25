import { createSlice } from '@reduxjs/toolkit';

// 1. Función para obtener los datos desde Local Storage
const loadFromLocalStorage = () => {
  try {
    const storedMenus = localStorage.getItem('menus');
    return storedMenus ? JSON.parse(storedMenus) : [];
  } catch (error) {
    console.error('Error loading menus from localStorage', error);
    return [];
  }
};



// 2. Estado inicial cargado desde Local Storage si existe
const initialState = {
  menus: loadFromLocalStorage(),
  activeMenu: {},
}

// 3. Crear el slice con la lógica para persistir en Local Storage
export const menusSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: { 
    // acciones que me modifican el objeto
    setMenus: (state, actions) => {
      state.menus = actions.payload;
      try {
        localStorage.setItem('menus', JSON.stringify(state.menus));
      } catch (error) {
        console.error('Error saving menus to localStorage', error);
      }
    },
    // Otras acciones que modifiquen el estado del slice pueden seguir el mismo patrón
    clearMenus: (state) => {
      state.menus = [];
      localStorage.removeItem('menus');
    },
    setActiveMenu:  (state, actions) => {
      state.activeMenu = actions.payload;
      try {
        localStorage.setItem('activeMenu', JSON.stringify(state.activeMenu));
      } catch (error) {
        console.error('Error saving activeMenu to localStorage', error);
      }
    },
  },
});

// Setters
export const { setMenus, clearMenus, setActiveMenu  } = menusSlice.actions;

// Getter
export const selectMenus      = (state ) => state.menus;
export const selectActiveMenu = (state ) => state.activeMenu;


// Exportar el reducer para integrarlo en el store
export default menusSlice.reducer;