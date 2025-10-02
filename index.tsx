import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

const speakersData = [
    {
        id: 1,
        name: 'Guillermo Martínez Gauna-Vivas',
        img: 'https://i.imgur.com/FKcvgns.png',
        role: 'Fundador de Ayúdame3D',
        ponencia: 'Diseñando Ayudas, Imprimiendo Cambios Sociales',
        cv: 'Emprendedor social, artista y CEO de Ayúdame3D, donde crea prótesis en 3D que han ayudado a más de 25.000 personas en 65 países. Su trabajo artístico fusiona tecnología y artesanía, interviniendo piezas impresas en 3D y explorando conceptos de realidad virtual, sostenibilidad y emociones. Ha sido reconocido con premios como el Princesa de Girona, Ciudadano Europeo y ha aparecido en las listas Forbes 30under30 y de las 100 personas más creativas (2021 y 2024). Además, es colaborador en Radio Nacional, asesor en innovación social y speaker con dos charlas TEDx y ponencias internacionales.',
        likes: 0
    },
    {
        id: 2,
        name: 'Paloma Martín',
        img: 'https://i.imgur.com/eMZA58B.png',
        role: 'CEO Hoop Carpool',
        ponencia: 'Emprender con sentido: Redescubriendo la Inteligencia Colectiva en la Movilidad',
        cv: 'Emprendedora española, cofundadora y CEO de Hoop Carpool, una startup de movilidad sostenible que impulsa el uso compartido de vehículos en trayectos urbanos diarios. Nacida en Salamanca y formada en Marketing y Business Intelligence, trabajó en multinacionales como Fiat Chrysler y Philips Lighting antes de fundar Hoop en 2019. Bajo su liderazgo, la empresa ha facilitado más de 100.000 viajes y se ha expandido a Portugal, México y Colombia. Es reconocida por su compromiso con la sostenibilidad y la innovación urbana.',
        likes: 0
    },
    {
        id: 3,
        name: 'Pedro Llamas',
        img: 'https://i.imgur.com/wCWQVZf.png',
        role: 'Cómico',
        ponencia: 'Emprender es cosa de risa. El humor como motor de la Motivación',
        cv: 'Abandonó su profesión de Farmacéutico para dedicarse de lleno al mundo del espectáculo donde ha podido probar suerte en diversos medios, pasando por la televisión, el cine, la radio y el teatro. Se dio a conocer como monologuista en el canal de televisión Paramount Comedy y en la actualidad compagina su afición por la escritura con la interpretación de sus monólogos como integrante de la gira de teatro de "Las Noches del Club de la Comedia".',
        likes: 0
    }
];

const initialSpeakers = speakersData;

const scheduleData = [
    { time: '09:00', event: 'Recepción de asistentes' },
    { time: '09:30', event: 'Inauguración' },
    { time: '09:45', event: 'Conferencia Guillermo Martínez Gauna-Vivas: "Diseñando Ayudas, Imprimiendo Cambios Sociales"' },
    { time: '10:45', event: 'Tentempié' },
    { time: '11:45', event: 'Conferencia Paloma Martín: "Emprender con sentido: Redescubriendo la Inteligencia Colectiva en la Movilidad"' },
    { time: '12:45', event: 'Conferencia Pedro Llamas: "Emprender es cosa de risa. El humor como motor de la Motivación"' },
    { time: '13:45', event: 'Clausura' },
];

const initialQuestions = [
    { id: 1, text: 'Innovación', status: 'published', style: { top: '5%', left: '15%', transform: 'rotate(-5deg)', backgroundColor: '#B5EAD7' } },
    { id: 2, text: 'Movilidad', status: 'published', style: { top: '10%', left: '50%', transform: 'rotate(3deg)', backgroundColor: '#FEE440' } },
    { id: 3, text: 'Humor', status: 'published', style: { top: '40%', left: '30%', transform: 'rotate(8deg)', backgroundColor: '#A0CED9' } }
];

