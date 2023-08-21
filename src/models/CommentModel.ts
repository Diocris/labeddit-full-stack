export interface CommentsDB {
    id: string,
    user_id: string,
    post_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface CommentsModel {
    id: string,
    userId: string,
    postId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string
}

export interface CommentsLikeDB {
    user_id: string,
    comment_id: string,
    like: number
}

export interface CommentsLikeModel {
    userId: string,
    comment: string,
    like: number
}

export class Comments {
    constructor(
        private id: string,
        private userId: string,
        private postId: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string,
    ) {
        this.id = id
        this.userId = userId
        this.postId = postId
        this.content = content
        this.likes = likes
        this.dislikes = dislikes
        this.createdAt = createdAt
        this.updatedAt = updatedAt

    }
    public getId(): string {
        return this.id
    }
    public setId(value: string): void {
        this.id = value
    }

    public getUserId(): string {
        return this.userId
    }
    public setUserId(value: string): void {
        this.userId = value
    }

    public getPostId(): string {
        return this.postId
    }

    public setPostId(value: string): void {
        this.postId = value
    }

    public getContent(): string {
        return this.content
    }
    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public getDislikes(): number {
        return this.dislikes
    }

    public setDislikes(value: number): void {
        this.dislikes = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public getUploadedAt(): string {
        return this.updatedAt
    }
    public setUpdateddAt(value: string): void {
        this.updatedAt = value
    }

    public postToDB() {
        return {
            id: this.getId(),
            creator_id: this.getUserId(),
            content: this.getContent(),
            likes: this.getLikes(),
            dislikes: this.getDislikes(),
            created_at: this.getCreatedAt(),
            uploaded_at: this.getUploadedAt()
        }
    }
}