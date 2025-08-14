import React, { useEffect, useRef, useState } from 'react';

// Componente auxiliar para a animação de revelação ao rolar
const RevealOnScroll = ({ children }) => {
    const [revealed, setRevealed] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className={`reveal-on-scroll ${revealed ? 'revealed' : ''}`}>
            {children}
        </div>
    );
};

/**
 * Componente da Página de Categorias de Ensaios.
 * Lista todas as categorias e ensaios associados.
 * Os dados são passados via props do App.js.
 */
const EnsaiosCategoriesPage = ({ navigate, categories, ensaios, isLoadingCategories, isLoadingEnsaios }) => {
    return (
        <main className="container mx-auto py-8 px-4 min-h-screen">
            <RevealOnScroll>
                <h1 className="text-4xl font-bold text-white mb-10 text-center font-poppins">Todas as Categorias de Ensaios</h1>
            </RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoadingCategories || isLoadingEnsaios ? (
                    // Esqueletos para carregamento enquanto os dados são buscados
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-6 shadow-md animate-pulse">
                            <div className="h-8 bg-gray-700 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                            <div className="h-24 bg-gray-700 rounded"></div>
                        </div>
                    ))
                ) : (
                    categories.map(cat => (
                        <RevealOnScroll key={cat.id}>
                            <div
                                className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-700 hover:border-blue-600 transform hover:-translate-y-1"
                            >
                                <h2 className="text-2xl font-bold text-white mb-3 font-poppins">{cat.name}</h2>
                                <p className="text-gray-300 mb-4 font-roboto">{cat.description}</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {ensaios.filter(e => e.category === cat.id).map(ensaio => (
                                        <div
                                            key={ensaio.id}
                                            className="bg-gray-700 p-4 rounded-lg shadow-sm hover:bg-gray-600 transition-colors cursor-pointer flex flex-col items-start"
                                            onClick={() => navigate(`/ensaio/${ensaio.id}`)}
                                        >
                                            <h3 className="text-xl font-semibold text-white mb-1 font-poppins">{ensaio.title}</h3>
                                            <p className="text-gray-300 text-sm font-roboto">{ensaio.intro?.substring(0, 80)}...</p>
                                            <span className="mt-2 inline-block text-blue-400 hover:text-blue-300 text-xs font-semibold">
                                                Ver Detalhes &rarr;
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealOnScroll>
                    ))
                )}
            </div>
        </main>
    );
};

export default EnsaiosCategoriesPage;
