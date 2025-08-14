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
 * Componente da Página Inicial do site.
 * Exibe categorias, ensaios em destaque e últimos artigos do blog.
 * Os dados são passados via props após serem carregados do Firestore no App.js.
 */
const HomePage = ({ navigate, categories, ensaios, blogPosts, setSearchTerm, searchTerm, handleSearch, isLoadingCategories, isLoadingEnsaios, isLoadingBlogPosts }) => {
    return (
        <main className="container mx-auto py-8 px-4">
            {/* Seção Hero */}
            <RevealOnScroll>
                <section className="text-center py-20 bg-gray-800 rounded-xl shadow-lg mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight font-poppins">
                        Seu Guia Definitivo para Ensaios de Laboratório
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-roboto">
                        Tutoriais passo a passo, artigos de especialistas e as melhores práticas para laboratórios de construção civil.
                    </p>
                    <div className="flex justify-center">
                        <input
                            type="text"
                            placeholder="Buscar ensaios..."
                            className="p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Buscar
                        </button>
                    </div>
                </section>
            </RevealOnScroll>

            {/* Categorias de Ensaios */}
            <RevealOnScroll>
                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-white text-center mb-10 font-poppins">Categorias de Ensaios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {isLoadingCategories ? (
                            // Esqueletos para carregamento de categorias
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="bg-gray-800 rounded-xl p-8 shadow-md animate-pulse">
                                    <div className="h-8 bg-gray-700 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/3 mt-4"></div>
                                </div>
                            ))
                        ) : (
                            categories.map(cat => (
                                <div
                                    key={cat.id}
                                    className="bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-700 hover:border-blue-600 transform hover:-translate-y-1"
                                    onClick={() => navigate(`/ensaios/${cat.id}`)}
                                >
                                    <h3 className="text-2xl font-bold text-white mb-3 font-poppins">{cat.name}</h3>
                                    <p className="text-gray-300 font-roboto">{cat.description}</p>
                                    <span className="mt-4 inline-block text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                                        Explorar &rarr;
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </RevealOnScroll>

            {/* Ensaios em Destaque */}
            <RevealOnScroll>
                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-white text-center mb-10 font-poppins">Ensaios em Destaque</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {isLoadingEnsaios ? (
                            // Esqueletos para carregamento de ensaios
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="bg-gray-800 rounded-xl p-6 shadow-md animate-pulse">
                                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/2 mt-4"></div>
                                </div>
                            ))
                        ) : (
                            ensaios.slice(0, 3).map(ensaio => (
                                <div
                                    key={ensaio.id}
                                    className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-700 hover:border-blue-600 transform hover:-translate-y-1"
                                    onClick={() => navigate(`/ensaio/${ensaio.id}`)}
                                >
                                    <h3 className="text-xl font-bold text-white mb-2 font-poppins">{ensaio.title}</h3>
                                    <p className="text-gray-300 text-sm font-roboto">{ensaio.intro?.substring(0, 100)}...</p>
                                    <span className="mt-4 inline-block text-blue-500 hover:text-blue-400 font-semibold text-sm transition-colors">
                                        Ler Tutorial &rarr;
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </RevealOnScroll>

            {/* Últimos Artigos do Blog */}
            <RevealOnScroll>
                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-white text-center mb-10 font-poppins">Últimos Artigos do Blog</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {isLoadingBlogPosts ? (
                            // Esqueletos para carregamento de artigos do blog
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="bg-gray-800 rounded-xl shadow-md animate-pulse overflow-hidden">
                                    <div className="w-full h-48 bg-gray-700"></div>
                                    <div className="p-6">
                                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
                                        <div className="h-4 bg-gray-700 rounded w-full"></div>
                                        <div className="h-4 bg-gray-700 rounded w-5/6 mt-2"></div>
                                        <div className="h-4 bg-gray-700 rounded w-1/3 mt-4"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            blogPosts.slice(0, 3).map(post => (
                                <div
                                    key={post.id}
                                    className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-700 hover:border-blue-600 transform hover:-translate-y-1"
                                    onClick={() => navigate(`/blog/${post.id}`)}
                                >
                                    {/* Imagens placeholder. Substitua por imagens otimizadas em produção. */}
                                    <img src={post.img} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 font-poppins">{post.title}</h3>
                                        <p className="text-gray-400 text-sm mb-3 font-roboto">Por {post.author} em {post.date}</p>
                                        <p className="text-gray-300 text-sm font-roboto">{post.snippet}</p>
                                        <span className="mt-4 inline-block text-blue-500 hover:text-blue-400 font-semibold text-sm transition-colors">
                                            Ler Mais &rarr;
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </RevealOnScroll>

            {/* CTA */}
            <RevealOnScroll>
                <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl shadow-lg">
                    <h2 className="text-4xl font-bold text-white mb-4 font-poppins">Pronto para aprimorar seu conhecimento?</h2>
                    <p className="text-xl text-white mb-8 font-roboto">Explore nossos guias ou inscreva-se para atualizações!</p>
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate('/ensaios')}
                            className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Explorar Guias
                        </button>
                        <button
                            className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Inscrever-se na Newsletter
                        </button>
                    </div>
                </section>
            </RevealOnScroll>
        </main>
    );
};

export default HomePage;
