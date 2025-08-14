import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, addDoc, query, orderBy, getDocs, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore'; // Importa Timestamp
import { db } from '../firebaseConfig'; // Importe o db do seu arquivo de configuração

// COMPONENTES AUXILIARES INTERNOS A ESTA PÁGINA

/**
 * Componente para renderizar conteúdo com notação LaTeX.
 * Suporta LaTeX inline ($...$) e em bloco ($$...$$).
 * NOTA: Para renderização matemática real, uma biblioteca como MathJax ou KaTeX seria necessária.
 */
const LaTeXRenderer = ({ content }) => {
    // Regex para encontrar blocos LaTeX inline ($...$) ou em bloco ($$...$$)
    const parts = content.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g).filter(Boolean);

    return (
        <div className="overflow-x-auto">
            {parts.map((part, index) => {
                if (part.startsWith('$$') && part.endsWith('$$')) {
                    // Bloco LaTeX: exibe em um bloco separado com estilo
                    const mathContent = part.slice(2, -2).trim();
                    return (
                        <div key={index} className="my-4 p-4 bg-gray-700 rounded-lg shadow-inner">
                            <pre className="text-sm overflow-x-auto whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: mathContent }} />
                        </div>
                    );
                } else if (part.startsWith('$') && part.endsWith('$')) {
                    // LaTeX inline: exibe dentro do texto com estilo diferente
                    const mathContent = part.slice(1, -1).trim();
                    return (
                        <span key={index} className="font-mono text-emerald-300 bg-gray-700 px-1 py-0.5 rounded">
                            <span dangerouslySetInnerHTML={{ __html: mathContent }} />
                        </span>
                    );
                }
                return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
            })}
        </div>
    );
};

/**
 * Ícone de estrela para sistema de avaliação.
 * Pode ser preenchido ou não, e opcionalmente interativo.
 */
const StarIcon = ({ filled, onClick, index }) => (
    <svg
        className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
            filled ? 'text-yellow-400' : 'text-gray-500'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onClick={onClick ? () => onClick(index) : undefined} // Torna onClick opcional
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.985 6.094a1 1 0 00.95.691h6.427c.969 0 1.371 1.24.588 1.81l-5.183 3.766a1 1 0 00-.364 1.118l1.985 6.094c.3.921-.755 1.688-1.538 1.118l-5.183-3.766a1 1 0 00-1.176 0l-5.183 3.766c-.783.57-1.838-.197-1.538-1.118l1.985-6.094a1 1 0 00-.364-1.118L2.055 11.522c-.783-.57-.381-1.81.588-1.81h6.427a1 1 0 00.95-.691l1.985-6.094z" />
    </svg>
);

/**
 * Componente auxiliar para a animação de revelação ao rolar
 */
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
const SkeletonLoader = ({ type }) => {
    if (type === 'detail-section') {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-11/12"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-10/12"></div>
            </div>
        );
    }
    if (type === 'comments-section') {
        return (
            <div className="bg-gray-900 rounded-xl p-6 md:p-8 shadow-inner animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
                <div className="flex justify-center items-center mb-6 space-x-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-gray-700 rounded-full"></div>
                    ))}
                    <div className="h-6 bg-gray-700 rounded w-16 ml-3"></div>
                </div>
                <div className="h-20 bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-12 bg-gray-700 rounded w-full"></div>
                <div className="space-y-4 mt-8">
                    <div className="bg-gray-800 p-5 rounded-lg h-24"></div>
                    <div className="bg-gray-800 p-5 rounded-lg h-24"></div>
                </div>
            </div>
        );
    }
    return <div className="h-6 bg-gray-700 rounded w-full animate-pulse"></div>;
};

/**
 * Componente da Página de Detalhes do Ensaio.
 * Exibe informações detalhadas de um ensaio específico e permite comentários/avaliações.
 * Busca os dados do ensaio e dos comentários do Firestore.
 */
