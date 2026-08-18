// This file ensures models are registered in the correct order
// Import models in order of dependencies
import { User } from './user';
import { Blog } from './blog';
import { Project } from './project';
import { Skill } from './skill';
import { Experience } from './experience';
import { Service } from './service';
import  Certification  from './certification';
import { Contact } from './contact';
import { Header } from './header';
import { Footer } from './footer';
import { Settings } from './settings';

// Export all models so they can be imported from a single place
export {
  User,
  Blog,
  Project,
  Skill,
  Experience, 
  Service,
  Certification,
  Contact,
  Header,
  Footer,
  Settings
};
