interface About {
  name: string;
  tagline: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  link: string;
}

interface Socials {
  LinkedIn: string;
  GitHub: string;
  [key: string]: string;
}

export interface Experience {
  companyName: string;
  jobDuration: string;
  jobRole: string;
  jobDescription: string;
}

interface Contact {
  email: string;
  phone: string;
  socials: Socials;
}

export interface Portfolio {
  about: About;
  skills: string[];
  projects: Project[];
  contact: Contact;
  experiences: Experience[];
}

interface Portfolios {
  portfolios: Portfolio[];
}
