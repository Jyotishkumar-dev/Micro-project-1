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