const initialCenters = [
    { id: 1, name: 'IES. JUAN ANTONIO FERNÁNDEZ', comments: [] },
    { id: 2, name: 'IES. LEOPOLDO QUEIPO', comments: [] },
    { id: 3, name: 'IES. MIGUEL FERNÁNDEZ', comments: [] },
    { id: 4, name: 'CIFP. REINA VICTORIA EUGENIA', comments: [] },
    { id: 5, name: 'IES. RUSADIR', comments: [] },
    { id: 6, name: 'IES VIRGEN DE LA VICTORIA', comments: [] },
    { id: 7, name: 'E. ARTE MIGUEL MARMOLEJO', comments: [] },
    { id: 8, name: 'CC. NTRA SRA. DEL BUEN CONSEJO', comments: [] },
    { id: 9, name: 'UGR Universidad de Granada en Melilla', comments: [] },
    { id: 10, name: 'IES. ENRIQUE NIETO', comments: [] },
];

const validEmails = [
    'mariateresa.vera@edumelilla.es',
    'franciscomanuel.morala@edumelilla.es',
    'pedrojavier.cilleruelo@edumelilla.es',
    'cifp.rveugenia@educacion.gob.es',
    'extraescolares.ies.rusadir@edumelilla.es',
    'juan.rios@edumelilla.es',
    'eeaa.melilla@educacion.gob.es',
    'juanmartinezfelices@hotmail.com',
    'mariaangustias.megias@edumelilla.es'
];

const noteColors = ['#B5EAD7', '#FEE440', '#A0CED9', '#FFD1BA', '#C7CEEA'];

