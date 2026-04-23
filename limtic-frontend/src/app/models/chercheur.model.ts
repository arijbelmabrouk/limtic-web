export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AxeRecherche {
  id: number;
  nom: string;
  description: string;
  responsable?: {               // le chercheur responsable (optionnel)
    id: number;
    nom: string;
    prenom: string;
    grade: string;
  };
  chercheurs?: {                // liste des membres (optionnel)
    id: number;
    nom: string;
    prenom: string;
    grade: string;
  }[];
}

export interface Publication {
  id: number;
  titre: string;
  type: string;
  annee: number;
  journal: string;
  resume: string;
  lienUrl: string;
  axe: AxeRecherche;
}

export interface Chercheur {
  id: number;
  user: User;
  nom: string;
  prenom: string;
  grade: string;
  institution: string;
  specialite: string;
  photoUrl: string;
  cvUrl: string;
  statut?: string; 
  publications: Publication[];
  axes: AxeRecherche[];
}

export interface Evenement {
  id: number;
  titre: string;
  dateEvenement: string;
  lieu: string;
  description: string;
  type: string;
}

export interface Outil {
  id: number;
  nom: string;
  description: string;
  lienGithub: string;
  type: string;
  statut: string;
}