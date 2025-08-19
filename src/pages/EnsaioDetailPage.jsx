import React, { useEffect, useState } from 'react';
import { firestoreDB } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const EnsaioDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [ensaio, setEnsaio] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchEnsaio = async () => {
        const docRef = doc(firestoreDB, 'ensaios', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEnsaio(docSnap.data());
        }
      };
      fetchEnsaio();
    }
  }, [id]);

  if (!ensaio) return <p>Carregando...</p>;

  return (
    <div>
      <h1>{ensaio.nome}</h1>
      <p>{ensaio.descricao}</p>
    </div>
  );
};

export default EnsaioDetailPage;
