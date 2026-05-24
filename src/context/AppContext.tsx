import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { InputParams, PanResult, AnalysisResult, ItemType } from '@/types';
import { calculatePan } from '@/utils/panCalculator';

interface AppContextType {
  inputParams: InputParams;
  panResult: PanResult | null;
  analysisResult: AnalysisResult | null;
  showChangSheng: boolean;
  showDiPanBaShen: boolean;
  setInputParams: (params: InputParams) => void;
  setShowChangSheng: (show: boolean) => void;
  setShowDiPanBaShen: (show: boolean) => void;
  handleSubmit: () => void;
  handlePrevHour: () => void;
  handleNextHour: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inputParams, setInputParams] = useState<InputParams>({
    content: '',
    type: '财运' as ItemType,
    time: new Date(),
  });
  const [panResult, setPanResult] = useState<PanResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showChangSheng, setShowChangSheng] = useState(false);
  const [showDiPanBaShen, setShowDiPanBaShen] = useState(false);

  const handleSubmit = useCallback(() => {
    const result = calculatePan(inputParams);
    setPanResult(result);
    setAnalysisResult(null);
  }, [inputParams]);

  const handlePrevHour = useCallback(() => {
    if (!panResult) return;
    const newTime = new Date(inputParams.time.getTime() - 60 * 60 * 1000);
    const newParams = { ...inputParams, time: newTime };
    setInputParams(newParams);
    const result = calculatePan(newParams);
    setPanResult(result);
    setAnalysisResult(null);
  }, [inputParams, panResult]);

  const handleNextHour = useCallback(() => {
    if (!panResult) return;
    const newTime = new Date(inputParams.time.getTime() + 60 * 60 * 1000);
    const newParams = { ...inputParams, time: newTime };
    setInputParams(newParams);
    const result = calculatePan(newParams);
    setPanResult(result);
    setAnalysisResult(null);
  }, [inputParams, panResult]);

  return (
    <AppContext.Provider
      value={{
        inputParams,
        panResult,
        analysisResult,
        showChangSheng,
        showDiPanBaShen,
        setInputParams,
        setShowChangSheng,
        setShowDiPanBaShen,
        handleSubmit,
        handlePrevHour,
        handleNextHour,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
