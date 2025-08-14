import React, { useEffect, useRef, useState } from 'react';

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
 * Componente da Página Sobre.
 * Contém informações sobre o site e sua missão.
 */
const AboutPage = () => (
    <main className="container mx-auto py-8 px-4 min-h-screen">
        <RevealOnScroll>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
                <h1 className="text-4xl font-bold text-white mb-6 text-center font-poppins">Sobre o GeotechLabguide</h1>
                <p className="text-gray-300 text-lg mb-4 font-roboto">
                    Nossa missão é ser a principal fonte de informação e guias práticos para ensaios de laboratório na área de engenharia civil.
                    Acreditamos que o conhecimento detalhado e acessível é a chave para a excelência na construção.
                </p>
                <p className="text-gray-300 text-lg mb-4 font-roboto">
                    Fundado por uma equipe de engenheiros e tecnólogos experientes, o GeotechLabguide se dedica a empoderar estudantes,
                    profissionais e laboratórios com o conteúdo mais preciso e atualizado.
                </p>
                <p className="text-gray-300 text-lg font-roboto">
                    Navegue por nossos tutoriais passo a passo, aprofunde-se em nossos artigos do blog e junte-se à nossa comunidade para elevar o padrão da engenharia geotécnica.
                </p>
            </div>
        </RevealOnScroll>
    </main>
);

export default AboutPage;
