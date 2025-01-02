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