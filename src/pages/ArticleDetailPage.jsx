import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore'; // Importa query
import { db } from '../firebaseConfig'; // Importe o db do seu arquivo de configuração

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
 * Componente de Carregamento (Skeleton Loader) para a página de detalhes do artigo
 */
const SkeletonLoader = () => {
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 animate-pulse">
            <div className="h-10 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="w-full h-96 bg-gray-700 rounded-lg mb-8"></div>
            <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-11/12"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-10/12"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-11/12"></div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
                <div className="h-10 w-32 bg-gray-700 rounded-full"></div>
                <div className="h-10 w-32 bg-gray-700 rounded-full"></div>
            </div>
        </div>
    );
};

/**
 * Componente da Página de Detalhes do Artigo do Blog.
 * Exibe o conteúdo completo de um artigo específico.
 * Busca os dados do artigo do Firestore.
 */
const ArticleDetailPage = ({ showMessage }) => {
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [loadingArticle, setLoadingArticle] = useState(true);

    // Efeito para carregar o artigo do Firestore
    useEffect(() => {
        const fetchArticle = async () => {
            setLoadingArticle(true);
            try {
                // Busca o artigo pelo ID do documento
                const blogPostsRef = collection(db, 'blogPosts');
                const q = query(blogPostsRef);
                const querySnapshot = await getDocs(q);
                const fetchedArticle = querySnapshot.docs.find(doc => doc.id === articleId)?.data();

                if (fetchedArticle) {
                    setArticle({ id: articleId, ...fetchedArticle });
                } else {
                    showMessage('Erro', 'Artigo não encontrado. Verifique o ID.', 'error');
                }
            } catch (error) {
                console.error("Erro ao buscar artigo:", error);
                showMessage('Erro', 'Falha ao carregar o artigo. Por favor, tente novamente.', 'error');
            } finally {
                setLoadingArticle(false);
            }
        };

        // Certifica-se de que 'db' (instância do Firestore) está disponível antes de tentar buscar dados
        // 'db' é importado diretamente de '../firebaseConfig'. Se 'firebaseConfig.js' não existir ou estiver errado, este erro ocorrerá.
        if (db) { 
            fetchArticle();
        } else {
            // Se db não estiver disponível, isso significa que firebaseConfig não foi carregado corretamente
            console.error("Firebase DB não inicializado. Verifique src/firebaseConfig.js.");
            showMessage('Erro de Configuração', 'O Firebase não foi configurado corretamente. Verifique src/firebaseConfig.js.', 'error');
            setLoadingArticle(false);
        }
    }, [articleId, showMessage]); // Removido 'db' das dependências pois é importado diretamente


    if (loadingArticle) {
        return (
            <main className="container mx-auto py-8 px-4 min-h-screen">
                <SkeletonLoader />
            </main>
        );
    }

    if (!article) {
        return (
            <main className="container mx-auto py-8 px-4 min-h-screen">
                <div className="text-white text-center text-xl">
                    Artigo não encontrado ou erro ao carregar.
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto py-8 px-4 min-h-screen">
            <RevealOnScroll>
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-poppins leading-tight">{article.title}</h1>
                    <p className="text-gray-400 text-lg mb-6 font-roboto">Por {article.author} em {article.date}</p>
                    <img src={article.img} alt={article.title} className="w-full h-96 object-cover rounded-lg mb-8 shadow-md" loading="lazy" />
                    <div className="prose prose-invert max-w-none text-gray-300 font-roboto leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: article.content }}>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors">
                            Compartilhar no Facebook
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors">
                            Compartilhar no LinkedIn
                        </button>
                    </div>
                </div>
            </RevealOnScroll>
        </main>
    );
};

export default ArticleDetailPage;
