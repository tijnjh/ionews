import * as v from 'valibot'
import { Comment } from './comment'

export const Story = v.object({
  author: v.string(),
  children: v.optional(v.union([v.array(v.number()), v.array(Comment)])),
  created_at: v.string(),
  created_at_i: v.number(),
  num_comments: v.optional(v.number()),
  objectID: v.string(),
  points: v.optional(v.number()),
  story_id: v.optional(v.number()),
  title: v.string(),
  updated_at: v.string(),
  url: v.optional(v.string()),
})

export type Story = v.InferOutput<typeof Story>
