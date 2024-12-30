export type comment = {
    id: number,
    content: string,
    like: number,
    clicked: boolean,
    user: string | undefined,
}

export type post = {
    id: number,
    title: string,
    comments: comment[],
    like: number,
    clicked: boolean,
    user: string | undefined,
}

export type likedItem = {
    type: string,
    user: string | undefined,
    postId: number,
    commentId: number | undefined,
}