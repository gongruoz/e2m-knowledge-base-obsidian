import { PageFrame, PageFrameProps } from "./types"
import HeaderConstructor from "../Header"

const Header = HeaderConstructor()

/**
 * The default page frame — three-column layout with left sidebar, center
 * content (header + body + afterBody), and right sidebar, followed by a footer.
 *
 * This is the original Quartz layout, extracted from renderPage.tsx.
 */
export const DefaultFrame: PageFrame = {
  name: "default",
  render({
    componentData,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer,
  }: PageFrameProps) {
    const isHome = componentData.fileData.slug === "e2m-读书会资料库---index"
    const HomeGraph = right.find(
      (component) => (component as typeof component & { e2mGraph?: boolean }).e2mGraph,
    )

    return (
      <>
        <details class="left sidebar" open>
          <summary class="panel-toggle" aria-label="切换左侧目录" title="展开或收起目录">
            <svg class="panel-icon panel-icon--close" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="m16 15-3-3 3-3" />
            </svg>
            <svg class="panel-icon panel-icon--expand" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="m14 9 3 3-3 3" />
            </svg>
          </summary>
          <div class="panel-content">
            {left.map((BodyComponent) => (
              <BodyComponent {...componentData} />
            ))}
          </div>
        </details>
        <div class="center">
          <div class="page-header">
            <Header {...componentData}>
              {header.map((HeaderComponent) => (
                <HeaderComponent {...componentData} />
              ))}
            </Header>
            <div class="popover-hint">
              {beforeBody.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </div>
          </div>
          <Content {...componentData} />
          {isHome && HomeGraph && (
            <div class="home-graph">
              <HomeGraph {...componentData} />
            </div>
          )}
          <hr />
          <div class="page-footer">
            {afterBody.map((BodyComponent) => (
              <BodyComponent {...componentData} />
            ))}
          </div>
        </div>
        {!isHome && (
          <details class="right sidebar" open>
            <summary class="panel-toggle" aria-label="切换右侧辅助栏" title="展开或收起辅助栏">
              <svg class="panel-icon panel-icon--close" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M15 3v18" />
                <path d="m8 9 3 3-3 3" />
              </svg>
              <svg class="panel-icon panel-icon--expand" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M15 3v18" />
                <path d="m10 15-3-3 3-3" />
              </svg>
            </summary>
            <div class="panel-content">
              {right.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </div>
          </details>
        )}
        {footer.map((FooterComponent) => (
          <FooterComponent {...componentData} />
        ))}
      </>
    )
  },
}
