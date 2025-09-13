import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FormData {
  nome: string;
  email: string;
  assunto: string;
  organizacao: string;
  mensagem: string;
  newsletter: boolean;
}

const STORAGE_KEY = 'maria-contact-form-data';
const STORAGE_VERSION = '1.0';

interface StoredFormData extends FormData {
  version: string;
  savedAt: string;
}

const saveToLocalStorage = (data: FormData) => {
  if (typeof window === 'undefined') return;
  
  try {
    const dataToStore: StoredFormData = {
      ...data,
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.warn('Failed to save form data to localStorage:', error);
  }
};

const loadFromLocalStorage = (): Partial<FormData> | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsedData: StoredFormData = JSON.parse(stored);
    
    if (parsedData.version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    const savedDate = new Date(parsedData.savedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (savedDate < thirtyDaysAgo) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    // Return only form data (exclude metadata)
    const { version, savedAt, ...formData } = parsedData;
    return formData;
  } catch (error) {
    console.warn('Failed to load form data from localStorage:', error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const clearLocalStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

// Debounce utility
const useDebounce = (callback: Function, delay: number) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);
    
    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    assunto: '',
    organizacao: '',
    mensagem: '',
    newsletter: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDataRestored, setIsDataRestored] = useState(false);

  // Debounced save function
  const debouncedSave = useDebounce((data: FormData) => {
    saveToLocalStorage(data);
  }, 1000);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setFormData(prevData => ({
        ...prevData,
        ...savedData
      }));
      setIsDataRestored(true);
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (isDataRestored || Object.values(formData).some(value => value !== '' && value !== false)) {
      debouncedSave(formData);
    }
  }, [formData, debouncedSave, isDataRestored]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleClearSavedData = () => {
    clearLocalStorage();
    setFormData({
      nome: '',
      email: '',
      assunto: '',
      organizacao: '',
      mensagem: '',
      newsletter: false
    });
    setIsDataRestored(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'newsletter') {
          if (value) formDataToSend.append(key, 'on');
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        
        // Smart data clearing: preserve user profile info but clear sensitive data
        const preservedData = {
          nome: formData.nome,
          email: formData.email,
          organizacao: formData.organizacao,
          newsletter: formData.newsletter,
          assunto: '', // Clear previous subject
          mensagem: '' // Clear message content
        };
        
        setFormData(preservedData);
        saveToLocalStorage(preservedData);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Erro de conectividade. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Envie uma mensagem</h3>
        {isDataRestored && (
          <button
            onClick={handleClearSavedData}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200 flex items-center space-x-1"
            title="Limpar dados salvos"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span>Limpar dados</span>
          </button>
        )}
      </div>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="text-green-800 font-medium">Mensagem enviada com sucesso!</p>
          </div>
          <p className="text-green-700 text-sm mt-1">Entraremos em contato em até 48 horas.</p>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-red-800 font-medium">Erro ao enviar mensagem</p>
          </div>
          <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-gray-900 mb-2">
              Nome *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              value={formData.nome}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="seu@email.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="assunto" className="block text-sm font-semibold text-gray-900 mb-2">
            Assunto *
          </label>
          <select
            id="assunto"
            name="assunto"
            required
            value={formData.assunto}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Selecione um assunto</option>
            <option value="pauta">Sugestão de Pauta</option>
            <option value="entrevista">Pedido de Entrevista</option>
            <option value="colaboracao">Colaboração</option>
            <option value="imprensa">Assessoria de Imprensa</option>
            <option value="feedback">Feedback</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="organizacao" className="block text-sm font-semibold text-gray-900 mb-2">
            Organização/Veículo
          </label>
          <input
            type="text"
            id="organizacao"
            name="organizacao"
            value={formData.organizacao}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Nome da empresa, veículo ou organização"
          />
        </div>
        
        <div>
          <label htmlFor="mensagem" className="block text-sm font-semibold text-gray-900 mb-2">
            Mensagem *
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            required
            rows={6}
            value={formData.mensagem}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Descreva sua mensagem, pauta ou solicitação..."
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg",
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </div>
            ) : (
              'Enviar Mensagem'
            )}
          </button>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            * Campos obrigatórios. Sua mensagem será respondida em até 48 horas.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;