import { useMemo } from 'react'
import MDEditor from '@uiw/react-md-editor/nohighlight'
import rehypeSanitize from 'rehype-sanitize'

const Markdown = ({ source }) => {
    // Replace custom spell wrapper with link
    const modifiedSource = useMemo(() => {
        let value = source
        const spellRegex = new RegExp(/(\[spell\])([A-Za-z '-/]+)(\[\/spell\])/g)
        if (spellRegex.test(source)) {
            value = source.replace(spellRegex, (m, _, spellName) => {
                const spellUrl = spellName.replace(/\s+/g, '-').replace(/\/+/g, '-').replace(/'+/g, '').toLowerCase()

                // DNDBeyond is being used *for now* because I like their UI.
                // However so many of their spells are paywalled, so this will likely
                // only be a temporary solution.
                return (
                    `[${spellName}](https://www.dndbeyond.com/spells/${spellUrl})`
                )
            })
        }
        return value
    }, [source])

    return (
        <MDEditor.Markdown
            source={modifiedSource}
            previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
            }}
            rehypeRewrite={(node, index, parent) => {
                if (node.tagName === 'a') {
                    node.properties = { ...node.properties, target: '_blank' }
                }
            }}
        />
    )
}

export default Markdown