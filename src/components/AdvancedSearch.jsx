import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

export const AdvancedSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    norm: '',
    minRating: 0
  });
  const { trackEvent } = useAnalytics();

  const handleSearch = () => {
    trackEvent('advanced_search', filters);
    onSearch({ ...filters, query });
  };

  return (
    <div className="search-panel bg-gray-800 p-4 rounded-lg">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Termo de busca..."
      />
      
      <select 
        value={filters.category}
        onChange={(e) => setFilters({...filters, category: e.target.value})}
      >
        <option value="">Todas categorias</option>
        <option value="solos">Solos</option>
        <option value="concreto">Concreto</option>
      </select>

      <input 
        type="number" 
        min="0" 
        max="5" 
        value={filters.minRating}
        onChange={(e) => setFilters({...filters, minRating: e.target.value})}
        placeholder="Nota mínima"
      />

      <button onClick={handleSearch}>
        Buscar Avançada
      </button>
    </div>
  );
};