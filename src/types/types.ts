interface About {
  name: string;
  tagline: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  link: string;
}

interface Socials {
  LinkedIn: string;
  GitHub: string;
  [key: string]: string;
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
}
