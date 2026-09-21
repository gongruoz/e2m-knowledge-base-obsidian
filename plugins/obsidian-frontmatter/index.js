import path from "node:path"
import YAML from "yaml"

// Quartz 5 does not parse YAML properties unless a transformer does so.
// Parse the vault's leading YAML document before the other Markdown plugins.
export const ObsidianFrontmatter = () => ({
  name: "ObsidianFrontmatter",
  markdownPlugins() {
    return [() => (tree, file) => {
      const source = String(file.value)
      const match = /^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)(?:\r?\n)?/.exec(source)
      if (!match) return

      let properties
      try {
        properties = YAML.parse(match[1])
      } catch (error) {
        file.message(`Invalid YAML properties: ${error.message}`)
        return
      }
      if (!properties || typeof properties !== "object" || Array.isArray(properties)) return

      const filename = path.basename(file.data.relativePath ?? file.path, ".md")
      const tags = properties.tags ?? []
      file.data.frontmatter = {
        ...properties,
        title: properties.title || filename,
        tags: Array.isArray(tags) ? tags : [tags],
      }
      const aliases = properties.aliases ?? properties.alias ?? []
      file.data.aliases = (Array.isArray(aliases) ? aliases : [aliases]).filter(
        (alias) => typeof alias === "string" && alias.length > 0,
      )

      // remark-parse sees YAML as ordinary Markdown. Remove those nodes so
      // Properties do not appear in articles, excerpts, or search results.
      tree.children = tree.children.filter(
        (node) => (node.position?.start.offset ?? 0) >= match[0].length,
      )
    }]
  },
})
