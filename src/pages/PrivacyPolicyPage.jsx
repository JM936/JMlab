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
 * Componente da Página de Política de Privacidade.
 * Exibe a política de privacidade do site.
 */
const PrivacyPolicyPage = () => (
    <main className="container mx-auto py-8 px-4 min-h-screen">
        <RevealOnScroll>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
                <h1 className="text-4xl font-bold text-white mb-6 text-center font-poppins">Política de Privacidade</h1>
                <div className="text-gray-300 space-y-4 font-roboto">
                    <p>Esta política de privacidade descreve como o GeotechLabguide coleta, usa e protege suas informações. Valorizamos sua privacidade e estamos comprometidos em protegê-la.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">1. Coleta de Informações</h2>
                    <p>Coletamos informações que você nos fornecem diretamente, como nome e email ao preencher formulários de contato ou se inscrever em nossa newsletter. Também coletamos automaticamente certas informações sobre sua visita ao site, como endereço IP, tipo de navegador e páginas visitadas, através de cookies e tecnologias semelhantes.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">2. Uso das Informações</h2>
                    <p>Utilizamos as informações coletadas para:</p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>Melhorar e personalizar sua experiência em nosso site.</li>
                        <li>Responder às suas dúvidas e solicitações.</li>
                        <li>Enviar comunicações de marketing (se você optar por recebê-las).</li>
                        <li>Analisar o uso do site para otimização de performance e conteúdo.</li>
                        <li>Cumprir obrigações legais.</li>
                    </ul>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">3. Compartilhamento de Informações</h2>
                    <p>Não vendemos, trocamos ou alugamos suas informações pessoais a terceiros. Podemos compartilhar informações com prestadores de serviços confiáveis que nos auxiliam na operação do site ou na prestação de nossos serviços, desde que esses terceiros concordem em manter suas informações confidenciais.</p>
                    <p>Também podemos divulgar suas informações quando exigido por lei ou para proteger nossos direitos e segurança.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">4. Cookies</h2>
                    <p>Nosso site utiliza cookies para melhorar a navegação, personalizar conteúdo e analisar o tráfego. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade de algumas partes do site.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">5. Segurança dos Dados</h2>
                    <p>Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">6. Links de Terceiros</h2>
                    <p>Nosso site pode conter links para sites de terceiros. Não somos responsáveis pelas práticas de privacidade ou conteúdo desses sites. Recomendamos que você revise as políticas de privacidade de qualquer site que visitar.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">7. Alterações a Esta Política de Privacidade</h2>
                    <p>Podemos atualizar nossa política de privacidade periodicamente. Quaisquer alterações serão publicadas nesta página. Recomendamos que você revise esta política regularmente para se manter informado.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">8. Contato</h2>
                    <p>Se tiver alguma dúvida sobre esta política de privacidade, entre em contato conosco através da nossa página de contato.</p>
                    <p className="text-sm text-gray-400 mt-8">Última atualização: 13 de Agosto de 2025</p>
                </div>
            </div>
        </RevealOnScroll>
    </main>
);

export default PrivacyPolicyPage;
