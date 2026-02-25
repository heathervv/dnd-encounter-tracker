import { useMemo } from "react"
import type { MouseEvent } from "react"
import MDEditor from "@uiw/react-md-editor/nohighlight"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"

import { fetchSpecificSpell } from "../api/dnd-api"
import type { TransformedSpell } from "../api/types"

const Markdown = ({ source, openModal }: { source: string, openModal?: (value: TransformedSpell | null) => void }) => {
  const handleSpellClick = async (e: MouseEvent<HTMLElement>, spell: string) => {
    e.preventDefault()

    const spellUrl = spell
      .replace(/\s+/g, "-")
      .replace(/\/+/g, "-")
      .replace(/'+/g, "")
      .toLowerCase()
    const response = await fetchSpecificSpell(spellUrl)

    openModal?.(response)
  }

  // Replace custom spell wrapper to enable data enrichment
  const modifiedSource = useMemo(() => {
    let value = source
    const spellRegex = new RegExp(/(\[spell\])([A-Za-z '-/]+)(\[\/spell\])/g)
    if (spellRegex.test(source)) {
      value = source.replace(
        spellRegex,
        (_match, _prefix, spellName) => `\`${spellName}\``
      )
    }
    return value
  }, [source])

  return (
    <MDEditor.Markdown
      source={modifiedSource}
      // @ts-expect-error package type failing as their documentation says this exists
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
      remarkPlugins={[remarkGfm]}
      rehypeRewrite={(node) => {
        // @ts-expect-error yes it exists
        if (node.tagName === "code") {
          // @ts-expect-error yes it exists
          node.tagName = "button"
          // @ts-expect-error yes it exists
          node.properties = {
            // @ts-expect-error yes it exists
            onClick: (e) => handleSpellClick(e, node.children[0].value),
            className: "btn btn-xs",
          }
        }
        // @ts-expect-error yes it exists
        if (node.tagName === "p" || node.tagName === "li") {
          // @ts-expect-error yes it exists
          node.properties = {
            className: "text-base-content text-sm",
          }
        }
      }}
    />
  )
}

export default Markdown
