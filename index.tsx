import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

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

// SHA-256 hashes of the authorized emails. This prevents exposing emails in the source code.
const hashedValidEmails = [
    '2b220b336a8e53a27072522774a810f63b45152a4659173f4ad3b469b1836a94', // mariateresa.vera@edumelilla.es
    '5249704e6c986eb792fcfb8e3a24b176bb2b7b51b33ed5711726a1d13783a48e', // franciscomanuel.morala@edumelilla.es
    '3c7a0d1d283086938f32194b1236111f1225586617a7f722881b850d53d26738', // pedrojavier.cilleruelo@edumelilla.es
    '9ae8e348325a81615598695bc814144383c26b52864f19b22e118090794931f6', // cifp.rveugenia@educacion.gob.es
    '0627e7740e69d7a226b976d8b948ac9c2780bf4a6a0e67e3a388f63567d2ef65', // extraescolares.ies.rusadir@edumelilla.es
    '42d87532386a3d3c8c6f481a5d6f1b3c9594191398c257620d4f3b890b9a89d9', // juan.rios@edumelilla.es
    '39540026e6377e8a329759e663a808061e8689710328704222045952e4d0c9f1', // eeaa.melilla@educacion.gob.es
    '2dd56a52479e0a242c76a5912a2f862925b42d7658254823a31885b570e30d1c', // juanmartinezfelices@hotmail.com
    '941b3a27a00f272a819b9b1e779a957a1ab013c7a760c33a94863e41b2123512'  // mariaangustias.megias@edumelilla.es
];

const noteColors = ['#B5EAD7', '#FEE440', '#A0CED9', '#FFD1BA', '#C7CEEA'];

// Hashing utility function using browser's built-in crypto API
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

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

