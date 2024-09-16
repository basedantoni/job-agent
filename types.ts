export type JobPost = {
  company: Company;
  website: string;
  shortDescription: string;
  tags?: Tag[];
  jobs: Job[];
};

export type Tag = {
  title: string;
};

export type Company = {
  title: string;
  applied: boolean;
};

export type Job = {
  title: string;
  applied: boolean;
  url: string;
};
