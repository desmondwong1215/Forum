// frontend structure of post, comment and the properties of different components.

export type comment = {
    id: number,
    year: string,
    month: string,
    day: string,
    content: string,
    like: number,
    clicked: boolean,
    user: string | undefined,
}

export type post = {
    year: string,
    month: string,
    day: string,
    id: number,
    title: string,
    content: string,
    comments: comment[],
    like: number,
    clicked: boolean,
    user: string | undefined,
}

export type CommentProps = {
    key: number,
    id: number,
    year: string,
    month: string,
    day: string,
    content: string,
    like: number,
    clicked: boolean,
    user: string | undefined,
    deleteComment: (type: string, id: number) => Promise<void>
    editComment: (id: number, newContent: string) => Promise<void>
    likeClicked: (commentId: number, like: number, clicked: boolean) => void
}

export type PostProps = {
    key: number,
    id: number,
    title: string,
    content: string,
    year: string,
    month: string,
    day: string,
    comments: comment[],
    like: number,
    clicked: boolean,
    user: string | undefined,
    sameUser: boolean,
    isLight: boolean,
    deleteItem: (type: string, id: number) => Promise<void>,
    likeClicked: (postId: number, commentId: number, like: number, clicked: boolean) => Promise<void>,
    editPost: (id: number, newTitle: string, newContent: string) => Promise<void>,
    editComment: (id: number, newContent: string) => Promise<void>,
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

export type CreatePostProps = {
    showCreatePost: boolean,
    submit: (title: string, content: string) => void,
    cancelCreatePost: () => void,
}

export type AccountBoxProps = {
    username: string | undefined,
    isLight: boolean,
    controlMode: () => void,
    setCreatePost: () => void,
    logOutBut: () => void
}

export type ForumNavBarProps = {
    username: string | undefined,
    keyWords: string,
    isLight: boolean,
    controlMode: () => void,
    setCreatePost: () => void,
    logOutBut: () => void,
    keyWordsOnChange: (event: React.FormEvent<EventTarget>) => void
}

export type MoreOptionsProps = {
    sameUser: boolean,
    showEdit: boolean,
    isLight: boolean,
    setShowEdit: (state: boolean) => void,
    delete: () => void,
}