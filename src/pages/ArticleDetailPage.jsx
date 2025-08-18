import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // ajuste o caminho conforme sua estrutura

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

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div ref={ref} className={`reveal-on-scroll ${revealed ? 'revealed' : ''}`}>
      {children}
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 animate-pulse">
    <div className="h-10 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
    <div className="w-full h-96 bg-gray-700 rounded-lg mb-8"></div>
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
      ))}
    </div>
    <div className="mt-8 flex justify-end gap-4">
      <div className="h-10 w-32 bg-gray-700 rounded-full"></div>
      <div className="h-10 w-32 bg-gray-700 rounded-full"></div>
    </div>
  </div>
);

const ArticleDetailPage = () => {
  const router = useRouter();
  const { articleId } = router.query;

  const [article, setArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(true);

  useEffect(() => {
    if (!articleId || !db) return;

    const fetchArticle = async () => {
      setLoadingArticle(true);
      try {
        const blogPostsRef = collection(db, 'blogPosts');
        const q = query(blogPostsRef);
        const querySnapshot = await getDocs(q);
        const fetchedArticle = querySnapshot.docs.find(doc => doc.id === articleId)?.data();

        if (fetchedArticle) {
          setArticle({ id: articleId, ...fetchedArticle });
        } else {
          console.error('Artigo não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar artigo:', error);
      } finally {
        setLoadingArticle(false);
      }
    };

    fetchArticle();
  }, [articleId]);

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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-poppins leading-tight">
            {article.title}
          </h1>
          <p className="text-gray-400 text-lg mb-6 font-roboto">
            Por {article.author} em {article.date}
          </p>
          <img
            src={article.img}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg mb-8 shadow-md"
            loading="lazy"
          />
          <div
            className="prose prose-invert max-w-none text-gray-300 font-roboto leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
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
