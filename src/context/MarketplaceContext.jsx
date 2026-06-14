import React, { createContext, useContext, useState } from 'react';
import { marketplaceModels, initialClassrooms, creatorModelsInitial } from '../data/mockData';

const MarketplaceContext = createContext(null);

export function MarketplaceProvider({ children }) {
  const [licensedModelIds, setLicensedModelIds] = useState([]);
  const [classrooms, setClassrooms] = useState(initialClassrooms);
  const [creatorModels, setCreatorModels] = useState(creatorModelsInitial);

  const licenseModel = (modelId) => {
    if (!licensedModelIds.includes(modelId)) {
      setLicensedModelIds(prev => [...prev, modelId]);
    }
  };

  const assignModelToClassroom = (classroomId, modelId) => {
    setClassrooms(prev =>
      prev.map(cls =>
        cls.id === classroomId
          ? { ...cls, assignedModelIds: cls.assignedModelIds.includes(modelId) ? cls.assignedModelIds : [...cls.assignedModelIds, modelId] }
          : cls
      )
    );
  };

  const addCreatorModel = (model) => {
    setCreatorModels(prev => [...prev, model]);
  };

  const getLicensedModels = () =>
    marketplaceModels.filter(m => licensedModelIds.includes(m.id));

  const getClassroomModels = (classroomId) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (!classroom) return [];
    return marketplaceModels.filter(m => classroom.assignedModelIds.includes(m.id));
  };

  const getClassroomByCode = (code) =>
    classrooms.find(c => c.code.toLowerCase() === code.toLowerCase());

  return (
    <MarketplaceContext.Provider value={{
      licensedModelIds,
      classrooms,
      creatorModels,
      licenseModel,
      assignModelToClassroom,
      addCreatorModel,
      getLicensedModels,
      getClassroomModels,
      getClassroomByCode,
      marketplaceModels
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  return useContext(MarketplaceContext);
}