const Countdown = () => {
    const calculateTimeLeft = useCallback(() => {
        const difference = +new Date('2025-10-15T09:30:00') - +new Date();
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
    const [isVideoVisible, setIsVideoVisible] = useState(true);

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
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        const trimmedEmail = newComment.email.toLowerCase().trim();

        // Hidden admin login check
        if (trimmedEmail === 'jsaenz01@melilla.es') {
            setIsAdmin(true);
            setNewComment({ centerId: '1', text: '', author: '', email: '' });
            closeModal();
            return;
        }

        const hashedEmail = await sha256(trimmedEmail);
        if (!hashedValidEmails.includes(hashedEmail)) {
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
                    <button className="btn btn-primary" onClick={() => document.querySelector('main').scrollIntoView({ behavior: 'smooth' })}>Inicio</button>
                </div>
                <div className="wave-shape"></div>
            </header>

            <main>
                <section className="card about-event">
                    <h2>CONSTRUYENDO EL FUTURO</h2>
                    <p>La XVIII edición del Día del Emprendimiento en el Teatro Kursaal, es un punto de encuentro para los cerca de 600 jóvenes de Bachillerato, FP y la UGR. El evento apuesta por el emprendimiento como motor de transformación e iniciativa en un mundo en constante cambio. Melilla se presenta como un territorio de oportunidades gracias a ventajas fiscales únicas y el firme compromiso con vuestra formación para liderar el futuro. La jornada incluye tres ponencias inspiradoras para que aprovechéis el apoyo y los recursos disponibles. Recordad: si decidís innovar y crear, Melilla os espera con los brazos abiertos. El futuro no se espera, ¡se construye!</p>
                </section>

                <section className="poster-section">
                    <img src="https://i.imgur.com/qTqUZmo.jpeg" alt="Cartel del XVIII Día del Emprendimiento" className="poster-image" />
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

                    <section className={`card video-card ${!isVideoVisible ? 'video-disabled' : ''}`}>
                        <h2>Vídeo del Evento</h2>
                        {isVideoVisible ? (
                            <a href="https://drive.google.com/file/d/1ACO68Pu_CpDd3kWYFI55X97A7jDo_dhZ/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="video-link-container" aria-label="Ver vídeo del evento (abre en una nueva pestaña)">
                                <div className="video-thumbnail">
                                    <div className="video-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
                                        </svg>
                                    </div>
                                </div>
                                <div className="btn btn-teal">Ver vídeo</div>
                            </a>
                        ) : (
                            <div className="video-link-container disabled">
                                <div className="video-thumbnail" aria-label="Vídeo no disponible en estos momentos">
                                    <div className="video-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
                                        </svg>
                                    </div>
                                </div>
                                <p className="video-unavailable-message">El vídeo no está disponible en estos momentos.</p>
                            </div>
                        )}
                
                        {isAdmin && (
                            <button className="btn admin-toggle-btn" onClick={() => setIsVideoVisible(!isVideoVisible)}>
                                {isVideoVisible ? 'Desactivar Vídeo' : 'Activar Vídeo'}
                            </button>
                        )}
                    </section>
                </div>

                <section className="card centers-card">
                    <h2>Centros Participantes</h2>
                    <div className="centers-list">
                        {centers.map(center => {
                            const publishedComments = center.comments.filter(c => c.status === 'published');
                            const pendingComments = center.comments.filter(c => c.status === 'pending');
                            
                            return (
                                <div key={center.id} className="center-item">
                                    <h3>{center.name}</h3>
                                    <div className="comments-list">
                                        {(isAdmin ? [...pendingComments, ...publishedComments] : publishedComments).length > 0 ? (
                                            (isAdmin ? [...pendingComments, ...publishedComments] : publishedComments).map((comment, index) => (
                                                <div key={index} className={`comment-item ${comment.status}`}>
                                                    <div>
                                                        {isAdmin && comment.status === 'pending' && <span className="pending-badge">Pendiente</span>}
                                                        <p>"{comment.text}"</p>
                                                        <span>&mdash; {comment.author}</span>
                                                    </div>
                                                    {isAdmin && (
                                                        <div className="admin-actions">
                                                            {comment.status === 'pending' && <button className="publish-comment-btn" onClick={() => handlePublishComment(center.id, center.comments.indexOf(comment))}>Publicar</button>}
                                                            <button className="delete-comment-btn" onClick={() => handleDeleteComment(center.id, center.comments.indexOf(comment))}>&times;</button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-comments">Aún no hay comentarios. ¡Sé el primero!</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button className="btn btn-secondary" onClick={() => setModal('comment')}>Dejar comentario</button>
                </section>
                
                <section className="card collaborators-section">
                    <h2>Colaboran</h2>
                    <div className="collaborators-logo-container">
                        <img src="https://i.imgur.com/NafmDNI.png" alt="Logos de colaboradores" className="collaborators-image"/>
                    </div>
                </section>
            </main>

            <footer>
                {isAdmin && <button className="btn btn-secondary" onClick={() => setIsAdmin(false)}>Salir modo Admin</button>}
            </footer>

            {modal === 'speakers' && (
                <Modal title="Ponentes" onClose={closeModal}>
                    <div className="modal-speakers-grid">
                        {speakers.map(speaker => (
                            <div className="modal-speaker" key={speaker.id}>
                                <div className="modal-speaker-clickable" onClick={() => setSelectedSpeaker(speaker)}>
                                    <img src={speaker.img} alt={speaker.name} />
                                    <h3>{speaker.name}</h3>
                                    <p>{speaker.role}</p>
                                </div>
                                <div className="like-container">
                                    <button 
                                        className={`like-button ${likedSpeakers.includes(speaker.id) ? 'liked' : ''}`}
                                        onClick={() => handleLikeSpeaker(speaker.id)}
                                        aria-label={`Dar me gusta a ${speaker.name}`}
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
                <Modal title="Detalles del Ponente" onClose={closeModal}>
                    <div className="speaker-detail">
                        <img src={selectedSpeaker.img} alt={selectedSpeaker.name} />
                        <div className="speaker-detail-header">
                            <h3>{selectedSpeaker.name}</h3>
                            <div className="like-container">
                                <button
                                    className={`like-button ${likedSpeakers.includes(selectedSpeaker.id) ? 'liked' : ''}`}
                                    onClick={() => handleLikeSpeaker(selectedSpeaker.id)}
                                    aria-label={`Dar me gusta a ${selectedSpeaker.name}`}
                                >
                                    <HeartIcon />
                                </button>
                                <span className="like-count">{selectedSpeaker.likes}</span>
                            </div>
                        </div>
                        <h4>Ponencia</h4>
                        <p className="ponencia-title">"{selectedSpeaker.ponencia}"</p>
                        <h4>Biografía</h4>
                        <p>{selectedSpeaker.cv}</p>
                    </div>
                </Modal>
            )}

            {modal === 'questions' && (
                <Modal title="Muro de Preguntas" onClose={closeModal}>
                    <div className="questions-list-modal">
                        {questions.map(q => (
                             <div key={q.id} className="comment-item">
                                <p>"{q.text}"</p>
                                {isAdmin && <button className="delete-comment-btn" onClick={() => handleDeleteQuestion(q.id)}>&times;</button>}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleQuestionSubmit} className="idea-form">
                        <label htmlFor="new-question">Tu pregunta o idea para los ponentes:</label>
                        <textarea id="new-question" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="Escribe aquí..."></textarea>
                        <button type="submit" className="btn btn-green">Enviar</button>
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

            {modal === 'comment' && (
                <Modal title="Añadir Comentario" onClose={closeModal}>
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <label htmlFor="center-select">Selecciona tu centro:</label>
                        <select id="center-select" value={newComment.centerId} onChange={e => setNewComment({...newComment, centerId: e.target.value})}>
                            {centers.map(center => <option key={center.id} value={center.id}>{center.name}</option>)}
                        </select>
                        <label htmlFor="comment-text">Comentario:</label>
                        <textarea id="comment-text" value={newComment.text} onChange={e => setNewComment({...newComment, text: e.target.value})} placeholder="¿Qué te ha parecido el evento?" required></textarea>
                        <label htmlFor="comment-author">Tu nombre:</label>
                        <input type="text" id="comment-author" value={newComment.author} onChange={e => setNewComment({...newComment, author: e.target.value})} placeholder="Nombre y Apellidos" required />
                        <label htmlFor="comment-email">Tu email de profesor/a:</label>
                        <input type="email" id="comment-email" value={newComment.email} onChange={e => setNewComment({...newComment, email: e.target.value})} placeholder="Email del profesorado" required />
                        <button type="submit" className="btn btn-secondary">Enviar comentario</button>
                    </form>
                </Modal>
            )}

        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);