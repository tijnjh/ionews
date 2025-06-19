export interface Story {
  id: number;
  title: string;
  points: number;
  score: number;
  time: number;
  time_ago: string;
  type: "link";
  url: string;
  domain: string;
  descendants: number;
  comments: Comment[];
}

export interface Comment {
  id: number;
  level: number;
  user: string;
  time: number;
  time_ago: string;
  content: string;
  comments: Comment[];
}
