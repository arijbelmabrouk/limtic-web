--
-- PostgreSQL database dump
--

\restrict giGBfmyj6vgaWzNAggae7khkMtfJ6CGzrRHJfYDqzrgq9RawoWj3vxGyu5XGRfF

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

-- Started on 2026-04-23 17:24:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16446)
-- Name: axes_recherche; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.axes_recherche (
    id bigint NOT NULL,
    nom character varying(150) NOT NULL,
    description text,
    responsable_id bigint
);


ALTER TABLE public.axes_recherche OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16445)
-- Name: axes_recherche_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.axes_recherche_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.axes_recherche_id_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 225
-- Name: axes_recherche_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.axes_recherche_id_seq OWNED BY public.axes_recherche.id;


--
-- TOC entry 234 (class 1259 OID 16501)
-- Name: chercheur_axe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chercheur_axe (
    chercheur_id bigint NOT NULL,
    axe_id bigint NOT NULL
);


ALTER TABLE public.chercheur_axe OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16486)
-- Name: chercheur_publication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chercheur_publication (
    chercheur_id bigint NOT NULL,
    publication_id bigint NOT NULL
);


ALTER TABLE public.chercheur_publication OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16398)
-- Name: chercheurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chercheurs (
    id bigint NOT NULL,
    user_id bigint,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    grade character varying(50),
    institution character varying(150),
    specialite character varying(150),
    photo_url character varying(255),
    cv_url character varying(255),
    bureau character varying(255),
    telephone character varying(255),
    biographie text,
    google_scholar character varying(255),
    research_gate character varying(255),
    orcid character varying(255),
    linkedin character varying(255)
);


ALTER TABLE public.chercheurs OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16397)
-- Name: chercheurs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chercheurs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chercheurs_id_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 219
-- Name: chercheurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chercheurs_id_seq OWNED BY public.chercheurs.id;


--
-- TOC entry 238 (class 1259 OID 16537)
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id bigint NOT NULL,
    nom character varying(100),
    email character varying(150),
    sujet character varying(200),
    message text,
    lu boolean DEFAULT false,
    cree_le timestamp without time zone DEFAULT now()
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16536)
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_messages_id_seq OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 237
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- TOC entry 222 (class 1259 OID 16412)
-- Name: doctorants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctorants (
    id bigint NOT NULL,
    user_id bigint,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    sujet_these character varying(255),
    directeur_id bigint,
    date_inscription date,
    statut character varying(50) DEFAULT 'EN_COURS'::character varying,
    mention character varying(100)
);


ALTER TABLE public.doctorants OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16411)
-- Name: doctorants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctorants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctorants_id_seq OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 221
-- Name: doctorants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctorants_id_seq OWNED BY public.doctorants.id;


--
-- TOC entry 230 (class 1259 OID 16469)
-- Name: evenements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evenements (
    id bigint NOT NULL,
    titre character varying(255) NOT NULL,
    date_evenement date NOT NULL,
    lieu character varying(200),
    description text,
    type character varying(50),
    date_fin date,
    statut character varying(30) DEFAULT 'A_VENIR'::character varying
);


ALTER TABLE public.evenements OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16468)
-- Name: evenements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evenements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evenements_id_seq OWNER TO postgres;

--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 229
-- Name: evenements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evenements_id_seq OWNED BY public.evenements.id;


--
-- TOC entry 224 (class 1259 OID 16429)
-- Name: masteriens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.masteriens (
    id bigint NOT NULL,
    user_id bigint,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    sujet_memoire character varying(255),
    encadrant_id bigint,
    promotion character varying(50),
    statut character varying(50) DEFAULT 'EN_COURS'::character varying
);


ALTER TABLE public.masteriens OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16428)
-- Name: masteriens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.masteriens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.masteriens_id_seq OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 223
-- Name: masteriens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.masteriens_id_seq OWNED BY public.masteriens.id;


--
-- TOC entry 232 (class 1259 OID 16478)
-- Name: outils; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.outils (
    id bigint NOT NULL,
    nom character varying(150) NOT NULL,
    description text,
    lien_github character varying(255),
    type character varying(50),
    statut character varying(30)
);


ALTER TABLE public.outils OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16477)
-- Name: outils_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.outils_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.outils_id_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 231
-- Name: outils_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.outils_id_seq OWNED BY public.outils.id;


--
-- TOC entry 236 (class 1259 OID 16518)
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id bigint NOT NULL,
    token character varying(255),
    email character varying(255),
    expiration timestamp without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16517)
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 235
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- TOC entry 240 (class 1259 OID 16548)
-- Name: photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.photos (
    id bigint NOT NULL,
    evenement_id bigint,
    url character varying(255),
    legende character varying(255),
    ordre integer DEFAULT 0
);


