--
-- PostgreSQL database dump
--

\restrict TfhGZyFTc8CpzgJKbWxpklTZ1QqdvUKsSG6XFCkertZD6ImveydPXNKeatEVfWf

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

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
-- Name: axes_recherche; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.axes_recherche (
    id bigint NOT NULL,
    nom character varying(150) NOT NULL,
    description text
);


ALTER TABLE public.axes_recherche OWNER TO postgres;

--
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
-- Name: axes_recherche_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.axes_recherche_id_seq OWNED BY public.axes_recherche.id;


--
-- Name: chercheur_axe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chercheur_axe (
    chercheur_id bigint NOT NULL,
    axe_id bigint NOT NULL
);


ALTER TABLE public.chercheur_axe OWNER TO postgres;

--
-- Name: chercheur_publication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chercheur_publication (
    chercheur_id bigint NOT NULL,
    publication_id bigint NOT NULL
);


ALTER TABLE public.chercheur_publication OWNER TO postgres;

--
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
-- Name: chercheurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chercheurs_id_seq OWNED BY public.chercheurs.id;


--
-- Name: doctorants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctorants (
    id bigint NOT NULL,
    user_id bigint,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    sujet_these character varying(255),
    directeur_id bigint
);


ALTER TABLE public.doctorants OWNER TO postgres;

--
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
-- Name: doctorants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctorants_id_seq OWNED BY public.doctorants.id;


--
-- Name: evenements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evenements (
    id bigint NOT NULL,
    titre character varying(255) NOT NULL,
    date_evenement date NOT NULL,
    lieu character varying(200),
    description text,
    type character varying(50)
);


ALTER TABLE public.evenements OWNER TO postgres;

--
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
-- Name: evenements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evenements_id_seq OWNED BY public.evenements.id;


--
-- Name: masteriens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.masteriens (
    id bigint NOT NULL,
    user_id bigint,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    sujet_memoire character varying(255),
    encadrant_id bigint
);


ALTER TABLE public.masteriens OWNER TO postgres;

--
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
-- Name: masteriens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.masteriens_id_seq OWNED BY public.masteriens.id;


--
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
-- Name: outils_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.outils_id_seq OWNED BY public.outils.id;


--
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
    axe_id bigint
);


ALTER TABLE public.publications OWNER TO postgres;

--
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
-- Name: publications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publications_id_seq OWNED BY public.publications.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(100) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    actif boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
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
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: axes_recherche id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.axes_recherche ALTER COLUMN id SET DEFAULT nextval('public.axes_recherche_id_seq'::regclass);


--
-- Name: chercheurs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheurs ALTER COLUMN id SET DEFAULT nextval('public.chercheurs_id_seq'::regclass);


--
-- Name: doctorants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctorants ALTER COLUMN id SET DEFAULT nextval('public.doctorants_id_seq'::regclass);


--
-- Name: evenements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evenements ALTER COLUMN id SET DEFAULT nextval('public.evenements_id_seq'::regclass);


--
-- Name: masteriens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.masteriens ALTER COLUMN id SET DEFAULT nextval('public.masteriens_id_seq'::regclass);


--
-- Name: outils id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outils ALTER COLUMN id SET DEFAULT nextval('public.outils_id_seq'::regclass);


--
-- Name: publications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications ALTER COLUMN id SET DEFAULT nextval('public.publications_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: axes_recherche; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.axes_recherche (id, nom, description) FROM stdin;
1	Intelligence Artificielle	Recherche en IA, machine learning et deep learning
2	Cybersécurité	Sécurité des systèmes et réseaux informatiques
3	IoT & Systèmes embarqués	Internet des objets et systèmes embarqués
\.


--
-- Data for Name: chercheur_axe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chercheur_axe (chercheur_id, axe_id) FROM stdin;
1	1
2	1
\.


--
-- Data for Name: chercheur_publication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chercheur_publication (chercheur_id, publication_id) FROM stdin;
1	1
2	2
3	3
\.


--
-- Data for Name: chercheurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chercheurs (id, user_id, nom, prenom, grade, institution, specialite, photo_url, cv_url, bureau, telephone, biographie, google_scholar, research_gate, orcid, linkedin) FROM stdin;
1	2	Ben Ali	Mohamed	Professeur	Université de Tunis	Intelligence Artificielle	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	3	Trabelsi	Sana	Maître de conférences	ENIS	Cybersécurité	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	4	Jlassi	Karim	Assistant	ISET	IoT	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: doctorants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctorants (id, user_id, nom, prenom, sujet_these, directeur_id) FROM stdin;
\.


--
-- Data for Name: evenements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evenements (id, titre, date_evenement, lieu, description, type) FROM stdin;
1	Séminaire IA Spring 2026	2026-04-22	Salle A LIMTIC	Séminaire sur les avancées en IA	Séminaire
2	Workshop NLP & Arabic AI	2026-05-05	Faculté des Sciences	Workshop international	Workshop
3	Soutenance PhD Trabelsi	2026-05-18	Amphithéâtre B	Soutenance de thèse	Soutenance
\.


--
-- Data for Name: masteriens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.masteriens (id, user_id, nom, prenom, sujet_memoire, encadrant_id) FROM stdin;
\.


--
-- Data for Name: outils; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.outils (id, nom, description, lien_github, type, statut) FROM stdin;
1	ArabicNLP Toolkit	Outil de traitement du langage arabe	https://github.com/limtic/arabicnlp	Logiciel	Disponible
2	IoT Security Scanner	Scanner de vulnérabilités IoT	https://github.com/limtic/iot-scanner	Outil	Disponible
\.


--
-- Data for Name: publications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publications (id, titre, type, annee, journal, resume, lien_url, axe_id) FROM stdin;
1	Deep learning pour le NLP en arabe	Journal	2024	IEEE Transactions	Étude sur le traitement du langage naturel arabe	\N	1
2	Cybersécurité dans les environnements IoT	Conference	2024	ACM CCS	Analyse des vulnérabilités IoT	\N	2
3	Détection d anomalies par ML	Journal	2023	Elsevier	Approches ML pour la détection d anomalies	\N	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, mot_de_passe, role, actif) FROM stdin;
2	ben.ali@limtic.tn	$2a$10$ARBUjkLTL9fMpfrf97YOHuD2aKtpBcMjRgLC01QGyNddBLsqbaTJC	CHERCHEUR	t
3	trabelsi@limtic.tn	$2a$10$GlzsZEsadIkS5PM.y0Hpv.vpl3n/LhRwOEZ86yaz5OMIQK2vJDsWW	CHERCHEUR	t
4	jlassi@limtic.tn	$2a$10$gWliidMtlt.FxTngb0Haz.2tAVTNtQ4SHK3tTV058ZKTCkvb1seMO	CHERCHEUR	t
1	admin@limtic.tn	$2a$10$9Yx82b9nAZ8HMz10a/rGH.YLyI7Q6ORuZw1MO25OWWJPS/VMCxD4W	ADMIN	t
\.