// FIX: Made the `children` prop optional to resolve a TypeScript error where it was incorrectly reported as missing.
const Modal = ({ children, title, onClose }: { children?: React.ReactNode; title: string; onClose: () => void; }) => {
    return (
        <div className="backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onClose} aria-label="Cerrar modal">&times;</button>
                </header>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

const QRCode = ({ url }) => {
    // A simple, static SVG representation of a QR code.
    // In a real application, you might use a library to generate this dynamically.
    // This SVG encodes the text "XVIII Día del Emprendimiento Melilla"
    return (
      <svg className="qr-code-svg" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H7V7H0V0ZM1 1V6H6V1H1Z" fill="#212529"/>
        <path d="M2 2H5V5H2V2Z" fill="#212529"/>
        <path d="M18 0H25V7H18V0ZM19 1V6H24V1H19Z" fill="#212529"/>
        <path d="M20 2H23V5H20V2Z" fill="#212529"/>
        <path d="M0 18H7V25H0V18ZM1 19V24H6V19H1Z" fill="#212529"/>
        <path d="M2 20H5V23H2V20Z" fill="#212529"/>
        <path d="M9 1H10V2H9V1ZM11 1H12V2H11V1ZM14 1H15V2H14V1ZM16 1H17V2H16V1ZM10 2H11V3H10V2ZM12 2H13V3H12V2ZM15 2H16V3H15V2ZM8 3H9V4H8V3ZM13 3H14V4H13V3ZM17 3H18V4H17V3ZM9 4H10V5H9V4ZM11 4H12V5H11V4ZM14 4H15V5H14V4ZM16 4H17V5H16V4ZM10 5H11V6H10V5ZM12 5H13V6H12V5ZM15 5H16V6H15V5ZM8 6H9V7H8V6ZM13 6H14V7H13V6ZM17 6H18V7H17V6ZM1 8H9V9H1V8ZM10 8H11V9H10V8ZM12 8H13V9H12V8ZM15 8H17V9H15V9H15V8ZM18 8H19V9H18V8ZM20 8H21V9H20V8ZM23 8H24V9H23V8ZM2 9H3V10H2V9ZM4 9H5V10H4V9ZM6 9H7V10H6V9ZM11 9H12V10H11V9ZM13 9H14V10H13V9ZM17 9H18V10H17V9ZM21 9H23V10H21V9ZM1 10H2V11H1V10ZM3 10H4V11H3V10ZM5 10H6V11H5V10ZM8 10H10V11H8V10ZM12 10H13V11H12V10ZM14 10H15V11H14V10ZM16 10H17V11H16V10ZM18 10H19V11H18V10ZM20 10H21V11H20V10ZM23 10H24V11H23V10ZM2 11H3V12H2V11ZM4 11H5V12H4V11ZM6 11H8V12H6V12H6V11ZM9 11H10V12H9V11ZM11 11H12V12H11V11ZM13 11H14V12H13V11ZM15 11H16V12H15V11ZM19 11H20V12H19V11ZM22 11H23V12H22V11ZM24 11H25V12H24V11ZM1 12H2V13H1V12ZM5 12H6V13H5V12ZM8 12H9V13H8V12ZM10 12H11V13H10V12ZM12 12H13V13H12V12ZM14 12H15V13H14V12ZM16 12H18V13H16V12ZM20 12H21V13H20V12ZM23 12H24V13H23V12ZM2 13H4V14H2V13ZM6 13H7V14H6V13ZM9 13H10V14H9V13ZM11 13H12V14H11V13ZM15 13H16V14H15V13ZM17 13H18V14H17V13ZM19 13H20V14H19V13ZM21 13H22V14H21V13ZM24 13H25V14H24V13ZM1 14H2V15H1V14ZM3 14H5V15H3V14ZM6 14H7V15H6V14ZM8 14H9V15H8V14ZM10 14H11V15H10V14ZM12 14H14V15H12V14ZM16 14H17V15H16V14ZM18 14H19V15H18V14ZM22 14H23V15H22V14ZM1 15H3V16H1V15ZM4 15H5V16H4V15ZM6 15H8V16H6V15ZM10 15H12V16H10V15ZM14 15H15V16H14V15ZM16 15H17V16H16V15ZM19 15H21V16H19V15ZM23 15H24V16H23V15ZM1 16H2V17H1V16ZM3 16H4V17H3V16ZM5 16H6V17H5V16ZM9 16H10V17H9V16ZM12 16H13V17H12V16ZM15 16H16V17H15V16ZM17 16H19V17H17V16ZM20 16H21V17H20V16ZM22 16H23V17H22V16ZM8 17H9V18H8V17ZM10 17H11V18H10V17ZM13 17H14V18H13V17ZM16 17H18V18H16V17ZM18 17H20V18H18V17ZM21 17H22V18H21V17ZM23 17H25V18H23V17ZM8 18H9V19H8V18ZM11 18H12V19H11V18ZM14 18H16V19H14V18ZM19 18H20V19H19V18ZM22 18H23V19H22V18ZM10 19H11V20H10V19ZM12 19H14V20H12V19ZM16 19H17V20H16V19ZM18 19H19V20H18V19ZM20 19H21V20H20V19ZM23 19H24V20H23V19ZM8 20H10V21H8V20ZM11 20H12V21H11V20ZM13 20H14V21H13V20ZM15 20H17V21H15V20ZM20 20H21V21H20V20ZM22 20H23V21H22V20ZM10 21H11V22H10V21ZM12 21H13V22H12V21ZM14 21H15V22H14V21ZM16 21H18V22H16V21ZM19 21H20V22H19V21ZM24 21H25V22H24V21ZM8 22H9V23H8V22ZM11 22H13V23H11V22ZM15 22H16V23H15V22ZM17 22H18V23H17V22ZM19 22H20V23H19V22ZM21 22H22V23H21V22ZM23 22H24V23H23V22ZM9 23H10V24H9V23ZM13 23H14V24H13V23ZM16 23H17V24H16V23ZM18 23H19V24H18V23ZM20 23H22V24H20V23ZM10 24H12V25H10V24ZM14 24H15V25H14V24ZM17 24H18V25H17V24ZM19 24H20V25H19V24Z" fill="#212529"/>
      </svg>
    );
};

const Countdown = () => {
    const calculateTimeLeft = useCallback(() => {
        const difference = +new Date('2025-10-15T09:00:00') - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    }, []);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const formatTime = (time) => String(time).padStart(2, '0');

    const timerComponents = {
        days: 'Días',
        hours: 'Horas',
        minutes: 'Minutos',
        seconds: 'Segundos'
    };

    return (
        <div className="countdown-container">
            {Object.keys(timeLeft).length ? (
                Object.entries(timerComponents).map(([unit, label]) => (
                    <div className="time-block" key={unit}>
                        <div className="time-value">{formatTime(timeLeft[unit])}</div>
                        <div className="time-label">{label}</div>
                    </div>
                ))
            ) : (
                <span className="event-started">¡El evento ha comenzado!</span>
            )}
        </div>
    );
};

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

const App = () => {
    const [modal, setModal] = useState(null);
    const [questions, setQuestions] = useState(initialQuestions);
    const [newQuestion, setNewQuestion] = useState('');
    const [speakers, setSpeakers] = useState(initialSpeakers);
    const [likedSpeakers, setLikedSpeakers] = useState([]);
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);
    const [centers, setCenters] = useState(initialCenters);
    const [newComment, setNewComment] = useState({ centerId: '1', text: '', author: '', email: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    const closeModal = useCallback(() => {
      setModal(null);
      setSelectedSpeaker(null);
    }, []);

    useEffect(() => {
        const handleEsc = (event) => {
           if (event.keyCode === 27) {
            closeModal();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [closeModal]);

    const handleQuestionSubmit = (e) => {
        e.preventDefault();
        if (newQuestion.trim()) {
            const newNote = {
                id: Date.now(),
                text: newQuestion,
                status: 'published',
                style: {
                    backgroundColor: noteColors[Math.floor(Math.random() * noteColors.length)]
                }
            };
            setQuestions([...questions, newNote]);
            setNewQuestion('');
        }
    };
    
    const handleDeleteQuestion = (questionId) => {
        setQuestions(questions.filter(q => q.id !== questionId));
    };
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        if (!validEmails.includes(newComment.email.toLowerCase().trim())) {
            alert('Correo electrónico no autorizado. Por favor, utiliza un correo de la lista de asistentes.');
            return;
        }

        if (newComment.text.trim() && newComment.author.trim()) {
            setCenters(centers.map(center => 
                center.id === parseInt(newComment.centerId)
                ? { ...center, comments: [...center.comments, { text: newComment.text, author: newComment.author, status: 'pending' }] }
                : center
            ));
            setNewComment({ centerId: '1', text: '', author: '', email: '' });
            closeModal();
        }
    };

    const handleDeleteComment = (centerId, commentIndex) => {
        setCenters(centers.map(center => {
            if (center.id === centerId) {
                const updatedComments = center.comments.filter((_, index) => index !== commentIndex);
                return { ...center, comments: updatedComments };
            }
            return center;
        }));
    };

    const handlePublishComment = (centerId, commentIndex) => {
        setCenters(centers.map(center => {
            if (center.id === centerId) {
                const updatedComments = center.comments.map((comment, index) => {
                    if (index === commentIndex) {
                        return { ...comment, status: 'published' };
                    }
                    return comment;
                });
                return { ...center, comments: updatedComments };
            }
            return center;
        }));
    };
    
    const handleLikeSpeaker = (speakerId) => {
        const isLiked = likedSpeakers.includes(speakerId);
        
        setSpeakers(speakers.map(speaker => {
            if (speaker.id === speakerId) {
                return { ...speaker, likes: isLiked ? speaker.likes - 1 : speaker.likes + 1 };
            }
            return speaker;
        }));

        if (isLiked) {
            setLikedSpeakers(likedSpeakers.filter(id => id !== speakerId));
        } else {
            setLikedSpeakers([...likedSpeakers, speakerId]);
        }
    };


    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (adminEmail === 'jsaenz01@melilla.es' && adminPassword === 'oravla77') {
            setIsAdmin(true);
            closeModal();
        } else {
            alert('Credenciales incorrectas');
        }
        setAdminEmail('');
        setAdminPassword('');
    };

    const handleAdminClick = () => {
        if (isAdmin) {
            setIsAdmin(false);
        } else {
            setModal('login');
        }
    };

    return (
        <div className={`app-container ${isAdmin ? 'admin-mode' : ''}`}>
            <header className="hero-section">
                <div className="hero-content">
                    <div className="title-container">
                         <svg className="lightbulb-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2CB2BC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18h6v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z" />
                            <path d="M12 2A7 7 0 0 0 5 9c0 3.87 3.13 7 7 7s7-3.13 7-7a7 7 0 0 0-7-7z" />
                            <path d="M9.5 12.5c.66-1.17 2.34-1.17 3 0" />
                        </svg>
                        <h1>
                            XVIII DÍA DEL <br />
                            EMPRENDIMIENTO <br />
                            <span>MELILLA</span>
                        </h1>
                    </div>
                    <Countdown />
                    <button className="btn btn-primary" onClick={() => document.querySelector('main').scrollIntoView({ behavior: 'smooth' })}>Iniciar</button>
                </div>
                <div className="wave-shape"></div>
            </header>

            <main>
                <section className="card about-event">
                    <h2>CONSTRUYENDO EL FUTURO</h2>
                    <p>La XVIII edición del Día del Emprendimiento en el Teatro Kursaal, es un punto de encuentro para los cerca de 600 jóvenes de Bachillerato, FP y la UGR. El evento apuesta por el emprendimiento como motor de transformación e iniciativa en un mundo en constante cambio. Melilla se presenta como un territorio de oportunidades gracias a ventajas fiscales únicas y el firme compromiso con vuestra formación para liderar el futuro. La jornada incluye tres ponencias inspiradoras para que aprovechéis el apoyo y los recursos disponibles. Recordad: si decidís innovar y crear, Melilla os espera con los brazos abiertos. El futuro no se espera, ¡se construye!</p>
                </section>

                 <section className="card qr-code-section">
                    <QRCode url={typeof window !== 'undefined' ? window.location.href : ''} />
                    <div className="qr-code-text">
                        <h3>Accede desde tu Móvil</h3>
                        <p>Escanea este código QR con tu teléfono para acceder a la aplicación del evento.</p>
                    </div>
                </section>

                <div className="cards-grid">
                    <section className="card speakers-card">
                        <h2>Ponentes</h2>
                        <div className="speakers-list">
                            {speakers.map(speaker => (
                                <div key={speaker.id} className="speaker">
                                    <img src={speaker.img} alt={speaker.name} />
                                    <p>{speaker.name.split(' ')[0]}<br />{speaker.name.split(' ')[1]}</p>
                                    <div className="like-container">
                                        <button 
                                            className={`like-button ${likedSpeakers.includes(speaker.id) ? 'liked' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); handleLikeSpeaker(speaker.id); }}
                                            aria-label="Dar me gusta"
                                        >
                                            <HeartIcon />
                                        </button>
                                        <span className="like-count">{speaker.likes}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary" onClick={() => setModal('speakers')}>Ver todos</button>
                    </section>

                    <section className="card ideas-card">
                        <h2>Muro de <strong>Preguntas</strong></h2>
                        <div className="sticky-notes">
                            {questions.filter(q => q.status === 'published').slice(0, 3).map(idea => (
                                <div key={idea.id} className="note" style={idea.style}>{idea.text}</div>
                            ))}
                        </div>
                        <button className="btn btn-green" onClick={() => setModal('questions')}>Ver muro y preguntar</button>
                    </section>

                    <section className="card program-card">
                        <h2>Programa</h2>
                        <div className="calendar-icon">
                            <div className="calendar-top"></div>
                            <div className="calendar-body"></div>
                        </div>
                        <button className="btn btn-red" onClick={() => setModal('schedule')}>Ver programa</button>
                    </section>
                </div>

                <section className="card centers-card">
                    <h2>Centros Participantes</h2>
                    <div className="centers-list">
                        {centers.map(center => {
                            const publishedComments = center.comments.filter(c => c.status === 'published');
                            return (
                                <div key={center.id} className="center-item">
                                    <h3>{center.name}</h3>
                                    <div className="comments-list">
                                        {isAdmin ? (
                                            center.comments.length > 0 ? (
                                                center.comments.map((comment, index) => (
                                                    <div key={index} className={`comment-item ${comment.status}`}>
                                                        <div className="comment-content">
                                                            {comment.status === 'pending' && <span className="pending-badge">Pendiente de Revisión</span>}
                                                            <p>"{comment.text}"</p>
                                                            <span>- {comment.author}</span>
                                                        </div>
                                                        <div className="admin-actions">
                                                            {comment.status === 'pending' && (
                                                                <button
                                                                    className="publish-comment-btn"
                                                                    onClick={() => handlePublishComment(center.id, index)}
                                                                    aria-label="Publicar comentario"
                                                                >
                                                                    Publicar
                                                                </button>
                                                            )}
                                                            <button
                                                                className="delete-comment-btn"
                                                                onClick={() => handleDeleteComment(center.id, index)}
                                                                aria-label="Eliminar comentario"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="no-comments">No hay comentarios para este centro.</p>
                                            )
                                        ) : (
                                            publishedComments.length > 0 ? (
                                                publishedComments.map((comment, index) => (
                                                    <div key={index} className="comment-item">
                                                        <div>
                                                            <p>"{comment.text}"</p>
                                                            <span>- {comment.author}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="no-comments">Aún no hay comentarios.</p>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                     <button className="btn btn-primary" onClick={() => setModal('comment')}>Dejar un comentario</button>
                </section>

                <section className="collaborators-section">
                    <h2>Colaboradores</h2>
                    <div className="collaborators-logo-container">
                        <img src="https://i.imgur.com/IZiNfI4.png" alt="Logos de los colaboradores" className="collaborators-image" />
                    </div>
                </section>
            </main>
            
            <footer>
                <button className="btn btn-secondary" onClick={handleAdminClick}>
                    {isAdmin ? 'Salir del modo Admin' : 'Modo Administrador'}
                </button>
            </footer>


            {modal === 'speakers' && (
                <Modal title="Todos los Ponentes" onClose={closeModal}>
                    <div className="modal-speakers-grid">
                        {speakers.map(speaker => (
                             <div key={speaker.id} className="modal-speaker">
                                <div className="modal-speaker-clickable" onClick={() => setSelectedSpeaker(speaker)}>
                                    <img src={speaker.img} alt={speaker.name} />
                                    <h3>{speaker.name}</h3>
                                    <p>{speaker.role}</p>
                                </div>
                                <div className="like-container">
                                    <button 
                                        className={`like-button ${likedSpeakers.includes(speaker.id) ? 'liked' : ''}`}
                                        onClick={() => handleLikeSpeaker(speaker.id)}
                                        aria-label="Dar me gusta"
                                    >
                                        <HeartIcon />
                                    </button>
                                    <span className="like-count">{speaker.likes}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}

            {selectedSpeaker && (
                 <Modal title={selectedSpeaker.name} onClose={() => setSelectedSpeaker(null)}>
                    <div className="speaker-detail">
                        <img src={selectedSpeaker.img} alt={selectedSpeaker.name} />
                        <div className="speaker-detail-header">
                            <h3>{selectedSpeaker.role}</h3>
                             <div className="like-container">
                                <button 
                                    className={`like-button ${likedSpeakers.includes(selectedSpeaker.id) ? 'liked' : ''}`}
                                    onClick={() => handleLikeSpeaker(selectedSpeaker.id)}
                                    aria-label="Dar me gusta"
                                >
                                    <HeartIcon />
                                </button>
                                <span className="like-count">{speakers.find(s => s.id === selectedSpeaker.id)?.likes || selectedSpeaker.likes}</span>
                            </div>
                        </div>
                        <h4>Tema de la Ponencia</h4>
                        <p className="ponencia-title">"{selectedSpeaker.ponencia}"</p>
                        <h4>Sobre el ponente</h4>
                        <p>{selectedSpeaker.cv}</p>
                    </div>
                 </Modal>
            )}

            {modal === 'questions' && (
                <Modal title="Muro de Preguntas" onClose={closeModal}>
                    <div className="questions-list-modal">
                        {(isAdmin ? questions.slice().reverse() : questions.filter(q => q.status === 'published').slice().reverse()).map(question => (
                            <div key={question.id} className={`comment-item ${question.status}`}>
                                <div className="comment-content">
                                    <p>"{question.text}"</p>
                                </div>
                                {isAdmin && (
                                     <div className="admin-actions">
                                        <button
                                            className="delete-comment-btn"
                                            onClick={() => handleDeleteQuestion(question.id)}
                                            aria-label="Eliminar pregunta"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <form className="idea-form" onSubmit={handleQuestionSubmit}>
                        <label htmlFor="idea-input">¿Qué te gustaría preguntar a los ponentes?</label>
                        <textarea 
                            id="idea-input"
                            rows="4" 
                            placeholder="Escribe aquí tu pregunta..."
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            required
                         />
                        <button type="submit" className="btn btn-green">Enviar Pregunta</button>
                    </form>
                </Modal>
            )}
            
            {modal === 'comment' && (
                <Modal title="Dejar un Comentario" onClose={closeModal}>
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                         <label htmlFor="center-select">Selecciona tu centro:</label>
                        <select 
                            id="center-select" 
                            value={newComment.centerId} 
                            onChange={(e) => setNewComment({...newComment, centerId: e.target.value})}>
                            {centers.map(center => (
                                <option key={center.id} value={center.id}>{center.name}</option>
                            ))}
                        </select>
                        <label htmlFor="author-input">Tu nombre (y cargo):</label>
                        <input
                            id="author-input"
                            type="text"
                            placeholder="Ej: Ana Pérez, Profesora"
                            value={newComment.author}
                            onChange={(e) => setNewComment({...newComment, author: e.target.value})}
                            required
                        />
                         <label htmlFor="email-input">Tu correo electrónico:</label>
                        <input
                            id="email-input"
                            type="email"
                            placeholder="Introduce un correo autorizado"
                            value={newComment.email}
                            onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                            required
                        />
                        <label htmlFor="comment-input">Tu comentario sobre el evento:</label>
                        <textarea 
                            id="comment-input"
                            rows="4" 
                            placeholder="Escribe aquí tu comentario..."
                            value={newComment.text}
                            onChange={(e) => setNewComment({...newComment, text: e.target.value})}
                            required
                         />
                        <button type="submit" className="btn btn-primary">Enviar Comentario</button>
                    </form>
                </Modal>
            )}
            
            {modal === 'login' && (
                <Modal title="Acceso Administrador" onClose={closeModal}>
                    <form className="comment-form" onSubmit={handleAdminLogin}>
                        <label htmlFor="admin-email-input">Correo Electrónico:</label>
                        <input
                            id="admin-email-input"
                            type="email"
                            placeholder="admin@ejemplo.com"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="admin-password-input">Contraseña:</label>
                        <input
                            id="admin-password-input"
                            type="password"
                            placeholder="••••••••"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                    </form>
                </Modal>
            )}

            {modal === 'schedule' && (
                <Modal title="Programa del Evento" onClose={closeModal}>
                    <ul className="schedule-list">
                        {scheduleData.map(item => (
                             <li key={item.time}>
                                <strong>{item.time}</strong>
                                <span>{item.event}</span>
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}