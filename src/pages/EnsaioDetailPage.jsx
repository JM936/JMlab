// src/pages/ensaios/[ensaioId].jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, query, orderBy, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // ajuste conforme sua estrutura

const EnsaioDetailPage = ({ showMessage, userId, isAuthReady }) => {
  const router = useRouter();
  const { ensaioId } = router.query;

  const [ensaio, setEnsaio] = useState(null);
  const [loadingEnsaio, setLoadingEnsaio] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [currentRating, setCurrentRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentTextError, setCommentTextError] = useState('');
  const [ratingError, setRatingError] = useState('');

  useEffect(() => {
    if (!db || !ensaioId) return;
    const fetchEnsaio = async () => {
      setLoadingEnsaio(true);
      try {
        const ensaioDocRef = collection(db, 'ensaios');
        const q = query(ensaioDocRef);
        const querySnapshot = await getDocs(q);
        const fetchedEnsaio = querySnapshot.docs.find(doc => doc.id === ensaioId)?.data();
        if (fetchedEnsaio) {
          setEnsaio({ id: ensaioId, ...fetchedEnsaio });
        } else {
          showMessage?.('Erro', 'Ensaio não encontrado. Verifique o ID.', 'error');
        }
      } catch (error) {
        console.error("Erro ao buscar ensaio:", error);
        showMessage?.('Erro', 'Falha ao carregar o ensaio.', 'error');
      } finally {
        setLoadingEnsaio(false);
      }
    };
    fetchEnsaio();
  }, [ensaioId, db]);

  useEffect(() => {
    if (!db || !ensaioId || !isAuthReady) return;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const commentsCollectionPath = `artifacts/${appId}/public/data/ensaio_comments`;
    const commentsRef = collection(db, commentsCollectionPath);
    const q = query(commentsRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(comment => comment.ensaioId === ensaioId);
      setComments(fetchedComments);
      setLoadingComments(false);
    }, (error) => {
      console.error("Erro ao carregar comentários:", error);
      setLoadingComments(false);
      showMessage?.('Erro', 'Falha ao carregar comentários.', 'error');
    });
    return () => unsubscribe();
  }, [ensaioId, db, isAuthReady]);

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
    if (!valid || !ensaioId || !userId) return;

    setSubmittingComment(true);
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const commentsCollectionPath = `artifacts/${appId}/public/data/ensaio_comments`;
      await addDoc(collection(db, commentsCollectionPath), {
        ensaioId,
        userId,
        username: `Usuário Anônimo (${userId.substring(0, 6)}...)`,
        text: newCommentText.trim(),
        rating: currentRating,
        timestamp: serverTimestamp()
      });
      setNewCommentText('');
      setCurrentRating(0);
      showMessage?.('Sucesso!', 'Comentário adicionado com sucesso.', 'success');
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      showMessage?.('Erro', 'Falha ao adicionar comentário.', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleRatingClick = (star) => {
    setCurrentRating(star);
    setRatingError('');
  };

  return (
    <main className="container mx-auto py-8 px-4 min-h-screen">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold text-white mb-4">{ensaio?.title || 'Carregando...'}</h1>
        <p className="text-gray-300 mb-6">{ensaio?.description}</p>
        {/* Comentários e formulário */}
      </div>
    </main>
  );
};

export default EnsaioDetailPage;
