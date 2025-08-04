export interface postModel{
  id: number,
  title: string,
  author: string,
  author_team: string;
  content: string,
  created_at:Date,
  like_count: number,
  comment_count: number,
  permissions: {
    is_public: number,
    authenticated: number,
    team: number
  }
}
export interface postFinal extends postModel{
  liked:{id: number, bool: boolean} ;
}
