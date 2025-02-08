export type Post = {
  id: number;
  title: string;
  points: number;
  user: string;
  time: number;
  time_ago: string;
  comments_count: number;
  comments: Comment[];
  type: string;
  url: string;
  domain: string;
};

export type Comment = {
  id: number;
  level: number;
  user: string;
  time: number;
  time_ago: string;
  content: string;
  comments: Comment[];
};
