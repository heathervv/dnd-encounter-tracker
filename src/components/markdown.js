import MDEditor from '@uiw/react-md-editor/nohighlight'

const Markdown = ({ source }) => (
    <MDEditor.Markdown source={source} rehypeRewrite={(node, index, parent) => {
        if (node.tagName === "a") {
            node.properties = { ...node.properties, target: "_blank" }
        }
    }} />
)

export default Markdown