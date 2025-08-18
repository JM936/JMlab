// src/pages/ArticleDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // ajuste conforme sua estrutura

const ArticleDetailPage = () => {
  const router = useRouter();
  const { articleId } = router.query;

  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (!articleId || !db) return;

    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'articles', articleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle(docSnap.data());
        }
      } catch (error) {
        console.error('Erro ao buscar artigo:', error);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <p className="text-center text-gray-400">Carregando artigo...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
      <p className="text-gray-300">{article.content}</p>
    </div>
  );
};

export default ArticleDetailPage;
