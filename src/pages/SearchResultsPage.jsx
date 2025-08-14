import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResultsPage = ({ results, isLoading }) => {
  const { state } = useLocation();
  const query = state?.query || '';

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-6">
        Resultados para: "{query}"
      </h1>
      
      {isLoading ? (
        <div className="text-center py-10">
          <LoadingSpinner />
        </div>
      ) : results.length === 0 ? (
        <p className="text-gray-400 text-center">Nenhum resultado encontrado</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((item) => (
            <div key={`${item.type}-${item.id}`} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-gray-400 mt-2">
                {item.type === 'ensaio' ? 'Ensaio' : 'Artigo'} • {item.date}
              </p>
              <p className="text-gray-300 mt-3">
                {item.description || item.intro?.substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;