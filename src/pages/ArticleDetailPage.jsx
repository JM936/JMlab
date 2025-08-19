import React, { useEffect, useState } from 'react';
import { firestoreDB } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const ArticleDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        const docRef = doc(firestoreDB, 'articles', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle(docSnap.data());
        }
      };
      fetchArticle();
    }
  }, [id]);

  if (!article) return <p>Carregando...</p>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
};

export default ArticleDetailPage;
