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
 * Componente da Página de Termos de Uso.
 * Exibe os termos de uso do site.
 */
const TermsOfUsePage = () => (
    <main className="container mx-auto py-8 px-4 min-h-screen">
        <RevealOnScroll>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
                <h1 className="text-4xl font-bold text-white mb-6 text-center font-poppins">Termos de Uso</h1>
                <div className="text-gray-300 space-y-4 font-roboto">
                    <p>Bem-vindo ao GeotechLabguide. Ao acessar e utilizar nosso site, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">1. Aceitação dos Termos</h2>
                    <p>Se você não concordar com qualquer parte destes termos, você não deve usar nosso site.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">2. Uso do Conteúdo</h2>
                    <p>O conteúdo fornecido no GeotechLabguide é apenas para fins informativos e educacionais. Embora nos esforcemos para garantir a precisão das informações, não garantimos sua total exatidão, integridade ou adequação para qualquer finalidade específica.</p>
                    <p>Você pode utilizar o conteúdo para seu uso pessoal e não comercial, desde que mantenha todos os avisos de direitos autorais e outras notificações de propriedade. Qualquer uso comercial ou reprodução sem permissão expressa por escrito é estritamente proibido.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">3. Propriedade Intelectual</h2>
                    <p>Todo o conteúdo, design, gráficos, logotipos e outros materiais no GeotechLabguide são de propriedade do GeotechLabguide ou de seus licenciadores e são protegidos por leis de direitos autorais e marcas registradas.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">4. Links para Outros Sites</h2>
                    <p>Nosso site pode conter links para sites de terceiros que não são operados por nós. Não temos controle sobre o conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros e não assumimos responsabilidade por eles. Recomendamos que você revise os termos e políticas de qualquer site que visitar.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">5. Isenção de Garantias</h2>
                    <p>O GeotechLabguide é fornecido "como está" e "conforme disponível", sem quaisquer garantias de qualquer tipo, expressas ou implícitas. Não garantimos que o site será ininterrupto, livre de erros ou livre de vírus ou outros componentes prejudiciais.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">6. Limitação de Responsabilidade</h2>
                    <p>Em nenhuma circunstância o GeotechLabguide, seus diretores, funcionários ou agentes serão responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes de (i) seu acesso ou uso ou incapacidade de acessar ou usar o site; (iii) qualquer conteúdo obtido do site; e (iv) acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo, seja com base em garantia, contrato, delito (incluindo negligência) ou qualquer outra teoria legal, independentemente de termos sido informados da possibilidade de tais danos.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">7. Alterações nos Termos</h2>
                    <p>Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer pelo menos 30 dias de aviso antes que quaisquer novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso exclusivo critério.</p>
                    <h2 className="text-2xl font-semibold text-white mt-6 mb-2">8. Contato</h2>
                    <p>Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco através da nossa página de contato.</p>
                    <p className="text-sm text-gray-400 mt-8">Última atualização: 13 de Agosto de 2025</p>
                </div>
            </div>
        </RevealOnScroll>
    </main>
);

export default TermsOfUsePage;
