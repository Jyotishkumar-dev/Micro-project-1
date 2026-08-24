export interface Project {
  id: string;
  title: string;
  category: 'all' | 'ai' | 'fullstack' | 'hackathon' | 'tools';
  tagline: string;
  shortDescription: string;
  problem: string;
  solution: string;
  image?: string;
  tags: string[];
  featured: boolean;
  status: 'Live' | 'Hackathon Build' | 'In Development' | 'Completed';
  githubUrl?: string;
  liveUrl?: string;
  caseStudy: {
    overview: string;
    problem: string;
    solution: string;
    keyFeatures: {
      title: string;
      description: string;
    }[];
    techStack: {
      category: string;
      skills: string[];
    }[];
    developmentProcess: {
      step: number;
      phase: string;
      description: string;
    }[];
    challenges: {
      challenge: string;
      resolution: string;
    }[];
    learnings: string[];
  };
}

export interface SkillCategory {
  title: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level?: string;
    icon?: string;
    featured?: boolean;
    description?: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location?: string;
  period: string;
  type: 'leadership' | 'community' | 'project' | 'education';
  highlights: string[];
  skills: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  event: string;
  year: string;
  category: 'hackathon' | 'certification' | 'workshop' | 'leadership';
  badge: string;
  description: string;
  details: string[];
  link?: string;
}

export interface LearningMilestone {
  title: string;
  status: 'mastered' | 'in-progress' | 'planned';
  category: string;
  description: string;
  topics: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar?: string;
  text: string;
  badge?: string;
  rating: number;
}
