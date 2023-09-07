import React, { createContext, useContext, useState } from "react";

const EditFormContext = createContext();

export function useEditForm() {
  return useContext(EditFormContext);
}

export function EditFormProvider({ children }) {
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <EditFormContext.Provider value={{ editingProduct, setEditingProduct }}>
      {children}
    </EditFormContext.Provider>
  );
}
