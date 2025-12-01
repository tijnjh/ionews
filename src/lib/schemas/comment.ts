import * as v from 'valibot'

export interface Comment {
  created_at: string
  created_at_i: number
  id: number
  options: unknown[]
  parent_id: number
  points: number | null
  story_id: number
  text: string
  title: string | null
  type: 'comment'
  url: string | null
}

export const Comment: v.GenericSchema<Comment> = v.object({
  id: v.number(),
  created_at: v.string(),
  created_at_i: v.number(),
  options: v.array(v.unknown()),
  parent_id: v.number(),
  points: v.nullable(v.number()),
  story_id: v.number(),
  text: v.string(),
  title: v.nullable(v.string()),
  type: v.literal('comment'),
  url: v.nullable(v.string()),
  comments: v.array(v.lazy(() => Comment)),
})
