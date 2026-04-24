export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AxeRecherche {
  id: number;
  nom: string;
  description: string;
  responsable?: {
    id: number;
    nom: string;
    prenom: string;
    grade: string;
    institution?: string;
    specialite?: string;
  };
  chercheurs?: {
    id: number;
    nom: string;
    prenom: string;
    grade: string;
    institution?: string;
    specialite?: string;
  }[];
}

export interface Publication {
  id: number;
  titre: string;
  type: string;
  annee: number;
  journal?: string;
  resume?: string;
  lienUrl?: string;
  doi?: string;
  classement?: string;
  sourceClassement?: string;
  statut?: 'BROUILLON' | 'SOUMIS' | 'PUBLIE';
  axe?: AxeRecherche;
  chercheur?: { id: number; nom: string; prenom: string; grade?: string };
}

export interface Chercheur {
  id: number;
  user?: User;
  nom: string;
  prenom: string;
  grade?: string;
  institution?: string;
  specialite?: string;
  photoUrl?: string;
  cvUrl?: string;
  bureau?: string;
  telephone?: string;
  biographie?: string;
  googleScholar?: string;
  researchGate?: string;
  orcid?: string;
  linkedin?: string;
  statut?: string;
  publications?: Publication[];
  axes?: AxeRecherche[];
}

export interface Photo {
  id: number;
  url: string;
  legende?: string;
  ordre?: number;
}

export interface Evenement {
  id: number;
  titre: string;
  dateEvenement: string;
  dateFin?: string;
  lieu?: string;
  description?: string;
  type?: string;
  statut?: string;
  photos?: Photo[];
}

export interface Doctorant {
  id: number;
  nom: string;
  prenom: string;
  sujetThese?: string;
  directeur?: {
    id: number;
    nom: string;
    prenom: string;
    grade?: string;
    institution?: string;
    specialite?: string;
  };
  dateInscription?: string;
  dateSoutenance?: string;
  statut?: string;
  mention?: string;
  photoUrl?: string;
  axeRecherche?: AxeRecherche;
  publications?: Publication[];
}

export interface Masterien {
  id: number;
  nom: string;
  prenom: string;
  sujetMemoire?: string;
  encadrant?: {
    id: number;
    nom: string;
    prenom: string;
    grade?: string;
    institution?: string;
    specialite?: string;
  };
  promotion?: string;
  statut?: string;
  axeRecherche?: AxeRecherche;
}

export interface Outil {
  id: number;
  nom: string;
  description: string;
  lienGithub: string;
  type: string;
  statut: string;
}