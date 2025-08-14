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
 * Componente da Página de Contato.
 * Formulário de contato para os usuários.
 */
const ContactPage = () => (
    <main className="container mx-auto py-8 px-4 min-h-screen">
        <RevealOnScroll>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-6 text-center font-poppins">Fale Conosco</h1>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-gray-300 text-sm font-semibold mb-2 font-roboto">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Seu nome"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2 font-roboto">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="seu.email@exemplo.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-300 text-sm font-semibold mb-2 font-roboto">Mensagem:</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Sua mensagem..."
                        ></textarea>
                    </div>
                    {/* reCAPTCHA placeholder */}
                    <div className="text-gray-400 text-sm font-roboto">
                        <p>O reCAPTCHA seria implementado aqui para proteção contra spam.</p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Enviar Mensagem
                    </button>
                </form>
            </div>
        </RevealOnScroll>
    </main>
);

export default ContactPage;
