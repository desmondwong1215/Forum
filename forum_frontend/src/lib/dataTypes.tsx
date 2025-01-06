// frontend structure of post and comment

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

export type CommentProps = {
    key: number,
    id: number,
    content: string,
    like: number,
    clicked: boolean,
    user: string | undefined,
    deleteComment: (type: string, id: number) => Promise<void>
    edit: (id: number, isPost: boolean, newContent: string) => Promise<void>
    likeClicked: (commentId: number, like: number, clicked: boolean) => void
}

export type PostProps = {
    key: number,
    id: number,
    title: string,
    comments: comment[],
    like: number,
    clicked: boolean,
    user: string | undefined,
    sameUser: boolean,
    deleteItem: (type: string, id: number) => Promise<void>,
    likeClicked: (postId: number, commentId: number, like: number, clicked: boolean) => Promise<void>,
    edit: (id: number, isPost: boolean, newContent: string) => Promise<void>,
    submit: (postId: number, content: string) => Promise<void>,
}

export type DeleteItemProps = {
    type: string,
    dontDelete: () => void,
    wantDelete: () => void,
} 

export type InputProps = {
    value: string | undefined,
    type: string,
    submit: (content: string) => void,
    back: () => void,
}