--
-- Name: axes_recherche_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.axes_recherche_id_seq', 3, true);


--
-- Name: chercheurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chercheurs_id_seq', 3, true);


--
-- Name: doctorants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctorants_id_seq', 1, false);


--
-- Name: evenements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evenements_id_seq', 3, true);


--
-- Name: masteriens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.masteriens_id_seq', 1, false);


--
-- Name: outils_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.outils_id_seq', 2, true);


--
-- Name: publications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publications_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: axes_recherche axes_recherche_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.axes_recherche
    ADD CONSTRAINT axes_recherche_pkey PRIMARY KEY (id);


--
-- Name: chercheur_axe chercheur_axe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_axe
    ADD CONSTRAINT chercheur_axe_pkey PRIMARY KEY (chercheur_id, axe_id);


--
-- Name: chercheur_publication chercheur_publication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_publication
    ADD CONSTRAINT chercheur_publication_pkey PRIMARY KEY (chercheur_id, publication_id);


--
-- Name: chercheurs chercheurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheurs
    ADD CONSTRAINT chercheurs_pkey PRIMARY KEY (id);


--
-- Name: doctorants doctorants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctorants
    ADD CONSTRAINT doctorants_pkey PRIMARY KEY (id);


--
-- Name: evenements evenements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evenements
    ADD CONSTRAINT evenements_pkey PRIMARY KEY (id);


--
-- Name: masteriens masteriens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.masteriens
    ADD CONSTRAINT masteriens_pkey PRIMARY KEY (id);


--
-- Name: outils outils_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outils
    ADD CONSTRAINT outils_pkey PRIMARY KEY (id);


--
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: chercheur_axe chercheur_axe_axe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_axe
    ADD CONSTRAINT chercheur_axe_axe_id_fkey FOREIGN KEY (axe_id) REFERENCES public.axes_recherche(id);


--
-- Name: chercheur_axe chercheur_axe_chercheur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_axe
    ADD CONSTRAINT chercheur_axe_chercheur_id_fkey FOREIGN KEY (chercheur_id) REFERENCES public.chercheurs(id);


--
-- Name: chercheur_publication chercheur_publication_chercheur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_publication
    ADD CONSTRAINT chercheur_publication_chercheur_id_fkey FOREIGN KEY (chercheur_id) REFERENCES public.chercheurs(id);


--
-- Name: chercheur_publication chercheur_publication_publication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheur_publication
    ADD CONSTRAINT chercheur_publication_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id);


--
-- Name: chercheurs chercheurs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chercheurs
    ADD CONSTRAINT chercheurs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: doctorants doctorants_directeur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctorants
    ADD CONSTRAINT doctorants_directeur_id_fkey FOREIGN KEY (directeur_id) REFERENCES public.chercheurs(id);


--
-- Name: doctorants doctorants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctorants
    ADD CONSTRAINT doctorants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: masteriens masteriens_encadrant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.masteriens
    ADD CONSTRAINT masteriens_encadrant_id_fkey FOREIGN KEY (encadrant_id) REFERENCES public.chercheurs(id);


--
-- Name: masteriens masteriens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.masteriens
    ADD CONSTRAINT masteriens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: publications publications_axe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_axe_id_fkey FOREIGN KEY (axe_id) REFERENCES public.axes_recherche(id);


--
-- PostgreSQL database dump complete
--

\unrestrict TfhGZyFTc8CpzgJKbWxpklTZ1QqdvUKsSG6XFCkertZD6ImveydPXNKeatEVfWf