ALTER TABLE public.photos OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16547)
-- Name: photos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.photos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photos_id_seq OWNER TO postgres;

--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 239
-- Name: photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.photos_id_seq OWNED BY public.photos.id;


--
-- TOC entry 228 (class 1259 OID 16455)
-- Name: publications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publications (
    id bigint NOT NULL,
    titre character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    annee integer NOT NULL,
    journal character varying(150),
    resume text,
    lien_url character varying(255),
    axe_id bigint,
    doi character varying(255),
    classement character varying(50),
    source_classement character varying(50)
);


ALTER TABLE public.publications OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16454)
-- Name: publications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publications_id_seq OWNER TO postgres;

--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 227
-- Name: publications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publications_id_seq OWNED BY public.publications.id;


--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(100) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    actif boolean DEFAULT true NOT NULL,
    nom character varying(100),
    prenom character varying(100),
    avatar character varying(255),
    cree_le timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4808 (class 2604 OID 16449)
-- Name: axes_recherche id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.axes_recherche ALTER COLUMN id SET DEFAULT nextval('public.axes_recherche_id_seq'::regclass);


--
-- TOC entry 4803 (class 2604 OID 16401)
-- Name: chercheurs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheurs ALTER COLUMN id SET DEFAULT nextval('public.chercheurs_id_seq'::regclass);


--
-- TOC entry 4814 (class 2604 OID 16540)
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- TOC entry 4804 (class 2604 OID 16415)
-- Name: doctorants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctorants ALTER COLUMN id SET DEFAULT nextval('public.doctorants_id_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 16472)
-- Name: evenements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evenements ALTER COLUMN id SET DEFAULT nextval('public.evenements_id_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 16432)
-- Name: masteriens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.masteriens ALTER COLUMN id SET DEFAULT nextval('public.masteriens_id_seq'::regclass);


--
-- TOC entry 4812 (class 2604 OID 16481)
-- Name: outils id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outils ALTER COLUMN id SET DEFAULT nextval('public.outils_id_seq'::regclass);


--
-- TOC entry 4813 (class 2604 OID 16521)
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 16551)
-- Name: photos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photos ALTER COLUMN id SET DEFAULT nextval('public.photos_id_seq'::regclass);


--
-- TOC entry 4809 (class 2604 OID 16458)
-- Name: publications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications ALTER COLUMN id SET DEFAULT nextval('public.publications_id_seq'::regclass);


--
-- TOC entry 4800 (class 2604 OID 16392)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5013 (class 0 OID 16446)
-- Dependencies: 226
-- Data for Name: axes_recherche; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.axes_recherche (id, nom, description, responsable_id) FROM stdin;
1	Intelligence Artificielle	Recherche en IA, machine learning et deep learning	\N
2	Cybersécurité	Sécurité des systèmes et réseaux informatiques	\N
3	IoT & Systèmes embarqués	Internet des objets et systèmes embarqués	\N
\.


--
-- TOC entry 5021 (class 0 OID 16501)
-- Dependencies: 234
-- Data for Name: chercheur_axe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chercheur_axe (chercheur_id, axe_id) FROM stdin;
1	1
2	1
\.


--
-- TOC entry 5020 (class 0 OID 16486)
-- Dependencies: 233
-- Data for Name: chercheur_publication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chercheur_publication (chercheur_id, publication_id) FROM stdin;
1	1
2	2
3	3
\.


--
-- TOC entry 5007 (class 0 OID 16398)
-- Dependencies: 220
-- Data for Name: chercheurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chercheurs (id, user_id, nom, prenom, grade, institution, specialite, photo_url, cv_url, bureau, telephone, biographie, google_scholar, research_gate, orcid, linkedin) FROM stdin;
1	2	Ben Ali	Mohamed	Professeur	Université de Tunis	Intelligence Artificielle	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	3	Trabelsi	Sana	Maître de conférences	ENIS	Cybersécurité	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	4	Jlassi	Karim	Assistant	ISET	IoT	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	5	Test	Chercheur	Assistant	Université de Tunis	Informatique	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5025 (class 0 OID 16537)
-- Dependencies: 238
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, nom, email, sujet, message, lu, cree_le) FROM stdin;
\.


--
-- TOC entry 5009 (class 0 OID 16412)
-- Dependencies: 222
-- Data for Name: doctorants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctorants (id, user_id, nom, prenom, sujet_these, directeur_id, date_inscription, statut, mention) FROM stdin;
\.


