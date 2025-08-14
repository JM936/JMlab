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
 * Componente de Carregamento (Skeleton Loader)
 */
const SkeletonLoader = () => {
    return (
        <div className="bg-gray-800 rounded-xl shadow-md animate-pulse overflow-hidden">
            <div className="w-full h-48 bg-gray-700"></div>
            <div className="p-6">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 mt-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/3 mt-4"></div>
            </div>
        </div>
    );
};

/**
 * Componente da Página do Blog.
 * Lista todos os artigos do blog.
 * Os dados são passados via props do App.js.
 */
const BlogPage = ({ navigate, blogPosts, isLoadingBlogPosts }) => {
    return (
        <main className="container mx-auto py-8 px-4 min-h-screen">
            <RevealOnScroll>
                <h1 className="text-4xl font-bold text-white mb-10 text-center font-poppins">Nosso Blog</h1>
            </RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoadingBlogPosts ? (
                    // Esqueletos para carregamento enquanto os dados são buscados
                    [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
                ) : (
                    blogPosts.map(post => (
                        <RevealOnScroll key={post.id}>
                            <div
                                className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-700 hover:border-blue-600 transform hover:-translate-y-1"
                                onClick={() => navigate(`/blog/${post.id}`)}
                            >
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
                        </RevealOnScroll>
                    ))
                )}
            </div>
        </main>
    );
};

export default BlogPage;
