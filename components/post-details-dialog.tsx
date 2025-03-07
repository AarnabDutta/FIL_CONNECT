"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import Image from "next/image"
import type { Post as ImportedPost } from "@/lib/types"

export type Post = ImportedPost & {
  user?: {
    username: string
  }
  createdAt?: string
}

interface PostDetailsDialogProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDetailsDialog({ post, open, onOpenChange }: PostDetailsDialogProps) {
  if (!post) return null

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date")
      }
      return format(date, "PPP")
    } catch (error) {
      console.error("Invalid date:", dateString)
      return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{post.title}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>By {post.user?.username}</span>
            {post.createdAt && (
              <>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </>
            )}
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            {post.content}
          </div>
          {post.mediaUrls && (
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              <Image 
                src={post.mediaUrls}
                alt={post.title}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}