--
-- TOC entry 5017 (class 0 OID 16469)
-- Dependencies: 230
-- Data for Name: evenements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evenements (id, titre, date_evenement, lieu, description, type, date_fin, statut) FROM stdin;
1	Séminaire IA Spring 2026	2026-04-22	Salle A LIMTIC	Séminaire sur les avancées en IA	Séminaire	\N	A_VENIR
2	Workshop NLP & Arabic AI	2026-05-05	Faculté des Sciences	Workshop international	Workshop	\N	A_VENIR
3	Soutenance PhD Trabelsi	2026-05-18	Amphithéâtre B	Soutenance de thèse	Soutenance	\N	A_VENIR
\.


--
-- TOC entry 5011 (class 0 OID 16429)
-- Dependencies: 224
-- Data for Name: masteriens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.masteriens (id, user_id, nom, prenom, sujet_memoire, encadrant_id, promotion, statut) FROM stdin;
\.


--
-- TOC entry 5019 (class 0 OID 16478)
-- Dependencies: 232
-- Data for Name: outils; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.outils (id, nom, description, lien_github, type, statut) FROM stdin;
1	ArabicNLP Toolkit	Outil de traitement du langage arabe	https://github.com/limtic/arabicnlp	Logiciel	Disponible
2	IoT Security Scanner	Scanner de vulnérabilités IoT	https://github.com/limtic/iot-scanner	Outil	Disponible
\.


--
-- TOC entry 5023 (class 0 OID 16518)
-- Dependencies: 236
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, token, email, expiration) FROM stdin;
1	2865e2b0-7f9d-43ab-98c6-d944c1b047e4	belmabroukarij@gmail.com	2026-04-23 17:55:40.020096
\.


--
-- TOC entry 5027 (class 0 OID 16548)
-- Dependencies: 240
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.photos (id, evenement_id, url, legende, ordre) FROM stdin;
\.


--
-- TOC entry 5015 (class 0 OID 16455)
-- Dependencies: 228
-- Data for Name: publications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publications (id, titre, type, annee, journal, resume, lien_url, axe_id, doi, classement, source_classement) FROM stdin;
1	Deep learning pour le NLP en arabe	Journal	2024	IEEE Transactions	Étude sur le traitement du langage naturel arabe	\N	1	\N	\N	\N
2	Cybersécurité dans les environnements IoT	Conference	2024	ACM CCS	Analyse des vulnérabilités IoT	\N	2	\N	\N	\N
3	Détection d anomalies par ML	Journal	2023	Elsevier	Approches ML pour la détection d anomalies	\N	1	\N	\N	\N
\.


--
-- TOC entry 5005 (class 0 OID 16389)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, mot_de_passe, role, actif, nom, prenom, avatar, cree_le) FROM stdin;
2	ben.ali@limtic.tn	$2a$10$ARBUjkLTL9fMpfrf97YOHuD2aKtpBcMjRgLC01QGyNddBLsqbaTJC	CHERCHEUR	t	\N	\N	\N	2026-04-23 17:15:28.893688
3	trabelsi@limtic.tn	$2a$10$GlzsZEsadIkS5PM.y0Hpv.vpl3n/LhRwOEZ86yaz5OMIQK2vJDsWW	CHERCHEUR	t	\N	\N	\N	2026-04-23 17:15:28.893688
4	jlassi@limtic.tn	$2a$10$gWliidMtlt.FxTngb0Haz.2tAVTNtQ4SHK3tTV058ZKTCkvb1seMO	CHERCHEUR	t	\N	\N	\N	2026-04-23 17:15:28.893688
1	admin@limtic.tn	$2a$10$9Yx82b9nAZ8HMz10a/rGH.YLyI7Q6ORuZw1MO25OWWJPS/VMCxD4W	ADMIN	t	\N	\N	\N	2026-04-23 17:15:28.893688
5	belmabroukarij@gmail.com	$2a$10$SrR5oxZ/BGraGeVGTlFVGuMomwskA9ZKxwWfi3PE5oRR38OHjuQ1C	CHERCHEUR	t	\N	\N	\N	2026-04-23 17:15:28.893688
\.


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 225
-- Name: axes_recherche_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.axes_recherche_id_seq', 3, true);


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 219
-- Name: chercheurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chercheurs_id_seq', 4, true);


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 237
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 1, false);


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 221
-- Name: doctorants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctorants_id_seq', 1, false);


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 229
-- Name: evenements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evenements_id_seq', 3, true);


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 223
-- Name: masteriens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.masteriens_id_seq', 1, false);


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 231
-- Name: outils_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.outils_id_seq', 2, true);


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 235
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 2, true);


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 239
-- Name: photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.photos_id_seq', 1, false);


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 227
-- Name: publications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publications_id_seq', 3, true);


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 4830 (class 2606 OID 16453)
-- Name: axes_recherche axes_recherche_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.axes_recherche
    ADD CONSTRAINT axes_recherche_pkey PRIMARY KEY (id);


