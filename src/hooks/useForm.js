import { useState } from 'react';

export const useForm = initialForm => {
  const [formState, setFormState] = useState(initialForm);

  const onInputChange = event => {
    if (event.target) {
      const { name, value } = event.target;
      setFormState({
        ...formState,
        [name]: value,
      });
    } else if (Array.isArray(event)) {
      const formattedDate = event[0].toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      setFormState({
        ...formState,
        fecha: formattedDate,
      });
    }
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  return { ...formState, formState, onInputChange, onResetForm };
};
