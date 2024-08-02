import { createContentLoader } from 'vitepress'

export interface IPost{
    frontmatter: Record<string, any>,
    url: string,
    excerpt?: string,
}
declare const data: IPost[]
export { data }

export default createContentLoader('posts/*.md', {
    // 包含摘录
    excerpt: (file, opt) => {
        file.excerpt = file.content.substring(0, 120)
    },
    transform(rawData) {
        return rawData.filter(d=>d.frontmatter.date).sort((a, b) => {
            return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
        }).map((page) => {
            return {
                frontmatter: page.frontmatter,
                url: page.url,
                excerpt: page.excerpt,
            }
        })
    }
})