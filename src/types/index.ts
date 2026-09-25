export interface Profile {
  id: string;
  name: string;
  label: string;
  role: string;
  headline: string;
  shortBio: string;
  aboutStory: string[];
  education: {
    degree: string;
    specialization: string;
    institution: string;
    poweredBy: string;
    period: string;
    cgpa?: string;
    location: string;
  };
  availability: string;
  location: string;
  timezone: string;
  email: string;
  profileImage: string;
  resumePath: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
    leetcode: string;
    youtube: string;
    hackerrank: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'frontend' | 'backend' | 'database' | 'tool' | 'core';
  proficiency: 'learning' | 'proficient' | 'advanced';
  context?: string;
  highlight?: boolean;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  shortDescription: string;
  problem: string;
  solution: string;
  myContribution: string;
  tags: string[];
  featured: boolean;
  status: 'Live' | 'Hackathon Build' | 'In Progress';
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  caseStudy: {
    problem: string;
    idea: string;
    whatIBuilt: string;
    keyFeatures: {
      title: string;
      description: string;
    }[];
    techStack: string[];
    challenges: {
      challenge: string;
      resolution: string;
    }[];
    learnings: string[];
  };
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  highlights: string[];
  type: 'leadership' | 'hackathon' | 'ambassador' | 'club' | 'workshop';
}

export interface LeadershipActivity {
  id: string;
  title: string;
  event: string;
  role: string;
  period: string;
  organization: string;
  description: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  year: string;
  badge: string;
  description: string;
  details: string[];
  link?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  metric?: string;
  link?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  projectType: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface SkillTier {
  title: string;
  subtitle: string;
  skills: {
    name: string;
    context?: string;
    highlight?: boolean;
  }[];
}

export interface JourneyMilestone {
  id: string;
  year: string;
  phase: string;
  title: string;
  description: string;
  takeaways: string[];
  category: 'foundation' | 'building' | 'leadership' | 'hackathon' | 'exploration';
}

export interface AchievementItem {
  id: string;
  title: string;
  event: string;
  year: string;
  badge: string;
  description: string;
  details: string[];
  link?: string;
}