const EnsaioDetailPage = ({ db, userId, isAuthReady, showMessage }) => {
    const { ensaioId } = useParams(); // Obtém o ID do ensaio da URL
    const [ensaio, setEnsaio] = useState(null);
    const [loadingEnsaio, setLoadingEnsaio] = useState(true);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [newCommentText, setNewCommentText] = useState('');
    const [currentRating, setCurrentRating] = useState(0);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [commentTextError, setCommentTextError] = useState('');
    const [ratingError, setRatingError] = useState('');

    // Efeito para carregar os detalhes do ensaio do Firestore
    useEffect(() => {
        const fetchEnsaio = async () => {
            setLoadingEnsaio(true);
            try {
                // Busca o ensaio pelo ID do documento
                // Assumimos que 'ensaios' é uma coleção de documentos, onde o ID do documento é o ensaioId
                const ensaioDocRef = collection(db, 'ensaios');
                const q = query(ensaioDocRef);
                const querySnapshot = await getDocs(q);
                // Procura o documento com o ID correspondente
                const fetchedEnsaio = querySnapshot.docs.find(doc => doc.id === ensaioId)?.data();

                if (fetchedEnsaio) {
                    setEnsaio({ id: ensaioId, ...fetchedEnsaio });
                } else {
                    showMessage('Erro', 'Ensaio não encontrado. Verifique o ID.', 'error');
                }
            } catch (error) {
                console.error("Erro ao buscar ensaio:", error);
                showMessage('Erro', 'Falha ao carregar o ensaio. Por favor, tente novamente.', 'error');
            } finally {
                setLoadingEnsaio(false);
            }
        };

        if (db) { // Garante que db está inicializado antes de tentar buscar
            fetchEnsaio();
        }
    }, [ensaioId, db, showMessage]); // Dependência do ID do ensaio e do objeto db para refetch

    // Efeito para carregar comentários do Firestore em tempo real
    useEffect(() => {
        if (!db || !ensaioId || !isAuthReady) { // Garante que db e isAuthReady estão prontos
            setLoadingComments(true);
            return;
        }

        try {
            // Caminho da coleção de comentários: artifacts/{appId}/public/data/ensaio_comments
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const commentsCollectionPath = `artifacts/${appId}/public/data/ensaio_comments`;
            const commentsRef = collection(db, commentsCollectionPath);
            
            // Filtra e ordena os comentários para o ensaio específico
            // IMPORTANTE: Firestore não permite queries de 'where' em múltiplos campos diferentes
            // e 'orderBy' em um campo diferente do primeiro 'where' sem um índice composto.
            // Para simplicidade e evitar requisitos de índice, faremos a filtragem de ensaioId no cliente.
            const q = query(commentsRef, orderBy('timestamp', 'desc')); 

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedComments = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    // Filtra os comentários para o ensaio específico *no cliente*
                    .filter(comment => comment.ensaioId === ensaioId);
                setComments(fetchedComments);
                setLoadingComments(false);
            }, (error) => {
                console.error("Erro ao carregar comentários:", error);
                setLoadingComments(false);
                showMessage('Erro', 'Falha ao carregar comentários. Verifique sua conexão.', 'error');
            });

            return () => unsubscribe(); // Limpa o listener ao desmontar o componente
        } catch (error) {
            console.error("Erro ao configurar listener de comentários:", error);
            setLoadingComments(false);
        }
    }, [ensaioId, db, isAuthReady, showMessage]); // Depende do ensaioId, db, e isAuthReady

    /**
     * Lida com a submissão de um novo comentário e avaliação para o Firestore.
     */
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        let valid = true;
        setCommentTextError('');
        setRatingError('');

        if (newCommentText.trim() === '') {
            setCommentTextError('O comentário não pode ser vazio.');
            valid = false;
        }
        if (currentRating === 0) {
            setRatingError('Por favor, atribua uma avaliação.');
            valid = false;
        }

        if (!valid) return;

        if (!ensaioId) {
            showMessage('Erro', 'Não foi possível associar o comentário a um ensaio válido.', 'error');
            return;
        }
        if (!isAuthReady || !userId) {
            showMessage('Autenticação Necessária', 'Por favor, aguarde a autenticação ou tente novamente.', 'info');
            return;
        }

        setSubmittingComment(true);
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const commentsCollectionPath = `artifacts/${appId}/public/data/ensaio_comments`;
            
            await addDoc(collection(db, commentsCollectionPath), {
                ensaioId: ensaioId,
                userId: userId, // User ID from Firebase Auth
                // Exibe uma versão abreviada do userId para o usuário anônimo
                username: `Usuário Anônimo (${userId.substring(0, 6)}...)`, 
                text: newCommentText.trim(),
                rating: currentRating,
                timestamp: serverTimestamp() // Usa a marca de tempo do servidor para consistência
            });
            setNewCommentText('');
            setCurrentRating(0);
            showMessage('Sucesso!', 'Comentário e avaliação adicionados com sucesso.', 'success');
        } catch (error) {
            console.error("Erro ao adicionar comentário:", error);
            showMessage('Erro', 'Falha ao adicionar comentário. Por favor, tente novamente.', 'error');
        } finally {
            setSubmittingComment(false);
        }
    };

    /**
     * Atualiza a avaliação atual ao clicar nas estrelas.
     */
    const handleRatingClick = (star) => {
        setCurrentRating(star);
        setRatingError(''); // Limpa erro ao selecionar rating
    };

    if (loadingEnsaio) {
        return (
            <main className="container mx-auto py-8 px-4 min-h-screen">
                <SkeletonLoader type="detail-section" />
                <SkeletonLoader type="detail-section" />
                <SkeletonLoader type="comments-section" />
            </main>
        );
    }

    if (!ensaio) {
        return (
            <main className="container mx-auto py-8 px-4 min-h-screen">
                <div className="text-white text-center text-xl">
                    Ensaio não encontrado ou erro ao carregar.
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto py-8 px-4 min-h-screen">
            <RevealOnScroll>
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-poppins leading-tight">{ensaio.fullTitle}</h1>
                    
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-blue-500 mb-4 font-poppins">1. Objetivo e Normas</h2>
                        <p className="text-gray-300 mb-3 font-roboto">{ensaio.intro}</p>
                        <p className="text-gray-400 text-sm font-roboto">
                            Normas Aplicáveis: <span className="font-semibold">{ensaio.normas?.join(', ')}</span>
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-blue-500 mb-4 font-poppins">2. Equipamentos e Materiais</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {ensaio.equipamentos?.map((item, index) => (
                                <div key={index} className="flex flex-col items-center text-center bg-gray-700 rounded-lg p-4 shadow-inner">
                                    {/* Imagens placeholder. Substitua por imagens otimizadas em produção. */}
                                    <img src={item.img} alt={item.name} className="w-20 h-20 mb-2 rounded-full border-2 border-gray-600" loading="lazy" />
                                    <p className="text-gray-200 font-semibold text-sm font-roboto">{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-blue-500 mb-4 font-poppins">3. Procedimento Passo a Passo</h2>
                        <ol className="list-decimal list-inside space-y-3 text-gray-300 font-roboto">
                            {ensaio.procedimento?.map((step, index) => (
                                <li key={index} className="bg-gray-700 p-3 rounded-md shadow-sm">
                                    <LaTeXRenderer content={step} />
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-blue-500 mb-4 font-poppins">4. Cálculos e Fórmulas</h2>
                        <div className="bg-gray-700 rounded-lg p-6 shadow-inner text-gray-200 text-lg font-roboto">
                            <LaTeXRenderer content={ensaio.calculos} />
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-blue-500 mb-4 font-poppins">5. Interpretação dos Resultados</h2>
                        <p className="text-gray-300 font-roboto">{ensaio.interpretacao}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-blue-500 mb-4 font-poppins">6. Observações e Dicas de Segurança</h2>
                        <p className="text-gray-300 font-roboto">{ensaio.observacoes}</p>
                    </section>

                    <div className="text-center mt-10">
                        <a
                            href={ensaio.download}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Baixar Modelo de Relatório (PDF)
                        </a>
                    </div>

                    {/* Seção de Comentários e Avaliações */}
                    <section className="mt-16 bg-gray-900 rounded-xl p-6 md:p-8 shadow-inner">
                        <h2 className="text-3xl font-bold text-white mb-6 font-poppins text-center">Comentários e Avaliações</h2>

                        {/* Input de Avaliação */}
                        <div className="flex justify-center items-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                    key={star}
                                    index={star}
                                    filled={star <= currentRating}
                                    onClick={handleRatingClick}
                                />
                            ))}
                            <span className="ml-3 text-gray-300 text-lg font-semibold">{currentRating} / 5</span>
                        </div>
                        {ratingError && <p className="text-red-400 text-center text-sm mb-4">{ratingError}</p>}


                        {/* Formulário de Comentário */}
                        <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
                            <textarea
                                className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${commentTextError ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-y`}
                                rows="4"
                                placeholder="Deixe seu comentário sobre este procedimento..."
                                value={newCommentText}
                                onChange={(e) => {setNewCommentText(e.target.value); setCommentTextError('');}}
                            ></textarea>
                            {commentTextError && <p className="text-red-400 text-sm -mt-3">{commentTextError}</p>}
                            
                            <button
                                type="submit"
                                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${submittingComment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={submittingComment}
                            >
                                {submittingComment ? 'Enviando...' : 'Enviar Comentário e Avaliar'}
                            </button>
                        </form>

                        {/* Exibição de Comentários */}
                        <div>
                            {loadingComments ? (
                                <SkeletonLoader type="comments-section" />
                            ) : comments.length === 0 ? (
                                <p className="text-gray-400 text-center italic">Nenhum comentário ainda. Seja o primeiro a avaliar este procedimento!</p>
                            ) : (
                                <div className="space-y-6">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700">
                                            <div className="flex items-center mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIcon key={star} filled={star <= comment.rating} />
                                                ))}
                                                <span className="ml-3 text-gray-300 font-semibold">{comment.rating} / 5</span>
                                            </div>
                                            <p className="text-gray-300 mb-2 font-roboto">{comment.text}</p>
                                            <p className="text-gray-500 text-sm font-roboto">
                                                Por {comment.username} em {comment.timestamp ? new Date(comment.timestamp.toDate()).toLocaleString() : 'Data desconhecida'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </RevealOnScroll>
        </main>
    );
};

export default EnsaioDetailPage;
