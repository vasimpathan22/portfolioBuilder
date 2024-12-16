import moment from "moment";

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
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
}

interface Contact {
  email: string;
  phone: string;
  socials: Socials;
}

interface PdfData {
  pdfBase64Data: string;
}

export interface Portfolio {
  about: About;
  skills: string[];
  projects: Project[];
  contact: Contact;
  experiences: Experience[];
  pdfData?: PdfData;
}