--
-- TOC entry 4840 (class 2606 OID 16505)
-- Name: chercheur_axe chercheur_axe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_axe
    ADD CONSTRAINT chercheur_axe_pkey PRIMARY KEY (chercheur_id, axe_id);


--
-- TOC entry 4838 (class 2606 OID 16490)
-- Name: chercheur_publication chercheur_publication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_publication
    ADD CONSTRAINT chercheur_publication_pkey PRIMARY KEY (chercheur_id, publication_id);


--
-- TOC entry 4824 (class 2606 OID 16405)
-- Name: chercheurs chercheurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheurs
    ADD CONSTRAINT chercheurs_pkey PRIMARY KEY (id);


--
-- TOC entry 4844 (class 2606 OID 16546)
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 16417)
-- Name: doctorants doctorants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctorants
    ADD CONSTRAINT doctorants_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 16476)
-- Name: evenements evenements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evenements
    ADD CONSTRAINT evenements_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 16434)
-- Name: masteriens masteriens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.masteriens
    ADD CONSTRAINT masteriens_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 16485)
-- Name: outils outils_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outils
    ADD CONSTRAINT outils_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 16525)
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4846 (class 2606 OID 16556)
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 16462)
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (id);


--
-- TOC entry 4820 (class 2606 OID 16396)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4822 (class 2606 OID 16394)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 16563)
-- Name: axes_recherche axes_recherche_responsable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.axes_recherche
    ADD CONSTRAINT axes_recherche_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES public.chercheurs(id);


--
-- TOC entry 4856 (class 2606 OID 16511)
-- Name: chercheur_axe chercheur_axe_axe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_axe
    ADD CONSTRAINT chercheur_axe_axe_id_fkey FOREIGN KEY (axe_id) REFERENCES public.axes_recherche(id);


--
-- TOC entry 4857 (class 2606 OID 16506)
-- Name: chercheur_axe chercheur_axe_chercheur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_axe
    ADD CONSTRAINT chercheur_axe_chercheur_id_fkey FOREIGN KEY (chercheur_id) REFERENCES public.chercheurs(id);


--
-- TOC entry 4854 (class 2606 OID 16491)
-- Name: chercheur_publication chercheur_publication_chercheur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_publication
    ADD CONSTRAINT chercheur_publication_chercheur_id_fkey FOREIGN KEY (chercheur_id) REFERENCES public.chercheurs(id);


--
-- TOC entry 4855 (class 2606 OID 16496)
-- Name: chercheur_publication chercheur_publication_publication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_publication
    ADD CONSTRAINT chercheur_publication_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id);


--
-- TOC entry 4847 (class 2606 OID 16406)
-- Name: chercheurs chercheurs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheurs
    ADD CONSTRAINT chercheurs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4848 (class 2606 OID 16423)
-- Name: doctorants doctorants_directeur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctorants
    ADD CONSTRAINT doctorants_directeur_id_fkey FOREIGN KEY (directeur_id) REFERENCES public.chercheurs(id);


--
-- TOC entry 4849 (class 2606 OID 16418)
-- Name: doctorants doctorants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctorants
    ADD CONSTRAINT doctorants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4850 (class 2606 OID 16440)
-- Name: masteriens masteriens_encadrant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.masteriens
    ADD CONSTRAINT masteriens_encadrant_id_fkey FOREIGN KEY (encadrant_id) REFERENCES public.chercheurs(id);


--
-- TOC entry 4851 (class 2606 OID 16435)
-- Name: masteriens masteriens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.masteriens
    ADD CONSTRAINT masteriens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4858 (class 2606 OID 16557)
-- Name: photos photos_evenement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_evenement_id_fkey FOREIGN KEY (evenement_id) REFERENCES public.evenements(id) ON DELETE CASCADE;


--
-- TOC entry 4853 (class 2606 OID 16463)
-- Name: publications publications_axe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_axe_id_fkey FOREIGN KEY (axe_id) REFERENCES public.axes_recherche(id);


-- Completed on 2026-04-23 17:24:12

--
-- PostgreSQL database dump complete
--

\unrestrict giGBfmyj6vgaWzNAggae7khkMtfJ6CGzrRHJfYDqzrgq9RawoWj3vxGyu5XGRfF

