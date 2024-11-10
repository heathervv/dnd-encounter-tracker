import { useMemo } from "react";
import MDEditor from "@uiw/react-md-editor/nohighlight";
import remarkGfm from 'remark-gfm'
import rehypeSanitize from "rehype-sanitize";

import { fetchSpecificSpell } from "../api/dnd-api";

const Markdown = ({ source, openModal }) => {
  const handleSpellClick = async (e, spell) => {
    e.preventDefault();

    const spellUrl = spell
      .replace(/\s+/g, "-")
      .replace(/\/+/g, "-")
      .replace(/'+/g, "")
      .toLowerCase();
    const response = await fetchSpecificSpell(spellUrl);

    openModal?.(response);
  };

  // Replace custom spell wrapper to enable data enrichment
  const modifiedSource = useMemo(() => {
    let value = source;
    const spellRegex = new RegExp(/(\[spell\])([A-Za-z '-/]+)(\[\/spell\])/g);
    if (spellRegex.test(source)) {
      value = source.replace(
        spellRegex,
        (m, _, spellName) => `\`${spellName}\``
      );
    }
    return value;
  }, [source]);

  return (
    <MDEditor.Markdown
      source={modifiedSource}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
      remarkPlugins={[remarkGfm]}
      rehypeRewrite={(node, index, parent) => {
        if (node.tagName === "code") {
          node.tagName = "button";
          node.properties = {
            onClick: (e) => handleSpellClick(e, node.children[0].value),
            className: "spellButton",
          };
        }
      }}
    />
  );
};

export default Markdown;
